import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}
  addToken(userId: ObjectId, token: string) {
    return this.tokenModel.create({ token, userId });
  }

  findToken(token: string) {
    return this.tokenModel.findOne({ token });
  }

  async logout(userId) {
    await this.tokenModel.deleteMany({ userId });
    return 'succesfull';
  }
}
