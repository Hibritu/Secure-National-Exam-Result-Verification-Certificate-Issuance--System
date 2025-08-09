const mongoose = require('mongoose');

const ExamResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examName: { type: String, required: true },
  year: { type: Number, required: true },
  scores: { type: Object, required: true }, // Example: {math: 90, physics: 85}
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ExamResult', ExamResultSchema);
