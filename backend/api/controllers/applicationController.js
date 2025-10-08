import Application from '../../models/applicationModel.js';
import Job from '../../models/jobModel.js';
import User from '../../models/userModel.js';


// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Job Seeker)
const applyForJob = async (req, res) => {
    const { jobId, applicantInfo } = req.body;
    
    const job = await Job.findById(jobId);
    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({ jobId, userId: req.user._id });
    if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
        jobId,
        userId: req.user._id,
        applicantInfo
    });

    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
};

// @desc    Get applications for the logged-in user
// @route   GET /api/applications
// @access  Private (Job Seeker)
const getMyApplications = async (req, res) => {
    const applications = await Application.find({ userId: req.user._id }).populate('jobId', 'title companyId');
    res.json(applications);
};

// @desc    Get applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
const getJobApplications = async (req, res) => {
    const job = await Job.findById(req.params.jobId);
    if (job.employerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }
    const applications = await Application.find({ jobId: req.params.jobId }).populate('userId', 'name email avatarUrl');
    res.json(applications);
};


// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
const updateApplicationStatus = async (req, res) => {
    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
        return res.status(404).json({ message: 'Application not found' });
    }

    if (application.jobId.employerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this application' });
    }
    
    application.status = req.body.status;
    const updatedApplication = await application.save();
    res.json(updatedApplication);
};


export { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus };
