import { Files, FilesDocument } from './../schemas/files.schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FileNameDto } from '../dtos/file-name.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(Files.name) private fileModel: Model<FilesDocument>,
  ) {}
  async saveFile(
    path: string,
    fileName: string,
    userId: ObjectId,
  ): Promise<any> {
    try {
      const now: Date = new Date();
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      };
      const uploadedDate: string = now.toLocaleDateString('en-US', options);

      await this.fileModel.create({
        path,
        name: fileName,
        userId,
        uploadedDate,
      });
    } catch (error) {
      console.error(error.message);
      throw new Error('Could not save the file');
    }
  }
  async getFiles(userId: ObjectId, pno: number) {
    const PAGINATION_LIMIT = 10;
    const users = await this.fileModel
      .find({ userId })
      .limit(PAGINATION_LIMIT)
      .skip(pno * PAGINATION_LIMIT)
      .exec();
    const modifiedUsers = users.map((user) => ({
      id: user._id.toString(),
      ...user.toObject(),
      _id: undefined,
    }));
    return modifiedUsers;
  }
  async getFile(id: string) {
    const file = await this.fileModel.findById(id);
    return file.path;
  }
  async updateFileName(id: string, body: FileNameDto) {
    const file = await this.fileModel.findById(id);

    const extension = file.name.substring(file.name.lastIndexOf('.') + 1);

    const newName = body.name.concat('.', extension);

    const updatedFile = await this.fileModel.findOneAndUpdate(
      { _id: id },
      { $set: { name: newName } },
      { new: true },
    );

    return updatedFile;
  }
  async deleteFile(id: string) {
    return this.fileModel.deleteOne({ _id: id });
    return;
  }
}
