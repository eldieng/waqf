import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

interface UploadedFileType {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
}

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('test')
  @UseInterceptors(FileInterceptor('file'))
  async testUpload(
    @UploadedFile() file: UploadedFileType,
    @Body('folder') folder?: string,
  ) {
    const result = await this.uploadService.uploadImage(file, folder || 'waqf/test');
    return {
      success: true,
      message: 'Test upload successful!',
      data: result,
    };
  }

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: UploadedFileType,
    @Body('folder') folder?: string,
  ) {
    const result = await this.uploadService.uploadImage(file, folder || 'waqf');
    return {
      success: true,
      data: result,
    };
  }

  @Post('images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleImages(
    @UploadedFiles() files: UploadedFileType[],
    @Body('folder') folder?: string,
  ) {
    const results = await this.uploadService.uploadMultipleImages(
      files,
      folder || 'waqf',
    );
    return {
      success: true,
      data: results,
    };
  }

  @Delete(':publicId')
  @UseGuards(JwtAuthGuard)
  async deleteImage(@Param('publicId') publicId: string) {
    const success = await this.uploadService.deleteImage(publicId);
    return {
      success,
      message: success ? 'Image deleted successfully' : 'Failed to delete image',
    };
  }
}
