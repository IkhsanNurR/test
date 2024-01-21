import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMemberDto } from './create-member.dto';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  penalized: boolean;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  penalized_until: Date;
}
