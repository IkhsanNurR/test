import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { books, members, transaction } from 'models';
import { CustomError } from 'src/utils/customError';
import { MyResponse } from 'src/utils/response.interface';
import { QueryParamsMembers } from 'src/dto/request.dto';
import { Op } from 'sequelize';

@Injectable()
export class MembersService {
  async create(createMemberDto: any) {
    try {
      const newMembers = await members
        .create({
          members_code: createMemberDto.members_code,
          name: createMemberDto.name,
        })
        .catch(function (error) {
          throw new CustomError(error.original.detail, 400);
        });

      const response: MyResponse = {
        data: newMembers,
        message: 'Success create Members',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findAll(params: QueryParamsMembers) {
    try {
      const offset = params.page ? (params.page - 1) * params.per_page : 0;
      const where: any = {};
      if (params.keyword) {
        where.name = {
          [Op.iLike]: `%${params.keyword}%`,
        };
      }

      if (params.penalized) {
        where.penalized = true;
      }

      const find = await members.findAll({
        where,
        limit: params.is_all_data ? undefined : params.per_page,
        offset: params.is_all_data ? undefined : offset,
        order: [[params.order_by, params.sort]],
        include: [
          {
            model: transaction,
            include: [books],
          },
        ],
      });

      const total = await members.count({
        where,
      });
      const response: MyResponse = {
        data: find,
        metadata: {
          total_count: total,
          page_count: Math.ceil(total / (params.per_page ?? 10)),
          page: params.page,
          per_page: params.is_all_data
            ? total
            : params.per_page
              ? params.per_page
              : 10,
          sort: params.sort,
          order_by: params.order_by,
          keyword: params.keyword,
          is_all_data: params.is_all_data,
        },
        message: 'Success get members data',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findOne(code: string) {
    try {
      const find = await members.findByPk(code, {
        include: [
          {
            model: transaction,
            include: [books], // Include the associated books through the transaction
          },
        ],
      });

      const response: MyResponse = {
        data: find,
        message: 'Success get members by code',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async update(code: string, updateMemberDto: UpdateMemberDto) {
    try {
      const find = await members.findByPk(code);
      if (!find) {
        throw new CustomError('Members code not found!', 404);
      }

      const update = await members.update(
        {
          members_code: updateMemberDto.members_code,
          name: updateMemberDto.name,
          penalized: updateMemberDto.penalized,
          penalized_until: updateMemberDto.penalized_until,
        },
        {
          where: {
            members_code: code,
          },
          returning: true,
        },
      );
      if (update[0] == 0) {
        throw new CustomError('No Data updated', 400);
      }

      const response: MyResponse = {
        data: update,
        message: 'Success update Members',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async remove(code: string) {
    try {
      const find = await members.findByPk(code);
      if (!find) {
        throw new CustomError('members code not found!', 404);
      }
      const deleteMembers = await members
        .destroy({
          where: {
            members_code: code,
          },
        })
        .catch(function (error) {
          throw new CustomError(error.original.detail, 400);
        });
      const response: MyResponse = {
        data: deleteMembers,
        message: 'Success Delete Members',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }
}
