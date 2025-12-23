import { GetUploadUrlFromDisk } from "@app/ports/disk/disk.inbound";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Inject } from "@nestjs/common";
import { S3_DISK } from "../../disk.constants";
import { ConfigService } from "@nestjs/config";
import path from "path";


export class GetPresignedUrlFromS3Bucket extends GetUploadUrlFromDisk<S3Client> {
  
  // 받아오기 
  constructor( 
    @Inject(S3_DISK) disk : S3Client,
    private readonly config : ConfigService
  ) {
    super(disk);
  }

  // path의 옵션은 card_id/item_id/filename
  async getUrl({ pathName, mime_type } : { pathName: Array<string>; mime_type: string; }): Promise<string> {
    
    // 설정
    const key_name : string = path.posix.join(...pathName); // os와 상관없이 규칙을 /로 통일
    const Bucket : string = this.config.get<string>("NODE_APP_AWS_BUCKET_NAME", "bucket_name");
    const expiresIn : number = this.config.get<number>("NODE_APP_AWS_PRESIGNED_URL_EXPIRES_SEC", 180);

    const command = new PutObjectCommand({
      Bucket,
      Key : key_name,
      ContentType : mime_type
    });

    // url 요청
    const uploadUrl = await getSignedUrl(this.disk, command, {
      expiresIn
    });

    return uploadUrl;
  }
};