import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { extname } from 'path';

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
): void => {
  const regex = /\/(jpg|jpeg|png)$/;

  if (!regex.test(file.mimetype)) {
    return callback(
      new BadRequestException(
        'File not allowed. Type must be jpg, jpeg or png',
      ),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
): void => {
  const fieldName = file.fieldname;
  const userId = req.params.id;
  const fileExtName = extname(file.originalname);
  callback(null, `${fieldName}-${userId}${fileExtName}`);
};
