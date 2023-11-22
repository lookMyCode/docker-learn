import { Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DBService } from './db.service';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';


export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(32))
    .join('');

  callback(null, `${randomName}-${Date.now()}${fileExtName}`);
}

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
}


@Controller()
export class AppController {

  constructor(private db: DBService) {}

  @Get()
  async getList() {
    const images: any[] = await this.db.sendQuery(`SELECT id, url FROM images`);
    return images.map(x => x.url);
  }

  @Post() 
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    const fileName = file.filename;
    const url = `/images/${fileName}`;
    await this.db.sendQuery(`INSERT INTO images(url) VALUES (?)`, [url]);
    return;
  }

  @Get('images/:imgpath')
  getImage(@Param('imgpath') image, @Res() res) {
    return res.sendFile(
      image, 
      {root: './files/images'},
      err => {
        if (err) {
          const status = (err as any).status || 404;
          res.status(status).send()
        }
      }
    );
  }
}
