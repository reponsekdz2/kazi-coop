import mongoose from 'mongoose';

const applicantInfoSchema = new mongoose.Schema({
  educationLevel: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },
  resumeUrl: { type: String, required: false }, // Could be a URL to a stored file
});


const applicationSchema = mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Job',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending Review', 'Applied', 'Reviewed', 'Interviewing', 'Interview Scheduled', 'Offered', 'Rejected'],
      default: 'Applied',
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    applicantInfo: {
        type: applicantInfoSchema,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
