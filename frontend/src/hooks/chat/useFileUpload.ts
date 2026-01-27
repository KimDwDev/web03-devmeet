import { UploadTicket } from '@/types/chat';
import {
  emitAck,
  pickCategory,
  putToPresignedUrl,
  sliceFile,
} from '@/utils/chat';
import { useCallback, useState } from 'react';
import { Socket } from 'socket.io-client';

export const useFileUpload = (socket: Socket | null) => {
  const [percent, setPercent] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);

  const requestUploadTicket = useCallback(
    async (file: File): Promise<UploadTicket> => {
      if (!socket?.connected) throw new Error('socket not connected');

      return emitAck(socket, 'signaling:ws:upload_file', {
        filename: file.name,
        mime_type: file.type || 'application/octet-stream',
        category: pickCategory(file),
        size: file.size,
      });
    },
    [socket],
  );

  const fileCheck = useCallback(
    async (payload: any) => {
      if (!socket?.connected) throw new Error('socket not connected');
      return emitAck(socket, 'signaling:ws:file_check', payload);
    },
    [socket],
  );

  const uploadFile = useCallback(
    async (file: File) => {
      if (!socket) return;

      setUploading(true);
      setPercent(0);

      try {
        const ticket = await requestUploadTicket(file);
        let finalPayload: any;

        // 이미 완료된 경우
        if (ticket.type === 'multipart_completed') {
          finalPayload = {
            file_id: ticket.file_id,
            type: 'direct',
            direct: { etag: 'SKIP' },
          };
        }

        // Direct Upload
        else if (ticket.type === 'direct') {
          const etag = await putToPresignedUrl({
            upload_url: ticket.direct.upload_url,
            blob: file,
            mime_type: file.type,
          });

          finalPayload = {
            file_id: ticket.file_id,
            type: 'direct',
            direct: { etag },
          };
        }

        // Multipart Upload
        else {
          const multipart =
            ticket.type === 'multipart'
              ? ticket.multipart
              : ticket.multipart_resume;
          const done =
            ticket.type === 'multipart_resume'
              ? new Map(
                  ticket.multipart_resume.complete_parts.map((p) => [
                    p.part_number,
                    p.etag,
                  ]),
                )
              : new Map();

          const parts = sliceFile(file, multipart.part_size);
          const urlMap = new Map(
            multipart.upload_urls.map((u) => [u.part_number, u.upload_url]),
          );
          const tags = [];

          for (let i = 0; i < parts.length; i++) {
            const p = parts[i];

            if (done.has(p.partNumber)) {
              tags.push({
                part_number: p.partNumber,
                etag: done.get(p.partNumber),
              });
            } else {
              const upload_url = urlMap.get(p.partNumber);
              if (!upload_url) continue;

              const etag = await putToPresignedUrl({
                upload_url,
                blob: p.blob,
                mime_type: file.type,
              });
              tags.push({ part_number: p.partNumber, etag });
            }
            setPercent(Math.floor(((i + 1) / parts.length) * 100));
          }

          finalPayload = {
            file_id: ticket.file_id,
            type: 'multipart',
            multipart: { upload_id: multipart.upload_id, tags },
          };
        }

        const res = await fileCheck(finalPayload);
        return res;
      } finally {
        setUploading(false);
      }
    },
    [fileCheck, requestUploadTicket, socket],
  );

  return {
    uploadFile,
    uploading,
    percent,
  };
};
