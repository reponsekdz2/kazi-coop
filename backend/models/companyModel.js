import mongoose from 'mongoose';

const companySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    location: { type: String, required: true },
    employerId: { // The user who created the company profile
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', companySchema);

export default Company;
