import Admission from '../models/Admission.js';

export const getAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find({});
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdmission = async (req, res) => {
  try {
    const admission = await Admission.create(req.body);
    res.status(201).json(admission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAdmissionStatus = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (admission) {
      admission.status = req.body.status || admission.status;
      await admission.save();
      res.json(admission);
    } else {
      res.status(404).json({ message: 'Admission not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
