import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle(`Twitter clone API`)
  .setDescription(`This is the documentation related the Twitter Clone project`)
  .setVersion('1.0')
  .addTag(`Twitter`)
  .build();
