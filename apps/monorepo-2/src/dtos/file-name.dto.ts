import { ApiProperty } from '@nestjs/swagger';

export class FileNameDto {
  @ApiProperty({ type: String, required: true })
  name: string;
}
