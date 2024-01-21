import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { books } from '../../models';
import { MyResponse } from '../utils/response.interface';
import { CustomError } from '../utils/customError';

jest.mock('../../models', () => ({
  books: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
  },
}));

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto = {
        author: 'Author',
        books_code: 'ABC-123',
        stock: 10,
        title: 'Book Title',
      };

      const expectedResponse: MyResponse = {
        data: createBookDto,
        message: 'Success create Books',
        statusCode: 200,
      };

      (books.create as jest.Mock).mockResolvedValue(expectedResponse.data);

      const result = await service.create(createBookDto);

      expect(result).toEqual(expectedResponse);
      expect(books.create).toHaveBeenCalledWith(createBookDto);
    });

    it('should throw a CustomError if create operation fails', async () => {
      const createBookDto = {
        author: 'Author',
        books_code: 'ABC-123',
        stock: 10,
        title: 'Book Title',
      };

      const error = new Error('Create operation failed');
      (books.create as jest.Mock).mockRejectedValue(error);

      try {
        await service.create(createBookDto);
      } catch (error) {
        console.log(error); // Log the error here to see its structure
        expect(error).toBeInstanceOf(CustomError);
      }
    });
  });

  describe('findAll', () => {
    it('should return books data successfully', async () => {
      const queryParams: any = {
        page: 1,
        per_page: 10,
        sort: 'desc',
        order_by: 'created_at',
        keyword: '',
        is_all_data: false,
      };

      const expectedResponse = {
        data: expect.any(Array),
        metadata: {
          total_count: expect.anything(),
          page_count: expect.any(Number),
          page: expect.any(Number),
          per_page: expect.anything(),
          sort: expect.any(String),
          order_by: expect.any(String),
          keyword: expect.any(String),
          is_all_data: expect.any(Boolean),
        },
        message: 'Success get books data',
        statusCode: 200,
      };

      // Mock the books.findAll method
      (books.findAll as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.findAll(queryParams);

      expect(result.statusCode).toEqual(expectedResponse.statusCode);
      expect(result.message).toEqual(expectedResponse.message);
      expect(result.metadata).toEqual(
        expect.objectContaining(expectedResponse.metadata),
      );
    });

    it('should throw a CustomError if findAll operation fails', async () => {
      const queryParams: any = {
        page: 1,
        per_page: 10,
        sort: 'desc',
        order_by: 'created_at',
        keyword: '',
        is_all_data: false,
      };

      const error = new Error('FindAll operation failed');
      (books.findAll as jest.Mock).mockRejectedValue(error);

      try {
        await service.findAll(queryParams);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('findOne', () => {
    it('should return book by code successfully', async () => {
      const bookCode = 'ABC-123';
      const expectedBook = {
        books_code: bookCode,
        title: 'Book Title',
        author: 'Author',
        stock: 10,
      };

      // Mock the books.findByPk method
      (books.findByPk as jest.Mock).mockResolvedValue(expectedBook);

      const expectedResponse: MyResponse = {
        data: expectedBook,
        message: 'Success get books by code',
        statusCode: 200,
      };

      // Call the service method
      const result = await service.findOne(bookCode);

      // Verify expectations
      expect(result).toEqual(expectedResponse);
      expect(books.findByPk).toHaveBeenCalledWith(bookCode);
    });

    it('should throw a CustomError if book is not found', async () => {
      const bookCode = 'NonExistingCode';

      // Mock the books.findByPk method to return null
      (books.findByPk as jest.Mock).mockResolvedValue(null);

      // Call the service method
      try {
        await service.findOne(bookCode);
      } catch (error) {
        // Verify expectations
        expect(error).toBeInstanceOf(CustomError);
        expect(error.message).toEqual('Data tidak ditemukan!');
        expect(error.statusCode).toEqual(404);
      }
    });
  });

  describe('update', () => {
    it('should update book successfully', async () => {
      const bookCode = 'ABC-123';
      const updateBookDto = {
        author: 'New Author',
        books_code: 'NEW-123',
        stock: 5,
        title: 'New Title',
      };

      const existingBook = {
        books_code: bookCode,
        title: 'Old Title',
        author: 'Old Author',
        stock: 10,
      };

      // Mock the books.findByPk method
      (books.findByPk as jest.Mock).mockResolvedValue(existingBook);

      // Mock the books.update method
      (books.update as jest.Mock).mockResolvedValue([1, [existingBook]]);

      const expectedResponse: MyResponse = {
        data: [1, [existingBook]],
        message: 'Success update Books',
        statusCode: 200,
      };

      // Call the service method
      const result = await service.update(bookCode, updateBookDto);

      // Verify expectations
      expect(result).toEqual(expectedResponse);
      expect(books.findByPk).toHaveBeenCalledWith(bookCode);
      expect(books.update).toHaveBeenCalledWith(
        {
          author: updateBookDto.author,
          books_code: updateBookDto.books_code,
          stock: updateBookDto.stock,
          title: updateBookDto.title,
        },
        {
          where: {
            books_code: bookCode,
          },
          returning: true,
        },
      );
    });

    it('should throw a CustomError if book is not found', async () => {
      const bookCode = 'NonExistingCode';

      // Mock the books.findByPk method to return null
      (books.findByPk as jest.Mock).mockResolvedValue(null);

      // Call the service method
      try {
        await service.update(bookCode, {
          author: 'New Author',
          books_code: 'NEW-123',
          stock: 5,
          title: 'New Title',
        });
      } catch (error) {
        // Verify expectations
        expect(error).toBeInstanceOf(CustomError);
        expect(error.message).toEqual('Books code not found!');
        expect(error.statusCode).toEqual(404);
      }
    });

    it('should throw a CustomError if no data is updated', async () => {
      const bookCode = 'ABC-123';

      // Mock the books.findByPk method
      (books.findByPk as jest.Mock).mockResolvedValue({
        books_code: bookCode,
        title: 'Old Title',
        author: 'Old Author',
        stock: 10,
      });

      // Mock the books.update method to return [0, []]
      (books.update as jest.Mock).mockResolvedValue([0, []]);

      // Call the service method
      try {
        await service.update(bookCode, {
          author: 'New Author',
          books_code: 'NEW-123',
          stock: 5,
          title: 'New Title',
        });
      } catch (error) {
        // Verify expectations
        expect(error).toBeInstanceOf(CustomError);
        expect(error.message).toEqual('No Data updated');
        expect(error.statusCode).toEqual(400);
      }
    });
  });

  describe('remove', () => {
    it('should remove book successfully', async () => {
      const bookCode = 'ABC-123';

      // Mock the books.findByPk method
      (books.findByPk as jest.Mock).mockResolvedValue({
        books_code: bookCode,
        title: 'Book Title',
        author: 'Author',
        stock: 10,
      });

      // Mock the books.destroy method
      (books.destroy as jest.Mock).mockResolvedValue(1);

      const expectedResponse: MyResponse = {
        data: 1,
        message: 'Success Delete Books',
        statusCode: 200,
      };

      // Call the service method
      const result = await service.remove(bookCode);

      // Verify expectations
      expect(result).toEqual(expectedResponse);
      expect(books.findByPk).toHaveBeenCalledWith(bookCode);
      expect(books.destroy).toHaveBeenCalledWith({
        where: {
          books_code: bookCode,
        },
      });
    });

    it('should throw a CustomError if book is not found', async () => {
      const bookCode = 'NonExistingCode';

      // Mock the books.findByPk method to return null
      (books.findByPk as jest.Mock).mockResolvedValue(null);

      // Call the service method
      try {
        await service.remove(bookCode);
      } catch (error) {
        // Verify expectations
        expect(error).toBeInstanceOf(CustomError);
        expect(error.message).toEqual('Books code not found!');
        expect(error.statusCode).toEqual(404);
      }
    });

    it('should throw a Error if delete operation fails', async () => {
      const bookCode = 'ABC-123';

      // Mock the books.findByPk method
      (books.findByPk as jest.Mock).mockResolvedValue({
        books_code: bookCode,
        title: 'Book Title',
        author: 'Author',
        stock: 10,
      });

      // Mock the books.destroy method to throw an error
      (books.destroy as jest.Mock).mockRejectedValue(
        new Error('Delete operation failed'),
      );

      // Call the service method
      try {
        await service.remove(bookCode);
      } catch (error) {
        // Verify expectations
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
