import User from '../../models/userModel.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      skills: user.skills,
      notificationSettings: user.notificationSettings,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.skills = req.body.skills || user.skills;
        user.notificationSettings = req.body.notificationSettings || user.notificationSettings;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
             id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatarUrl: updatedUser.avatarUrl,
            skills: updatedUser.skills,
            notificationSettings: updatedUser.notificationSettings,
        });

    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export { getUserProfile, updateUserProfile };
