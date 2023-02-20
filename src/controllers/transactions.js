const {
  addTransaction,
  getSummary,
  getInformationPeriod,
  getPosts,
} = require('../services/transactions');

const { Transaction } = require('../schemas/transactions');

const transaction = async (req, res, _) => {
  try {
    const operation = await addTransaction(req.body, req.user._id);
    return res.status(201).json({ data: operation });
  } catch (error) {
    console.warn(error);
    res.status(error.code).json({ message: error.message });
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Transaction.findByIdAndRemove({ _id: id });

    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Id of transaction not found',
      });
    }
    res.status(200).json({
      message: 'Your transaction was deleted!',
    });
  } catch (error) {
    next();
  }
};

const summaryByMonth = async (req, res) => {
  try {
    const { operation } = req.body;
    const { id } = req.user;
    const transaction = await getSummary(id, operation);
    res.status(200).json({ transaction });
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};
const informationPeriod = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { year, month } = req.body;
    const informations = await getInformationPeriod(_id, year, month);
    res.status(200).json(informations);
  } catch (error) {}
};

const posts = async (req, res, next) => {
  try {
    const informations = await getPosts();
    res.status(200).json(informations);
  } catch (error) {}
};

module.exports = {
  transaction,
  deleteTransaction,
  summaryByMonth,
  informationPeriod,
  posts,
};
