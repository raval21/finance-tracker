const Transaction = require("../models/Transaction");

exports.addTransaction = async (req, res) => {
  try {
    const { type, description, amount } = req.body;

    const txn = await Transaction.create({
      userId: req.user.id,
      type,
      description,
      amount,
    });

    res.json(txn);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      type,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = { userId: req.user.id };

    if (type) {
      query.type = type;
    }

    const sortOption = {};
    sortOption[sortBy] = order === "asc" ? 1 : -1;

    const data = await Transaction.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      data,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};