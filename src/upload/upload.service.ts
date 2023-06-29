import { Injectable } from '@nestjs/common';
import * as AWS from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

@Injectable()
export class UploadService {
  private s3: AWS.S3;
  constructor() {
    this.s3 = new AWS.S3({
      region: 'sgp1', // Replace with your Space's region code
      endpoint: 'https://sgp1.digitaloceanspaces.com', // Replace with your Space's endpoint
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID, // Replace with your DigitalOcean Spaces access key
        secretAccessKey: process.env.SECRET_ACCESS_KEY, // Replace with your DigitalOcean Spaces secret key
      },
    });
  }

  // async uploadFile(file: Express.Multer.File): Promise<string> {
  //   const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
  //   if (!allowedFormats.includes(file.mimetype)) {
  //     throw new Error('Invalid file format');
  //   }
  //   const key = `books/${uuidv4()}.${file.mimetype.split('/')[1]}`;
  //   const params = {
  //     Bucket: 'elevateapp',
  //     Key: key,
  //     Body: file.buffer,
  //     ACL: 'public-read',
  //     ContentType: file.mimetype,
  //   };

  //   const imageURL = `https://cdn.theelevate.tech/${key}`;
  //   return new Promise((resolve, reject) => {
  //     this.s3.putObject(params, (err) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(imageURL);
  //     });
  //   });
  // }
  async uploadProfilePicture(file: Express.Multer.File): Promise<string> {
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedFormats.includes(file.mimetype)) {
      throw new Error('Invalid file format');
    }
    const key = `profile/${uuidv4()}.${file.mimetype.split('/')[1]}`;
    const params = {
      Bucket: 'elevateapp',
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    };
    const imageURL = `https://cdn.theelevate.tech/${key}`;
    return new Promise((resolve, reject) => {
      this.s3.putObject(params, (err) => {
        if (err) {
          reject(err);
        }
        resolve(imageURL);
      });
    });
  }

  async uploadFileFromUrl(url: string): Promise<string> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    const key = `books/${uuidv4()}.jpg`;
    const params = {
      Bucket: 'elevateapp',
      Key: key,
      ACL: 'public-read',
      Body: imageBuffer,
      ContentType: 'image/jpeg',
    };
    const imageURL = `https://cdn.theelevate.tech/${key}`;

    return new Promise((resolve, reject) => {
      this.s3.putObject(params, (err) => {
        if (err) {
          reject(err);
        }
        resolve(imageURL);
      });
    });
  }
}
