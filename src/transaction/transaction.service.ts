import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { books, members, transaction } from 'models';
import { CustomError } from 'src/utils/customError';
import { Sequelize } from 'sequelize-typescript';
import { MyResponse } from 'src/utils/response.interface';
import * as moment from 'moment';

@Injectable()
export class TransactionService {
  constructor(private sequelize: Sequelize) {}
  //borrow a book
  async create(createTransactionDto: CreateTransactionDto) {
    const t = await this.sequelize.transaction();
    try {
      const findMembers = await members.findByPk(
        createTransactionDto.members_code,
        {
          include: [transaction],
        },
      );
      if (!findMembers) {
        throw new CustomError('Members not found!', 404);
      }

      if (findMembers.penalized && findMembers.penalized_until >= new Date()) {
        throw new CustomError('You have been penalized!', 403);
      } else if (
        (findMembers.penalized && findMembers.penalized_until == null) ||
        (!findMembers.penalized && findMembers.penalized_until)
      ) {
        throw new CustomError(
          'Your members is not valid, please call Customer Service!',
          403,
        );
      }

      if (findMembers.transactions.length != 0) {
        const unreturnedTransactions = findMembers.transactions.filter(
          (transaction) => transaction.returned_at === null,
        );
        if (unreturnedTransactions.length >= 2) {
          throw new CustomError('You already borrow 2 books', 403);
        }
      }

      const findBooks = await books.findByPk(createTransactionDto.books_code);

      if (!findBooks) {
        throw new CustomError('Books not found!', 404);
      }

      if (findBooks.stock == 0) {
        throw new CustomError('Books is out of stock!', 403);
      }

      const decrementBook = await books.decrement('stock', {
        by: 1,
        where: {
          books_code: createTransactionDto.books_code,
        },
        transaction: t,
      });

      const createTransaction = await transaction.create(
        {
          books_code: createTransactionDto.books_code,
          members_code: createTransactionDto.members_code,
        },
        {
          transaction: t,
        },
      );
      await t.commit();

      const response: MyResponse = {
        data: createTransaction,
        message: 'Success borrow a books',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async returnBook(data: UpdateTransactionDto) {
    const t = await this.sequelize.transaction();
    try {
      const findMembers = await members.findByPk(data.members_code, {
        include: [transaction],
      });
      if (!findMembers) {
        throw new CustomError('Members not found!', 404);
      }

      let penalized = false;
      let penalized_until = null;
      const today: Date = new Date();
      if (findMembers.transactions.length != 0) {
        const borrowedBooks = findMembers.transactions.filter(
          (transaction) => transaction.books_code === data.books_code,
        );

        if (borrowedBooks.length == 0) {
          throw new CustomError(
            'Your entry are not valid with your borrowed books!',
            403,
          );
        }

        if (borrowedBooks[0].returned_at) {
          throw new CustomError('You already return this book', 403);
        }

        if (
          Math.abs(moment(borrowedBooks[0].created_at).diff(today, 'days')) >= 7
        ) {
          // Jika created_at lebih dari 7 hari yang lalu
          penalized_until = moment(today).add(3, 'days').toDate();
          penalized = true;

          const updateMembers = await members.update(
            {
              penalized: penalized,
              penalized_until: penalized_until,
            },
            {
              where: {
                members_code: data.members_code,
              },
              transaction: t,
            },
          );
        }
      } else {
        throw new CustomError('You are not borrow any books!', 403);
      }

      const returnBooks = await transaction.update(
        {
          returned_at: new Date(),
        },
        {
          where: {
            books_code: data.books_code,
            members_code: data.members_code,
          },
          transaction: t,
          returning: true,
        },
      );
      await t.commit();
      const response: MyResponse = {
        data: returnBooks,
        message: 'Success returning a book',
        statusCode: 200,
      };
      return response;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
