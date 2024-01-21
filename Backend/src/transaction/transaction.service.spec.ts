import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { members, books, transaction } from '../../models';
import { CustomError } from '../utils/customError';
import { Sequelize } from 'sequelize-typescript';
import { MyResponse } from '../utils/response.interface';

jest.mock('../../models', () => ({
  books: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
    decrement: jest.fn(),
  },
  members: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
  },
  transaction: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
  },
}));

const transactionMock = {
  rollback: jest.fn(),
  commit: jest.fn(),
};

describe('TransactionService', () => {
  let service: TransactionService;
  let sequelizeMock: Sequelize;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: Sequelize,
          useValue: {
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    sequelizeMock = module.get<Sequelize>(Sequelize);
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        members_code: 'M002',
        books_code: 'JK-45',
      };

      const membersMockData = {
        members_code: 'M001',
        name: 'John Doe',
        created_at: '2024-01-19T12:05:37.159Z',
        updated_at: '2024-01-19T12:05:37.199Z',
        penalized: false,
        penalized_until: null,
        transactions: [], // Mocking an empty array for transactions
      };

      const expectedBooks = {
        books_code: 'HOB-83',
        title: 'The Hobbit, or There and Back Again',
        author: 'J.R.R. Tolkien',
        stock: 10,
        updated_at: '2024-01-19T12:03:12.873Z',
        created_at: '2024-01-19T12:03:12.873Z',
      };
      const findMembersMock = jest
        .spyOn(members, 'findByPk')
        .mockResolvedValue(membersMockData as any);

      const findBooksMock = jest
        .spyOn(books, 'findByPk')
        .mockResolvedValue(expectedBooks as any);

      const expectedDecrement = {
        affectedRows: [
          {
            books_code: 'HOB-83',
            title: 'The Hobbit, or There and Back Again',
            author: 'J.R.R. Tolkien',
            stock: 9,
            updated_at: '2024-01-19T12:03:12.873Z',
            created_at: '2024-01-19T12:03:12.873Z',
          },
        ],
        affectedCount: 1, // Assuming 1 affected count
      };

      const decrementBookMock = jest
        .spyOn(books, 'decrement')
        .mockResolvedValue(expectedDecrement as any);

      const createTransactionMock = jest
        .spyOn(transaction, 'create')
        .mockResolvedValueOnce({});

      const sequelizeTransactionMock = jest
        .spyOn(sequelizeMock, 'transaction')
        .mockResolvedValueOnce(transactionMock as any);

      const result: MyResponse = await service.create(createTransactionDto);

      expect(findMembersMock).toHaveBeenCalled();
      expect(findBooksMock).toHaveBeenCalled();
      expect(decrementBookMock).toHaveBeenCalled();
      expect(createTransactionMock).toHaveBeenCalled();
      expect(transactionMock.commit).toHaveBeenCalled();
      expect(result.statusCode).toEqual(200);
    });
  });
});
