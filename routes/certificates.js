const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const Certificate = require('../models/Certificate');
const ExamResult = require('../models/ExamResult');
const crypto = require('crypto');

/**
 * @swagger
 * /api/certificates/generate:
 *   post:
 *     summary: Generate certificate for a user exam result
 *     security:
 *       - bearerAuth: []
 *     tags: [Certificates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - examResultId
 *             properties:
 *               userId:
 *                 type: string
 *               examResultId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Certificate generated successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 */

router.post('/generate', auth, adminOnly, async (req, res) => {
  try {
    const { userId, examResultId } = req.body;
    if (!userId || !examResultId)
      return res.status(400).json({ message: 'Missing fields' });

    // Check exam result exists
    const examResult = await ExamResult.findById(examResultId);
    if (!examResult) return res.status(404).json({ message: 'Exam result not found' });

    // Generate unique certificate ID
    const certificateId = crypto.randomBytes(8).toString('hex');

    const certificate = new Certificate({ userId, examResultId, certificateId });
    await certificate.save();

    res.status(201).json({ message: 'Certificate generated', certificateId });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/certificates/verify:
 *   get:
 *     summary: Verify a certificate by certificateId
 *     tags: [Certificate]
 *     parameters:
 *       - in: query
 *         name: certificateId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique certificate ID
 *     responses:
 *       200:
 *         description: Certificate is valid
 *       404:
 *         description: Certificate not found or revoked
 */
router.get('/verify', async (req, res) => {
  try {
    const { certificateId } = req.query;
    if (!certificateId) return res.status(400).json({ message: 'certificateId required' });

    const certificate = await Certificate.findOne({ certificateId }).populate('userId examResultId');
    if (!certificate || certificate.revoked)
      return res.status(404).json({ message: 'Certificate not valid' });

    res.json({
      certificateId: certificate.certificateId,
      user: certificate.userId,
      examResult: certificate.examResultId,
      issuedAt: certificate.issuedAt,
      revoked: certificate.revoked,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
