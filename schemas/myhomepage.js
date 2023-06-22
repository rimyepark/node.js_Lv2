const mongoose = require("mongoose");

const homepageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
  },
  nickname: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Myhomepage", homepageSchema);

