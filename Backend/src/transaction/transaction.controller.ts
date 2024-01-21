import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('transaction')
@ApiTags('API TRANSACTION')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({
    description: 'api for create transaction (borrow a books)',
  })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Post('return')
  @ApiOperation({
    description: 'api for create transaction (returning a books)',
  })
  returnBooks(@Body() returnBooksData: UpdateTransactionDto) {
    return this.transactionService.returnBook(returnBooksData);
  }
}
