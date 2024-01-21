import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            create: jest.fn(),
            returnBook: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        books_code: 'JK-45',
        members_code: 'M001',
      };

      await controller.create(createTransactionDto);

      expect(service.create).toHaveBeenCalledWith(createTransactionDto);
    });
  });

  describe('returnBooks', () => {
    it('should return books', async () => {
      const returnBooksData: UpdateTransactionDto = {
        books_code: 'JK-45',
        members_code: 'M001',
      };

      await controller.returnBooks(returnBooksData);

      expect(service.returnBook).toHaveBeenCalledWith(returnBooksData);
    });
  });
});
