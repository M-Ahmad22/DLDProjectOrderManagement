const mongoose = require("mongoose");

const withdrawnSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 },
});

module.exports = mongoose.model("WithdrawnAmount", withdrawnSchema);
