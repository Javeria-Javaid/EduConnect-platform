import Job from '../models/Job.js';
import Application from '../models/Application.js';

// Get all jobs with applicant counts
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    
    // Enrich jobs with applicant counts
    const enrichedJobs = await Promise.all(jobs.map(async (job) => {
      const count = await Application.countDocuments({ jobRef: job._id });
      return { ...job.toObject(), applicantsCount: count };
    }));

    res.json(enrichedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a job
export const createJob = async (req, res) => {
  const { title, department, type, description, status, location, salary } = req.body;
  try {
    const job = await Job.create({
      title,
      department,
      type,
      description,
      status,
      location,
      salary,
      createdBy: req.user._id
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      job.title = req.body.title || job.title;
      job.department = req.body.department || job.department;
      job.type = req.body.type || job.type;
      job.description = req.body.description || job.description;
      job.status = req.body.status || job.status;
      job.location = req.body.location || job.location;
      job.salary = req.body.salary || job.salary;
      
      const updatedJob = await job.save();
      res.json(updatedJob);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      await job.deleteOne();
      res.json({ message: 'Job removed' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get applicants for a specific job
export const getJobApplicants = async (req, res) => {
  try {
    const applicants = await Application.find({ jobRef: req.params.id })
      .populate('applicantRef', 'firstName lastName email phone')
      .sort({ appliedAt: -1 });
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
