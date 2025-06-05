const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  surname: { type: String, required: true },
  dateofbirth: { type: Date, required: true }, // Changed to Date type
  standard: { type: Number, required: true, min: 1, max: 12 }, // Min/max validation example
  rollno: { type: Number, required: true, unique: true },
  grno: { type: String, required: true, unique: true },
  subject: { type: [String], required: true },
  marks: [
    {
      subject: { type: String, required: true },
      score: { type: Number, required: true},
      date: { type: Date, default: Date.now }
    }
  ]
});

const User = mongoose.model("students", StudentSchema);
module.exports = User;

