import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { members, transaction, books } from '../../models';
import { CustomError } from '../utils/customError';
import { MyResponse } from '../utils/response.interface';
jest.mock('../../models', () => ({
  members: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
  },
}));

describe('MembersService', () => {
  let service: MembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembersService],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new member', async () => {
      const createMemberDto = {
        members_code: 'M001',
        name: 'John Doe',
      };

      const expectedResponse: MyResponse = {
        data: createMemberDto,
        message: 'Success create Members',
        statusCode: 200,
      };

      (members.create as jest.Mock).mockResolvedValueOnce(
        expectedResponse.data,
      );

      const result = await service.create(createMemberDto);

      expect(result).toEqual(expectedResponse);
      expect(members.create).toHaveBeenCalledWith({
        members_code: createMemberDto.members_code,
        name: createMemberDto.name,
      });
    });

    it('should throw a CustomError if create operation fails', async () => {
      const createMemberDto = {
        members_code: 'M001',
        name: 'John Doe',
      };

      const error = new Error('Create operation failed');
      (members.create as jest.Mock).mockRejectedValueOnce(error);

      try {
        await service.create(createMemberDto);
      } catch (error) {
        console.log(error);
        expect(error).toBeInstanceOf(CustomError);
      }
    });
  });

  describe('findAll', () => {
    it('should get all members', async () => {
      const queryParams: any = {
        page: 1,
        per_page: 10,
        sort: 'desc',
        order_by: 'created_at',
        keyword: '',
        penalized: false,
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
        message: 'Success get members data',
        statusCode: 200,
      };

      // Mock the members.findAll method
      (members.findAll as jest.Mock).mockResolvedValueOnce(expectedResponse);

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
        penalized: false,
        is_all_data: false,
      };

      const error = new Error('FindAll operation failed');
      (members.findAll as jest.Mock).mockRejectedValueOnce(error);

      try {
        await service.findAll(queryParams);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('findOne', () => {
    it('should get a member by code', async () => {
      const memberCode = 'M001';

      const expectedResponse = {
        data: expect.any(Object),
        message: 'Success get members by code',
        statusCode: 200,
      };

      // Mock the members.findByPk method
      (members.findByPk as jest.Mock).mockResolvedValueOnce(
        expectedResponse.data,
      );

      const result = await service.findOne(memberCode);

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(expectedResponse.statusCode);
      expect(members.findByPk).toHaveBeenCalledWith(memberCode, {
        include: [
          {
            model: transaction,
            include: [books],
          },
        ],
      });
    });

    it('should throw a CustomError if findOne operation fails', async () => {
      const memberCode = 'M001';

      const error = new Error('FindOne operation failed');
      (members.findByPk as jest.Mock).mockRejectedValueOnce(error);

      try {
        await service.findOne(memberCode);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
