const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("MyComment", commentSchema);

