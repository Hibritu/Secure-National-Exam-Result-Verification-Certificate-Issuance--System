const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examResultId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamResult', required: true },
  certificateId: { type: String, required: true, unique: true }, // Unique certificate code
  issuedAt: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false },
});

module.exports = mongoose.model('Certificate', CertificateSchema);
