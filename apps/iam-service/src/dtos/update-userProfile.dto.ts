import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AddressDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  line1: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  line2?: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  country: string;
}

export class EditUserProfileDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ type: Date, required: true })
  dob: Date;

  @ApiProperty({ type: AddressDto, required: true })
  @ValidateNested()
  address: AddressDto;

  @ApiProperty({ type: Number, required: true })
  @IsOptional()
  phone: number;
}
