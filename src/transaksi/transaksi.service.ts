import { Injectable } from '@nestjs/common';
import { jenis_barang, stok_barang, transaksi } from 'models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryParams } from 'src/dto/request.dto';
import {
  createTransaksiDto,
  deleteTransaksi,
  updateTransaksiDto,
} from 'src/dto/transaksi.dto';
import { CustomError } from 'src/utils/customError';
import { MyResponse } from 'src/utils/response.interface';
@Injectable()
export class TransaksiService {
  constructor(private sequelize: Sequelize) {}
  async create(createTransaksiDto: createTransaksiDto) {
    const t = await this.sequelize.transaction();
    try {
      const find = await stok_barang.findByPk(createTransaksiDto.id_barang);
      if (!find) {
        throw (new CustomError('Data stok barang tidak ditemukan!', 404), 404);
      }
      const createTransaksi = await transaksi.create(
        {
          id_barang: createTransaksiDto.id_barang,
          jumlah: createTransaksiDto.jumlah,
          tanggal_transaksi: new Date(),
          id_jenis_barang: find.id_jenis_barang,
        },
        { transaction: t, returning: true },
      );

      const kurangiStok = await stok_barang.decrement(
        { stok: createTransaksiDto.jumlah },
        {
          where: { id_barang: createTransaksiDto.id_barang },
          transaction: t,
        },
      );
      await t.commit();

      const response: MyResponse = {
        data: { createTransaksi, kurangiStok },
        message: 'Berhasil menambahkan data transaksi',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      await t.rollback();
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

      if (params.id_jenis_barang) {
        where.id_jenis_barang = {
          [Op.in]: params.id_jenis_barang.split(','),
        };
      }

      let column = 'tanggal_transaksi';
      if (params.order_by) {
        column = params.order_by;
      }

      if (params.id_barang) {
        where.id_barang = {
          [Op.in]: params.id_barang.split(','),
        };
      }
      const findBarang = await stok_barang.findAll({
        where,
        limit: params.is_all_data ? undefined : params.per_page,
        offset: params.is_all_data ? undefined : offset,
        attributes: ['id_barang'],
      });

      if (findBarang.length != 0) {
        const barang_ids = findBarang.map((item) => item.id_barang);
        const transaksi_ids = params.id_transaksi
          ? params.id_transaksi.split(',').map((item) => item)
          : [];

        const whereClause: any = {
          id_barang: {
            [Op.in]: barang_ids,
          },
        };

        if (transaksi_ids && transaksi_ids.length !== 0) {
          whereClause.id_transaksi = {
            [Op.in]: transaksi_ids,
          };
        }

        if (params.tanggal_awal && params.tanggal_akhir) {
          whereClause.tanggal_transaksi = {
            [Op.between]: [params.tanggal_awal, params.tanggal_akhir],
          };
        } else if (params.tanggal_awal) {
          whereClause.tanggal_transaksi = {
            [Op.gte]: params.tanggal_awal,
          };
        } else if (params.tanggal_akhir) {
          whereClause.tanggal_transaksi = {
            [Op.lte]: params.tanggal_akhir,
          };
        }
        const find = await transaksi.findAll({
          where: whereClause,
          limit: params.is_all_data ? undefined : params.per_page,
          offset: params.is_all_data ? undefined : offset,
          include: [
            {
              model: stok_barang,
              as: 'stok_barang', // Alias for the joined table
              attributes: ['id_barang', 'nama_barang', 'stok'], // Select specific attributes
            },
            {
              model: jenis_barang,
              as: 'jenis_barang', // Alias for the joined table
              attributes: ['id_jenis_barang', 'nama_jenis_barang'], // Select specific attributes
            },
          ],
          order: column
            ? [[column, params.sort || 'DESC']] // Example: [['col1', 'ASC'], ['col2', 'DESC']]
            : [[column, params.sort || 'DESC']],
        });
        const total = await transaksi.count({
          where: whereClause,
        });

        const result = find.map((item) => {
          return {
            ...item.toJSON(),
            nama_jenis_barang: item.jenis_barang.nama_jenis_barang ?? '-',
            nama_barang: item.stok_barang.nama_barang ?? '-',
          };
        });

        const response: MyResponse = {
          data: result,
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
      }

      const response: MyResponse = {
        data: [],
        metadata: {
          total_count: 0,
          page_count: 0,
          page: params.page,
          per_page: params.per_page,
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
      const result = await transaksi.findByPk(id, {
        include: [
          {
            model: stok_barang,
            as: 'stok_barang', // Alias for the joined table
            attributes: ['id_barang', 'nama_barang', 'stok'], // Select specific attributes
          },
          {
            model: jenis_barang,
            as: 'jenis_barang', // Alias for the joined table
            attributes: ['id_jenis_barang', 'nama_jenis_barang'], // Select specific attributes
          },
        ],
      });

      if (!result) {
        throw new CustomError('Data tidak ditemukan!', 404);
      }

      const data = {
        ...result.toJSON(),
        nama_jenis_barang: result.jenis_barang?.nama_jenis_barang || '-',
        nama_barang: result.stok_barang?.nama_barang || '-',
      };

      const response: MyResponse = {
        data,
        message: 'Berhasil menemukan data',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateTransaksiDto: updateTransaksiDto) {
    const t = await this.sequelize.transaction();
    try {
      if (isNaN(id)) {
        throw new CustomError('id bukan number!', 403);
      }

      const find = await transaksi.findByPk(id);
      if (!find) {
        throw new CustomError('Tidak ada data tersebut!', 404);
      }

      const findBarangBefore = await stok_barang.findByPk(
        updateTransaksiDto.id_barang,
      );

      if (!findBarangBefore) {
        throw new CustomError('Tidak ada data barang tersebut!', 404);
      }

      console.log(find.jumlah);
      console.log(updateTransaksiDto.jumlah);

      if (updateTransaksiDto.id_barang == find.id_barang) {
        const updateTransaksi = await transaksi.update(
          {
            jumlah: updateTransaksiDto.jumlah,
          },
          {
            where: {
              id_transaksi: +id,
            },
          },
        );
        const selisih = Math.abs(updateTransaksiDto.jumlah - find.jumlah);
        console.log(selisih);

        if (find.jumlah > updateTransaksiDto.jumlah) {
          const tambahStok = await stok_barang.increment(
            { stok: selisih },
            {
              where: { id_barang: updateTransaksiDto.id_barang },
              transaction: t,
            },
          );
        } else if (find.jumlah < updateTransaksiDto.jumlah) {
          const kurangiStok = await stok_barang.decrement(
            { stok: selisih },
            {
              where: { id_barang: updateTransaksiDto.id_barang },
              transaction: t,
            },
          );
        }
        await t.commit();
        const response: MyResponse = {
          data: updateTransaksi,
          message: 'Berhasil mengupdate data transaksi dan data stok barang',
          statusCode: 200,
        };
        return response;
      } else {
        const findBarangAfter = await stok_barang.findByPk(
          updateTransaksiDto.id_barang,
        );
        if (!findBarangAfter) {
          throw new CustomError('Tidak ada data barang tersebut!', 404);
        }

        const updateTransaksi = await transaksi.update(
          {
            jumlah: updateTransaksiDto.jumlah,
            id_barang: updateTransaksiDto.id_barang,
            id_jenis_barang: findBarangAfter.id_jenis_barang,
          },
          {
            where: {
              id_transaksi: +id,
            },
          },
        );

        //kembalikan stok yang lama
        const tambahStok = await stok_barang.increment(
          { stok: find.jumlah },
          {
            where: { id_barang: find.id_barang },
            transaction: t,
          },
        );

        //kurangi stok id barang yg baru
        const kurangiStok = await stok_barang.decrement(
          { stok: updateTransaksiDto.jumlah },
          {
            where: { id_barang: findBarangAfter.id_barang },
            transaction: t,
          },
        );
        await t.commit();
        const response: MyResponse = {
          data: updateTransaksi,
          message:
            'Berhasil mengupdate transaksi, mengurangi stok barang baru, dan mengembalikan stok barang lama',
          statusCode: 200,
        };
        return response;
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(params: deleteTransaksi) {
    const t = await this.sequelize.transaction();
    try {
      const transaksi_ids = params.ids
        ? params.ids.split(',').map((item) => +item)
        : [];

      if (transaksi_ids.length == 0) {
        throw new CustomError('Id tidak ada pada requestmu!', 403);
      }

      const find = await transaksi.findAll({
        where: {
          id_transaksi: {
            [Op.in]: transaksi_ids,
          },
        },
      });

      if (find.length == 0) {
        throw new CustomError(
          'data tidak ada, tidak ada data yang dihapus!',
          403,
        );
      }

      if (params.stok && params.stok == true) {
        find.map(async (item) => {
          const tambahStok = await stok_barang.increment(
            { stok: item.jumlah },
            {
              where: { id_barang: item.id_barang },
              transaction: t,
            },
          );
        });
      }

      const deleteTransaksi = await transaksi.destroy({
        where: {
          id_transaksi: {
            [Op.in]: transaksi_ids,
          },
        },
        transaction: t,
      });

      await t.commit();

      const response: MyResponse = {
        data: { deleteTransaksi },
        message: `Berhasil menghapus data transaksi ${params.stok == true ? 'dan mengembalikan stok barang' : ''}`,
        statusCode: 200,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }
}
