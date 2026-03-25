import Job from '../models/Job.js';

// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).populate('createdBy', 'firstName lastName email');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a job
export const createJob = async (req, res) => {
  const { title, department, type, description, status } = req.body;
  try {
    const job = await Job.create({
      title,
      department,
      type,
      description,
      status,
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
