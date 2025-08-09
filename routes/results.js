const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const ExamResult = require('../models/ExamResult');

/**
 * @swagger
 * /api/results/upload:
 *   post:
 *     summary: Upload exam results for a student (admin only)
 *     tags: [Exam Results]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - examName
 *               - year
 *               - scores
 *             properties:
 *               userId:
 *                 type: string
 *               examName:
 *                 type: string
 *               year:
 *                 type: integer
 *               scores:
 *                 type: object
 *                 additionalProperties:
 *                   type: number
 *     responses:
 *       201:
 *         description: Exam result uploaded
 *       400:
 *         description: Bad request
 */
router.post('/upload', auth, adminOnly, async (req, res) => {
  try {
    const { userId, examName, year, scores } = req.body;
    if (!userId || !examName || !year || !scores)
      return res.status(400).json({ message: 'Missing fields' });

    const examResult = new ExamResult({ userId, examName, year, scores });
    await examResult.save();

    res.status(201).json({ message: 'Exam result uploaded' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
