const { generateTaskWithAI } = require('../utils/ai');

// @desc    Generate task details using AI
// @route   POST /api/ai/generate
// @access  Private
const generateTask = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Please provide a prompt' });
    }

    const aiResult = await generateTaskWithAI(prompt);

    res.status(200).json({
      success: true,
      data: aiResult
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { generateTask };
