import { UserService } from './user.service';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';

import { User, UserSchema } from './schemas/user.schema';
import { UserProfile, UserProfileSchema } from './schemas/user-profile.schema';
import {
  Token,
  TokenSchema,
} from '../../../constants/token/schemas/token.schema';
import { TokenService } from '../../../constants/token/token.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://dbadmin:Ibf8hk3e3LwFVLUO@m01.koauguq.mongodb.net/User-microservice?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
  ],

  controllers: [UsersController, AuthController],
  providers: [UserService, TokenService],
})
export class AppModule {}
