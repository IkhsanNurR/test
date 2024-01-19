import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { MyResponse } from '../utils/response.interface';
import { QueryParams, SortOrder } from '../dto/request.dto';

jest.mock('../../models/books', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return {
    books: dbMock.define('books', {
      books_code: 'NRN-7',
      title: 'The Lion, the Witch and the Wardrobe',
      author: 'C.S. Lewis',
      stock: 10,
      updated_at: '2024-01-19T12:03:12.873Z',
      created_at: '2024-01-19T12:03:12.873Z',
    }),
  };
});

jest.mock('../utils/customError', () => ({
  CustomError: jest.fn(),
}));

jest.mock('../dto/request.dto', () => ({
  QueryParams: jest.fn(),
}));

let controller: BooksController;
let service: BooksService;
describe('BooksController', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [BooksService],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with the correct arguments', async () => {
      // Mock the createBookDto
      const createBookDto = {
        books_code: 'JKT-45',
        title: 'JKT-45',
        author: 'JKT-45',
        stock: 0,
      };

      const expectedResponse: MyResponse = {
        message: 'Success create Books',
        statusCode: 200,
      };

      // Mock the service.create method
      const createSpy = jest
        .spyOn(service, 'create')
        .mockReturnValue(Promise.resolve(expectedResponse));

      // Call the controller method
      const result = await controller.create(createBookDto);

      // Check if the service.create method was called with the correct arguments
      expect(createSpy).toHaveBeenCalledWith(createBookDto);

      // Add additional assertions based on your requirements
      expect(result).toEqual(expectedResponse);
    });
  });
});

describe('findAll', () => {
  it('should call service.findAll with the correct arguments', () => {
    // Mock the queryParams
    const queryParams: any = {
      keyword: '',
      page: 1,
      per_page: 10,
      sort: 'desc',
      order_by: 'created_at',
      is_all_data: false,
      available: false,
    };

    const response: MyResponse = {
      message: 'Success get books data',
      statusCode: 200,
    };

    // Mock the service.findAll method
    const findAllSpy = jest
      .spyOn(service, 'findAll')
      .mockReturnValue(Promise.resolve(response));

    // Call the controller method
    controller.findAll(queryParams);

    // Check if the service.findAll method was called with the correct arguments
    expect(findAllSpy).toHaveBeenCalledWith(queryParams);
  });
});

describe('findOne', () => {
  it('should call service.findOne with the correct arguments', () => {
    // Mock the id parameter
    const id = 'TW-11';
    const response: MyResponse = {
      message: 'Success get books by code',
      statusCode: 200,
    };
    // Mock the service.findOne method
    const findOneSpy = jest
      .spyOn(service, 'findOne')
      .mockReturnValue(Promise.resolve(response));

    // Call the controller method
    controller.findOne(id);

    // Check if the service.findOne method was called with the correct arguments
    expect(findOneSpy).toHaveBeenCalledWith(id);
  });
});

describe('update', () => {
  it('should call service.update with the correct arguments', () => {
    // Mock the id parameter
    const id = 'TW-11';

    // Mock the updateBookDto
    const updateBookDto = {
      books_code: 'TW-11',
      title: 'Twilight',
      author: 'Stephenie Meyer',
      stock: 10,
    };

    const response: MyResponse = {
      message: 'Success update Books',
      statusCode: 200,
    };

    // Mock the service.update method
    const updateSpy = jest
      .spyOn(service, 'update')
      .mockReturnValue(Promise.resolve(response));

    // Call the controller method
    controller.update(id, updateBookDto);

    // Check if the service.update method was called with the correct arguments
    expect(updateSpy).toHaveBeenCalledWith(id, updateBookDto);
  });
});

describe('remove', () => {
  it('should call service.remove with the correct arguments', () => {
    // Mock the id parameter
    const id = 'TW-11';
    const response: MyResponse = {
      message: 'Success Delete Books',
      statusCode: 200,
    };
    // Mock the service.remove method
    const removeSpy = jest
      .spyOn(service, 'remove')
      .mockReturnValue(Promise.resolve(response));

    // Call the controller method
    controller.remove(id);

    // Check if the service.remove method was called with the correct arguments
    expect(removeSpy).toHaveBeenCalledWith(id);
  });
});
