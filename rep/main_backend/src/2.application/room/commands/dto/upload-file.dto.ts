

export type UploadFileDto = {
  room_id : string;
  user_id : string;
  filename : string;
  mime_type : string;
  size : number;
};

export type DirectUploadInfo = {
  upload_url : string;
};

export type MultipartUploadInitInfo = {
  upload_id : string; 
  part_size : number;
};

export type MultipartCompletedPart = {
  part_number : number;
  etag : string;
};

export type MultipartUploadCompleteInfo = {
  upload_id : string;
  complete_parts : Array<MultipartCompletedPart>,
  part_size : number;
}; 

export type UploadFileResult = {
  type : "direct" | "multipart" | "multipart_complete";

  mini : DirectUploadInfo | null;

  big : MultipartUploadInitInfo | null;

  change : MultipartUploadCompleteInfo | null;
};