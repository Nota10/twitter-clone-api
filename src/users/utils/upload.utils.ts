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
        `Arquivo '${file.mimetype}' não permitido. O tipo deve ser jpg, jpeg ou png`,
      ),
      false,
    );
  }
  callback(null, true);
};

export const videoFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
): void => {
  const regex = /\/(mp4|mov|mkv)$/;

  if (!regex.test(file.mimetype)) {
    return callback(
      new BadRequestException(
        `Arquivo '${file.mimetype}' não permitido. O tipo deve ser mp4, mov ou mkv`,
      ),
      false,
    );
  }
  callback(null, true);
};

export const generateFileKey = (
  key: string,
  file: Express.Multer.File,
): string => {
  const fieldName = file.fieldname;
  const fileExtName = extname(file.originalname);
  return `${fieldName}-${key}${fileExtName}`;
};
