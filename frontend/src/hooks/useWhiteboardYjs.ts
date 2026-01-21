import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness';
import { Socket } from 'socket.io-client';
import { useWhiteboardSharedStore } from '@/store/useWhiteboardSharedStore';
import { useWhiteboardAwarenessStore } from '@/store/useWhiteboardAwarenessStore';
import type { WhiteboardItem } from '@/types/whiteboard';

export const useWhiteboardYjs = (socket: Socket | null) => {
  const ydocRef = useRef<Y.Doc | null>(null);
  const awarenessRef = useRef<awarenessProtocol.Awareness | null>(null);
  const yItemsRef = useRef<Y.Array<WhiteboardItem> | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const initializedRef = useRef(false);

  const setItems = useWhiteboardSharedStore((state) => state.setItems);
  const { updateUser, setMyUserId } = useWhiteboardAwarenessStore();

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    if (!socket?.connected) {
      return;
    }

    console.log('[Yjs] 초기화 시작, 소켓 ID:', socket.id);
    initializedRef.current = true;

    // Yjs 문서 생성
    const ydoc = new Y.Doc();
    const yItems = ydoc.getArray<WhiteboardItem>('items');
    const awareness = new awarenessProtocol.Awareness(ydoc);

    ydocRef.current = ydoc;
    yItemsRef.current = yItems;
    awarenessRef.current = awareness;

    // Store에 Yjs 인스턴스 저장
    useWhiteboardSharedStore.getState().setYjsInstances(yItems, awareness);

    // Backend에서 사용자 ID 받기
    socket.on('init-user', ({ userId }: { userId: string }) => {
      setMyUserId(userId);
      awareness.setLocalState({
        user: {
          id: userId,
          name: userId,
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        },
        cursor: null,
        selectedId: null,
      });
    });

    // Yjs → Socket
    ydoc.on('update', (update: Uint8Array, origin: Socket | null) => {
      if (origin !== socket) {
        socket.emit('yjs-update', update);
      }
    });

    // Socket → Yjs
    socket.on('yjs-update', (update: ArrayBuffer) => {
      Y.applyUpdate(ydoc, new Uint8Array(update), socket);
    });

    // Awareness 동기화
    awareness.on('update', () => {
      const update = awarenessProtocol.encodeAwarenessUpdate(awareness, [
        ydoc.clientID,
      ]);
      socket.emit('awareness-update', update);
    });

    socket.on('awareness-update', (update: ArrayBuffer) => {
      awarenessProtocol.applyAwarenessUpdate(
        awareness,
        new Uint8Array(update),
        socket,
      );
    });

    // 중간 입장하면 전체 상태 전송
    socket.on('request-sync', () => {
      const fullUpdate = Y.encodeStateAsUpdate(ydoc);
      socket.emit('yjs-update', fullUpdate);
    });

    // Yjs Array → SharedStore
    const handleYjsChange = () => {
      const newItems = yItems.toArray();

      // 중복 제거 (Map으로 마지막 것만 유지)
      const itemMap = new Map<string, WhiteboardItem>();
      newItems.forEach((item) => {
        itemMap.set(item.id, item);
      });

      const uniqueItems = Array.from(itemMap.values());
      setItems(uniqueItems);
    };

    yItems.observe(handleYjsChange);
    handleYjsChange();

    // Awareness 변경 감지
    awareness.on('change', () => {
      const states = awareness.getStates();
      states.forEach((state, clientId) => {
        if (clientId === ydoc.clientID) return;

        if (state.user) {
          updateUser(state.user.id, {
            id: state.user.id,
            name: state.user.name,
            color: state.user.color,
            cursor: state.cursor || null,
            selectedId: state.selectedId || null,
          });
        }
      });
    });

    console.log('[Yjs] 초기화 완료');

    cleanupRef.current = () => {
      initializedRef.current = false;
      useWhiteboardSharedStore.getState().setYjsInstances(null, null);
      yItems.unobserve(handleYjsChange);
      socket.off('yjs-update');
      socket.off('awareness-update');
      socket.off('request-sync');
      socket.off('init-user');
      ydoc.destroy();
    };
  }, [socket, setItems, updateUser, setMyUserId]);

  useEffect(() => {
    return () => cleanupRef.current?.();
  }, []);
};
