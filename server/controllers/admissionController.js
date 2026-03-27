import Admission from '../models/Admission.js';

// GET all admissions for the logged-in user's school
export const getAdmissions = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const { status } = req.query;
    const query = { school: schoolId };
    if (status) query.status = status;
    const admissions = await Admission.find(query).sort({ createdAt: -1 });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST new admission - open to public (no auth), assigns to school
export const createAdmission = async (req, res) => {
  try {
    const admission = await Admission.create(req.body);
    res.status(201).json(admission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update status (Accept / Reject / Waitlist / Pending / On Hold)
export const updateAdmissionStatus = async (req, res) => {
  try {
    const admission = await Admission.findOne({ _id: req.params.id, school: req.user.school });
    if (!admission) return res.status(404).json({ message: 'Admission not found' });
    admission.status = req.body.status || admission.status;
    await admission.save();
    res.json(admission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE an admission
export const deleteAdmission = async (req, res) => {
  try {
    const admission = await Admission.findOneAndDelete({ _id: req.params.id, school: req.user.school });
    if (!admission) return res.status(404).json({ message: 'Admission not found' });
    res.json({ message: 'Admission deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET admission stats for the dashboard
export const getAdmissionStats = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, pending, accepted, rejected, onHold, todayCount] = await Promise.all([
      Admission.countDocuments({ school: schoolId }),
      Admission.countDocuments({ school: schoolId, status: 'Pending' }),
      Admission.countDocuments({ school: schoolId, status: 'Accepted' }),
      Admission.countDocuments({ school: schoolId, status: 'Rejected' }),
      Admission.countDocuments({ school: schoolId, status: 'On Hold' }),
      Admission.countDocuments({ school: schoolId, createdAt: { $gte: today } }),
    ]);

    const conversionRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

    res.json({
      total,
      activeCycles: 1,  // placeholder until AdmissionCycle model is added
      applicationsToday: todayCount,
      inReview: pending,
      accepted,
      rejected,
      onHold,
      conversionRate,
      missingDocs: 0, // placeholder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
