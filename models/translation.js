const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema({
  nameRU: {
    type: String,
    required: true,
    unique: true,
  },
  nameEN: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ["NSI", "LNGC", "OrgStructure"],
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  // translationId: {
  //   type: Number,
  //   required: true,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("translation", translationSchema);
