const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const Fingerprint = require('../models/Fingerprint');

/**
 * @swagger
 * /api/fingerprint/enroll:
 *   post:
 *     summary: Enroll fingerprint data for a user (admin only)
 *     tags: [Fingerprint]
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
 *               - data
 *             properties:
 *               userId:
 *                 type: string
 *               data:
 *                 type: string
 *                 description: Encrypted fingerprint data (base64 or hash)
 *     responses:
 *       201:
 *         description: Fingerprint enrolled
 *       400:
 *         description: Bad request
 */
router.post('/enroll', auth, adminOnly, async (req, res) => {
  try {
    const { userId, data } = req.body;
    if (!userId || !data) return res.status(400).json({ message: 'Missing data' });

    // Optionally check if user exists before saving fingerprint
    const fp = new Fingerprint({ userId, data });
    await fp.save();

    res.status(201).json({ message: 'Fingerprint enrolled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
