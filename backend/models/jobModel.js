import mongoose from 'mongoose';

const jobSchema = mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Company',
    },
    title: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['Full-time', 'Part-time', 'Contract'],
    },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
    salary: { type: Number },
    workersNeeded: { type: Number },
    rating: { type: Number },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
