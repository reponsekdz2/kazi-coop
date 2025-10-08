import Cooperative from '../../models/cooperativeModel.js';

// @desc    Get all cooperatives
// @route   GET /api/cooperatives
// @access  Public
const getCooperatives = async (req, res) => {
    const cooperatives = await Cooperative.find({}).populate('creatorId', 'name');
    res.json(cooperatives);
};

// @desc    Create a cooperative
// @route   POST /api/cooperatives
// @access  Private (Employer)
const createCooperative = async (req, res) => {
    const { name, description, contributionAmount, contributionFrequency, initialContribution, rulesAndRegulations } = req.body;

    const cooperative = new Cooperative({
        name,
        description,
        contributionAmount,
        contributionFrequency,
        initialContribution,
        rulesAndRegulations,
        creatorId: req.user._id,
        members: [{ userId: req.user._id, status: 'active' }] // Creator is the first active member
    });

    const createdCooperative = await cooperative.save();
    res.status(201).json(createdCooperative);
};

// @desc    Join a cooperative
// @route   POST /api/cooperatives/:id/join
// @access  Private
const joinCooperative = async (req, res) => {
    const cooperative = await Cooperative.findById(req.params.id);

    if (!cooperative) {
        return res.status(404).json({ message: 'Cooperative not found' });
    }

    const isAlreadyMember = cooperative.members.some(member => member.userId.toString() === req.user._id.toString());
    if (isAlreadyMember) {
        return res.status(400).json({ message: 'You are already a member or your request is pending' });
    }

    cooperative.members.push({ userId: req.user._id });
    await cooperative.save();
    res.json({ message: 'Request to join sent successfully' });
};


// @desc    Approve a member
// @route   PUT /api/cooperatives/:id/members/:memberId/approve
// @access  Private (Employer)
const approveMember = async (req, res) => {
    const cooperative = await Cooperative.findById(req.params.id);

     if (!cooperative) {
        return res.status(404).json({ message: 'Cooperative not found' });
    }

    if (cooperative.creatorId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to manage this cooperative' });
    }

    const member = cooperative.members.find(m => m.userId.toString() === req.params.memberId);

    if (member) {
        member.status = 'active';
        await cooperative.save();
        res.json({ message: 'Member approved' });
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
};

export { getCooperatives, createCooperative, joinCooperative, approveMember };
