import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ type: String, required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @Length(8, 20)
  @IsAlphanumeric()
  password: string;
}
