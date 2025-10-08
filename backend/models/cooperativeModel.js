import mongoose from 'mongoose';

const cooperativeMemberSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    joinDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending_approval', 'awaiting_agreement', 'active', 'inactive'], default: 'pending_approval' },
    totalContribution: { type: Number, default: 0 },
    lastContributionDate: { type: Date },
    penalties: { type: Number, default: 0 },
});

const cooperativeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    members: [cooperativeMemberSchema],
    contributionAmount: { type: Number, required: true },
    contributionFrequency: { type: String, enum: ['Weekly', 'Monthly'], required: true },
    nextContributionDate: { type: Date },
    initialContribution: { type: Number, required: true },
    rulesAndRegulations: { type: String },
    announcements: [{
        message: String,
        date: { type: Date, default: Date.now }
    }],
  },
  {
    timestamps: true,
  }
);

const Cooperative = mongoose.model('Cooperative', cooperativeSchema);

export default Cooperative;
