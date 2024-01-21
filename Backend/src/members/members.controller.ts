import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { QueryParamsMembers } from 'src/dto/request.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('members')
@ApiTags('API-MEMBERS')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  findAll(@Query() params: QueryParamsMembers) {
    return this.membersService.findAll(params);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.membersService.findOne(code);
  }

  @Patch(':code')
  update(
    @Param('code') code: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.membersService.update(code, updateMemberDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.membersService.remove(code);
  }
}
