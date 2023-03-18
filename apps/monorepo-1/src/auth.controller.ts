import { BadRequestException, Controller, Get, Post } from '@nestjs/common';
import { Body, Param } from '@nestjs/common/decorators';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from './dtos/login-user.dto';
import { UserService } from './user.service';
import * as Argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { TokenService } from '../../../constants/token/token.service';
import { JWT_SECRET_KEY } from 'constants/constant';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('exists/:email')
  @ApiParam({ name: 'email', type: String, required: true })
  async verifyByEmail(@Param('email') email: string): Promise<boolean> {
    return this.userService.checkUserExistsByEmail(email);
  }

  @Post('register')
  @ApiBody({ type: LoginRequestDto })
  async registerUser(@Body() body: LoginRequestDto): Promise<any> {
    const { email, password } = body;
    const hash = await Argon2.hash(password);
    const newUser = await this.userService.create(email, hash);
    return newUser;
  }

  @Post('login')
  @ApiBody({ type: LoginRequestDto })
  async loginUser(@Body() body: LoginRequestDto): Promise<string> {
    const { email, password } = body;
    const foundedUser = await this.userService.getUserByEmail(email);
    if (!foundedUser) {
      throw new BadRequestException('Invalid username or password');
    }
    const { secret, id } = foundedUser;
    const verifiedUser = await Argon2.verify(secret, password);
    if (!verifiedUser) {
      throw new BadRequestException('Invalid username or password');
    }
    try {
      const token = jwt.sign(id, JWT_SECRET_KEY);
      await this.tokenService.addToken(id, token);
      return token;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
