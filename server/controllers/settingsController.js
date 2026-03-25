import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne().select('-smtpPass');
    if (!settings) {
      const newSettings = await Settings.create({});
      const { smtpPass, ...others } = newSettings.toObject();
      return res.json(others);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
