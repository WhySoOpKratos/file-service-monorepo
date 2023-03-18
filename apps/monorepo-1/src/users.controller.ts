import {
  Controller,
  Get,
  Put,
  Delete,
  UnauthorizedException,
  Req,
  Param,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import * as jwt from 'jsonwebtoken';
import { EditUserProfileDto } from './dtos/update-userProfile.dto';
import { TokenService } from '../../../constants/token/token.service';
import { JWT_SECRET_KEY } from 'constants/constant';

@ApiTags('User')
@Controller()
export class UsersController {
  constructor(
    private readonly userService: UserService,
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

  @Get('/logout')
  @ApiHeader({ name: 'Token' })
  async logout(@Req() req) {
    const userId = await this.canAccess(req);
    if (!userId) {
      throw new UnauthorizedException('you do not have access');
    }
    const result = await this.tokenService.logout(userId);
    return result;
  }

  @Get('/users')
  @ApiHeader({ name: 'Token' })
  @ApiParam({ name: 'pno', type: Number, required: true })
  async getUsers(@Req() req, @Param('pno') pno: number) {
    const userId = await this.canAccess(req);
    if (!userId) {
      throw new UnauthorizedException('you do not have access');
    }
    if (pno >= 0) {
      throw new BadRequestException('Page number can not be negative');
    }

    const result = await this.userService.getAllUsers(pno);
    return result;
  }

  @Get('/profile')
  @ApiHeader({ name: 'Token' })
  async getProfile(@Req() req) {
    const userId = await this.canAccess(req);
    if (!userId) {
      throw new UnauthorizedException('you do not have access');
    }
    const userProfile = await this.userService.getUserProfile(userId);
    return userProfile;
  }

  @Put('/profile')
  @ApiBody({ type: EditUserProfileDto })
  @ApiHeader({ name: 'Token' })
  async updateProfile(@Req() req, @Body() body: EditUserProfileDto) {
    const userId = await this.canAccess(req);
    if (!userId) {
      throw new UnauthorizedException('you do not have access');
    }
    const updatedProfile = await this.userService.UpdateUserProfile(
      userId,
      body,
    );
    return updatedProfile;
  }

  @Delete('/user')
  @ApiHeader({ name: 'Token' })
  async deleteUser(@Req() req) {
    const userId = await this.canAccess(req);
    if (!userId) {
      throw new UnauthorizedException('you do not have access');
    }
    // 1. delete the tokens, delete the profile then delete the user
    await this.tokenService.logout(userId);
    // await this.userService.deleteUserProfile(userId);
    const deletedUser = await this.userService.deleteUser(userId);
    return deletedUser;
  }
}
