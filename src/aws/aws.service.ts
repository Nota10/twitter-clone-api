import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AWSError, S3 } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

@Injectable()
export class AwsService {
  constructor(private configService: ConfigService) {}

  async upload(
    key: string,
    file: Express.Multer.File,
  ): Promise<S3.ManagedUpload.SendData> {
    const s3 = new S3();

    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Body: file.buffer,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    return await s3.upload(params).promise();
  }

  async delete(
    key: string,
  ): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
    const s3 = new S3();

    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: key,
    };

    return await s3.deleteObject(params).promise();
  }
}
