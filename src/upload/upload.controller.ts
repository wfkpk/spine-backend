import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@Controller('files')
@ApiTags('File')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // @Post('/upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     fileFilter: (req, file, cb) => {
  //       if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
  //         return cb(
  //           new BadRequestException('Only image files are allowed!'),
  //           false,
  //         );
  //       }

  //       cb(null, true);
  //     },
  //   }),
  // )
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // async uploadImage(
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<string> {
  //   return this.uploadService.uploadFile(file);
  // }

  //THINKING OF HOW CAN I HANDLE MULTIPLE FILE UPLOAD FOR EVERY POST STILL COUDNT FIGURE OUT LETS SEE

  // @Post('post')
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 5 }]))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     maximum: 5,
  //     properties: {
  //       image: {
  //         type: 'string',
  //         format: 'binary',
  //         maximum: 5,
  //       },
  //     },
  //   },
  // })
  // async uploadPost(@UploadedFiles() files: Express.Multer.File[]) {
  // }
}
