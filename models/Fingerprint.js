const mongoose = require('mongoose');

const FingerprintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: String, required: true }, // encrypted fingerprint data base64 or hash
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Fingerprint', FingerprintSchema);
