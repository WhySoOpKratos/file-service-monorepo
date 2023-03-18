import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Token, TokenSchema } from 'constants/token/schemas/token.schema';
import { TokenService } from 'constants/token/token.service';
import { FilesController } from './files/files.controller';
import { FilesService } from './files/files.service';
import { Files, FileSchema } from './schemas/files.schemas';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    MongooseModule.forRoot(
      'mongodb+srv://dbadmin:Ibf8hk3e3LwFVLUO@m01.koauguq.mongodb.net/User-microservice?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([{ name: Files.name, schema: FileSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  controllers: [FilesController],
  providers: [FilesService, TokenService],
})
export class AppModule {}
