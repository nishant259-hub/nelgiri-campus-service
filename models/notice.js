const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required:true,
  },
  category: {
    type: String,
    enum: ["Academic", "Event", "Hostel", "Exam", "General"],
    default: "General"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Notice", noticeSchema);
