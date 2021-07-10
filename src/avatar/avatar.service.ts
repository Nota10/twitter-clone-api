import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class AvatarService {
  async upload(key: string, file: Express.Multer.File): Promise<any> {
    const s3 = new S3();

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Body: file.buffer,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, undefined, (err, data) => {
        if (err) {
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  async delete(key: string): Promise<any> {
    const s3 = new S3();

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };

    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        if (err) {
          reject(err.message);
        }
        resolve(data);
      });
    });
  }
}
