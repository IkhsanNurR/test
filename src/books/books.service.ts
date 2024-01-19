import { Injectable } from '@nestjs/common';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { books } from '../../models';
import { MyResponse } from '../utils/response.interface';
import { CustomError } from '../utils/customError';
import { QueryParams } from '../dto/request.dto';
import { Op } from 'sequelize';

@Injectable()
export class BooksService {
  async create(createBookDto: CreateBookDto) {
    try {
      const newBooks = await books
        .create({
          author: createBookDto.author,
          books_code: createBookDto.books_code,
          stock: createBookDto.stock,
          title: createBookDto.title,
        })
        .catch(function (error) {
          throw new CustomError(error.original.detail, 400);
        });

      const response: MyResponse = {
        data: newBooks,
        message: 'Success create Books',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findAll(params: QueryParams) {
    try {
      const offset = params.page ? (params.page - 1) * params.per_page : 0;
      const where: any = {};
      if (params.keyword) {
        where.title = {
          [Op.iLike]: `%${params.keyword}%`,
        };
        where.author = {
          [Op.iLike]: `%${params.keyword}%`,
        };
      }

      if (params.available) {
        where.stock = {
          [Op.not]: 0,
        };
      }

      const find = await books.findAll({
        where,
        limit: params.is_all_data ? undefined : params.per_page,
        offset: params.is_all_data ? undefined : offset,
        order: [[params.order_by, params.sort]],
      });
      const total = await books.count({
        where,
      });
      console.log(params);

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
        message: 'Success get books data',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findOne(code: string) {
    try {
      const find = await books.findByPk(code);
      if (!find) {
        throw new CustomError('Data tidak ditemukan!', 404);
      }
      const response: MyResponse = {
        data: find,
        message: 'Success get books by code',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async update(code: string, updateBookDto: UpdateBookDto) {
    try {
      const find = await books.findByPk(code);
      if (!find) {
        throw new CustomError('Books code not found!', 404);
      }
      const update = await books.update(
        {
          author: updateBookDto.author,
          books_code: updateBookDto.books_code,
          stock: updateBookDto.stock,
          title: updateBookDto.title,
        },
        {
          where: {
            books_code: code,
          },
          returning: true,
        },
      );

      if (update[0] == 0) {
        throw new CustomError('No Data updated', 400);
      }
      const response: MyResponse = {
        data: update,
        message: 'Success update Books',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async remove(code: string) {
    try {
      const find = await books.findByPk(code);
      if (!find) {
        throw new CustomError('Books code not found!', 404);
      }
      const deleteJenisBarang = await books
        .destroy({
          where: {
            books_code: code,
          },
        })
        .catch(function (error) {
          throw new CustomError(error.original.detail, 400);
        });
      const response: MyResponse = {
        data: deleteJenisBarang,
        message: 'Success Delete Books',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }
}
