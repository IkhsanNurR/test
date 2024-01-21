import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { QueryParamsMembers } from 'src/dto/request.dto';
import { MyResponse } from 'src/utils/response.interface';

jest.mock('./members.service');
jest.mock('../../models/members', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return {
    members: dbMock.define('members', {
      members_code: 'M002',
      name: 'Ferry',
      created_at: '2024-01-19T12:05:37.159Z',
      updated_at: '2024-01-19T12:05:37.199Z',
      penalized: false,
      penalized_until: null,
    }),
  };
});

describe('MembersController', () => {
  let controller: MembersController;
  let membersService: MembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [MembersService],
    }).compile();

    controller = module.get<MembersController>(MembersController);
    membersService = module.get<MembersService>(MembersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new member', async () => {
      const createMemberDto: CreateMemberDto = {
        members_code: 'M004',
        name: 'Mamamia',
      };
      const response: MyResponse = {
        data: {},
        message: 'Success create Members',
        statusCode: 200,
      };
      jest.spyOn(membersService, 'create').mockResolvedValueOnce(response);

      const result = await controller.create(createMemberDto);

      expect(result).toBeDefined();
      expect(membersService.create).toHaveBeenCalledWith(createMemberDto);
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

      jest
        .spyOn(membersService, 'findAll')
        .mockResolvedValueOnce(expectedResponse);

      const result = await controller.findAll(queryParams);

      expect(result).toBeDefined();
      expect(membersService.findAll).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('findOne', () => {
    it('should get a member by code', async () => {
      const memberCode = 'M001';
      const expectedResponse: MyResponse = {
        data: {},
        message: 'Success get members by code',
        statusCode: 200,
      };
      jest
        .spyOn(membersService, 'findOne')
        .mockResolvedValueOnce(expectedResponse);

      const result = await controller.findOne(memberCode);

      expect(result).toBeDefined();
      expect(membersService.findOne).toHaveBeenCalledWith(memberCode);
    });
  });

  describe('update', () => {
    it('should update a member by code', async () => {
      const memberCode = 'exampleCode';
      const updateMemberDto: any = {
        members_code: 'M111',
        name: 'Mantis',
      };

      const expectedResponse: MyResponse = {
        data: {},
        message: 'Success get books by code',
        statusCode: 200,
      };

      jest
        .spyOn(membersService, 'update')
        .mockResolvedValueOnce(expectedResponse);

      const result = await controller.update(memberCode, updateMemberDto);

      expect(result).toBeDefined();
      expect(membersService.update).toHaveBeenCalledWith(
        memberCode,
        updateMemberDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a member by code', async () => {
      const memberCode = 'exampleCode';
      const expectedResponse: MyResponse = {
        data: {},
        message: 'Success Delete Members',
        statusCode: 200,
      };
      jest
        .spyOn(membersService, 'remove')
        .mockResolvedValueOnce(expectedResponse);

      const result = await controller.remove(memberCode);

      expect(result).toBeDefined();
      expect(membersService.remove).toHaveBeenCalledWith(memberCode);
    });
  });
});
