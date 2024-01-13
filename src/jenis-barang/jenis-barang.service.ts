import { Injectable } from '@nestjs/common';
import { jenis_barang } from 'models';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { CustomError } from 'src/utils/customError';
import { MyResponse } from 'src/utils/response.interface';
import { createJenisBarangDto } from 'src/dto/jenis-barang.dto';
import { QueryParams } from 'src/dto/request.dto';

@Injectable()
export class JenisBarangService {
  constructor(private sequelize: Sequelize) {}

  async create(createJenisBarangDto: createJenisBarangDto) {
    try {
      const createJenisBarang = await jenis_barang
        .create({
          nama_jenis_barang: createJenisBarangDto.nama,
        })
        .catch(function (error) {
          throw new CustomError(error.original.detail, 400);
        });

      const response: MyResponse = {
        data: createJenisBarang,
        message: 'Berhasil menambahkan data',
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
        where.nama_jenis_barang = {
          [Op.iLike]: `%${params.keyword}%`,
        };
      }

      const find = await jenis_barang.findAll({
        where,
        limit: params.is_all_data ? undefined : params.per_page,
        offset: params.is_all_data ? undefined : offset,
      });
      const total = await jenis_barang.count({
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
        message: 'Berhasil menemukan data',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const find = await jenis_barang.findByPk(id);
      if (!find) {
        throw new CustomError('Data tidak ditemukan!', 404);
      }
      const response: MyResponse = {
        data: find,
        message: 'Berhasil menemukan data',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateJenisBarangDto) {
    try {
      const update = await jenis_barang.update(
        {
          nama_jenis_barang: updateJenisBarangDto.nama,
        },
        {
          where: {
            id_jenis_barang: id,
          },
          returning: true,
        },
      );
      if (update[0] == 0) {
        throw new CustomError('Data tidak diperbarui', 400);
      }
      const response: MyResponse = {
        data: update,
        message: 'Berhasil mengupdate jenis barang',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const deleteJenisBarang = await jenis_barang
        .destroy({
          where: {
            id_jenis_barang: id,
          },
          cascade: true,
        })
        .catch(function (error) {
          throw new CustomError(error.original.detail, 400);
        });

      if (deleteJenisBarang == 0) {
        throw new CustomError('Data tidak terhapus', 400);
      }

      const response: MyResponse = {
        data: deleteJenisBarang,
        message: 'Berhasil menghapus jenis barang',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }
}
