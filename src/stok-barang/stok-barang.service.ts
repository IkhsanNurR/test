import { Injectable } from '@nestjs/common';
import { stok_barang } from 'models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryParams } from 'src/dto/request.dto';
import {
  createStokBarangDto,
  updateStokBarangDto,
} from 'src/dto/stok-barang.dto';
import { CustomError } from 'src/utils/customError';
import { MyResponse } from 'src/utils/response.interface';

@Injectable()
export class StokBarangService {
  constructor(private sequelize: Sequelize) {}

  async create(createDTO: createStokBarangDto) {
    try {
      const createJenisBarang = await stok_barang
        .create({
          nama_barang: createDTO.nama,
          id_jenis_barang: createDTO.id_jenis_barang,
          stok: createDTO.stok,
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
        where.nama_barang = {
          [Op.iLike]: `%${params.keyword}%`,
        };
      }

      const find = await stok_barang.findAll({
        where,
        limit: params.is_all_data ? undefined : params.per_page,
        offset: params.is_all_data ? undefined : offset,
      });
      const total = await stok_barang.count({
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
      const find = await stok_barang.findByPk(id);
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

  async update(id: number, updateStokDTO: updateStokBarangDto) {
    try {
      const update = await stok_barang.update(
        {
          nama_barang: updateStokDTO.nama,
          stok: updateStokDTO.stok,
          id_jenis_barang: updateStokDTO.id_jenis_barang,
        },
        {
          where: {
            id_barang: id,
          },
          returning: true,
        },
      );
      if (update[0] == 0) {
        throw new CustomError('Data tidak diperbarui', 400);
      }
      const response: MyResponse = {
        data: update,
        message: 'Berhasil mengupdate stok barang',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const deleteJenisBarang = await stok_barang
        .destroy({
          where: {
            id_barang: id,
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
        message: 'Berhasil menghapus stok barang',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }
}
