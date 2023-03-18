import { ObjectId } from 'mongoose';
import { FilesService } from './files.service';
import { Response as ExpressResponse } from 'express';
import * as path from 'path';

import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Req,
  UnauthorizedException,
  BadRequestException,
  Body,
  Response,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiTags,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { FileUploadRequestDto } from '../dtos/file.dto';
import { JWT_SECRET_KEY } from 'constants/constant';
import { TokenService } from 'constants/token/token.service';
import { FileNameDto } from '../dtos/file-name.dto';

@ApiTags('File')
@Controller()
export class FilesController {
  constructor(
    private readonly fileService: FilesService,
    private readonly tokenService: TokenService,
  ) {}

  private async canAccess(req): Promise<any> {
    const { token } = req.headers;
    if (!token || typeof token !== 'string' || token === '') {
      return;
    }
    const userToken = await this.tokenService.findToken(token);
    if (!userToken) {
      return;
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET_KEY);
      return payload;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async renameWithExtension(file) {
    const { mimetype, path } = file;
    let fileExt = '';
    switch (mimetype) {
      case 'image/jpeg': {
        fileExt = 'jpg';
      }
    }
    switch (mimetype) {
      case 'image/png': {
        fileExt = 'png';
      }
    }
    switch (mimetype) {
      case 'image/svg+xml': {
        fileExt = 'svg';
      }
    }
    const newPath = `${path}.${fileExt}`;
    await fs.promises.rename(path, newPath);
    return newPath;
  }

  @Post('/upload')
  @ApiHeader({ name: 'Token' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadRequestDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const userId = await this.canAccess(req);
    if (!userId) {
      throw new UnauthorizedException('you do not have access');
    }
    const { originalname } = file;
    const newPath = await this.renameWithExtension(file);
    console.log(file);

    return this.fileService.saveFile(newPath, originalname, userId);
  }

  @Get('/files')
  @ApiHeader({ name: 'Token' })
  @ApiParam({ name: 'pno', type: Number, required: true })
  async getFiles(@Req() req, @Param('pno') pno: number) {
    const userId = await this.canAccess(req);
    if (!userId) {
      throw new UnauthorizedException('you do not have access');
    }
    if (pno >= 0) {
      throw new BadRequestException('Page number can not be negative');
    }
    return this.fileService.getFiles(userId, pno);
  }

  @Get('/file/:id')
  @ApiHeader({ name: 'Token' })
  async getFile(
    @Req() req,
    @Param('id') id: string,
    @Response() res: ExpressResponse,
  ) {
    const userId = await this.canAccess(req);
    if (!userId) {
      throw new UnauthorizedException('you do not have access');
    }
    const lPath = await this.fileService.getFile(id);
    res.setHeader('Content-Type', 'image/jpeg');
    const fileStream = fs.createReadStream(path.join(process.cwd(), lPath));
    fileStream.pipe(res);
  }

  @Patch('/file/:id/name')
  @ApiHeader({ name: 'Token' })
  @ApiBody({ type: FileNameDto })
  async updateFileName(
    @Req() req,
    @Param('id') id: string,
    @Body() body: FileNameDto,
  ) {
    const userId = await this.canAccess(req);
    if (!userId) {
      throw new UnauthorizedException('you do not have access');
    }
    return this.fileService.updateFileName(id, body);
  }

  @Delete('/file/:id')
  @ApiHeader({ name: 'Token' })
  @ApiParam({ name: 'id', required: true })
  async deleteFile(@Req() req, @Param('id') id: string) {
    const userId = await this.canAccess(req);
    if (!userId) {
      throw new UnauthorizedException('you do not have access');
    }
    return this.fileService.deleteFile(id);
  }
}
