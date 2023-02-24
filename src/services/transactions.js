const { HttpError } = require('../httpError');
const { Transaction } = require('../schemas/transactions');

const addTransaction = async (data, id) => {
  try {
    data.userId = id;
    const transaction = await Transaction.create(data);
    return transaction;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

const getInformationPeriod = async (id, year, month) => {
  try {
    const transactions = await Transaction.find({
      userId: id,
      year,
      month,
    });
    if (!transactions.length) {
      return { message: 'There is no data for this request' };
    }

    return transactions;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

const getSummary = async (id, operation) => {
  const today = new Date();
  const year = today.getFullYear();

  try {
    const transactions = await Transaction.find({
      userId: id,
      year,
      operation,
    });
    const monthNumbers = [];
    const result = transactions.reduce((acc, item) => {
      if (Object.keys(acc).includes(item.month)) {
        acc[item.month] = +acc[item.month] + +item.sum;
        return acc;
      }

      acc[item.month] = +item.sum;
      monthNumbers.push(item.date.slice(5, 7));

      return acc;
    }, {});

    const newRes = [...Object.entries(result)];
    const arrNew = newRes.map((itm, idx) => {
      const trans = {
        month: itm[0],
        sum: itm[1],
        monthNumber: +monthNumbers[idx],
      };
      return trans;
    });
    return arrNew;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

const getAllSummaryReports = async (id, month, year) => {
  try {
    const transactions = await Transaction.find({
      userId: id,
      year,
      month,
    });

    const result = transactions.reduce((acc, itm) => {
      if (Object.keys(acc).includes(itm.operation)) {
        acc[itm.operation] = +acc[itm.operation] + +itm.sum;
        return acc;
      }
      acc[itm.operation] = itm.sum;
      return acc;
    }, {});

    const newRes = [...Object.entries(result)];
    const arrNew = newRes.map((itm, idx) => {
      const trans = {
        operation: itm[0],
        sum: itm[1],
      };
      return trans;
    });
    return arrNew;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

const getAllTransactionsByOperation = async (id, operation) => {
  try {
    const transactions = await Transaction.find({ userId: id, operation });

    return transactions;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

const transactionDelete = async id => {
  try {
    const transaction = await Transaction.findByIdAndRemove({ _id: id });

    if (!transaction) {
      throw new HttpError(`Transaction with id does not exist`, 404);
    }
    return transaction;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

module.exports = {
  getSummary,
  getAllSummaryReports,
  addTransaction,
  getInformationPeriod,
  getAllTransactionsByOperation,
  transactionDelete,
};
