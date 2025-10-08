import Job from '../../models/jobModel.js';
import Company from '../../models/companyModel.js';

// @desc    Fetch all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  const jobs = await Job.find({}).populate('companyId', 'name');
  res.json(jobs);
};

// @desc    Fetch single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    const job = await Job.findById(req.params.id).populate('companyId', 'name');
    if (job) {
        res.json(job);
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Employer)
const createJob = async (req, res) => {
    const { title, companyId, location, type, description, requirements, salary } = req.body;
    
    const company = await Company.findById(companyId);
    if (!company) {
        return res.status(400).json({ message: 'Company not found' });
    }

    const job = new Job({
        title,
        companyId,
        location,
        type,
        description,
        requirements,
        salary,
        employerId: req.user._id,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Employer)
const updateJob = async (req, res) => {
    const { title, location, type, description, requirements, status } = req.body;
    const job = await Job.findById(req.params.id);

    if (job) {
        // Check if the user is the owner of the job
        if (job.employerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User not authorized to update this job' });
        }
        job.title = title;
        job.location = location;
        job.type = type;
        job.description = description;
        job.requirements = requirements;
        job.status = status;

        const updatedJob = await job.save();
        res.json(updatedJob);

    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer)
const deleteJob = async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        if (job.employerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User not authorized to delete this job' });
        }
        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};


export { getJobs, getJobById, createJob, updateJob, deleteJob };
