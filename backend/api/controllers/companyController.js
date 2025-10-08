import Company from '../../models/companyModel.js';

// @desc    Fetch all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res) => {
  const companies = await Company.find({});
  res.json(companies);
};


// @desc    Create a company
// @route   POST /api/companies
// @access  Private (Employer)
const createCompany = async (req, res) => {
    const { name, description, industry, location } = req.body;
    
    const companyExists = await Company.findOne({ name });

    if(companyExists) {
        res.status(400).json({ message: 'Company already exists' });
        return;
    }

    const company = new Company({
        name,
        description,
        industry,
        location,
        employerId: req.user._id
    });

    const createdCompany = await company.save();
    res.status(201).json(createdCompany);
};


export { getCompanies, createCompany };
