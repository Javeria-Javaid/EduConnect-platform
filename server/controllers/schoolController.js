import School from '../models/School.js';


export const getSchools = async (req, res) => {
  const { city, vendor } = req.query;
  let query = {};
  if (city) {
    query.city = { $regex: city, $options: 'i' };
  }
  if (vendor) {
    query.vendor = vendor;
  }
  
  try {
    const schools = await School.find(query).populate('vendor', 'firstName lastName email');
    res.status(200).json(schools); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id).populate('vendor', 'firstName lastName email');
    if (school) {
      res.status(200).json(school);
    } else {
      res.status(404).json({ message: 'School not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createSchool = async (req, res) => {
  const { name, address, city, description, contactEmail, contactPhone, website, admissionOpen, facilities, fees } = req.body;

  try {
    const school = new School({
      name,
      address,
      city,
      description,
      contactEmail,
      contactPhone,
      website,
      admissionOpen,
      facilities,
      fees,
      vendor: req.user._id,
    });

    const createdSchool = await school.save();
    res.status(201).json(createdSchool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);

    if (school) {
      // Check if user is vendor of this school or admin
      if (school.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to update this school' });
      }

      school.name = req.body.name || school.name;
      school.address = req.body.address || school.address;
      school.city = req.body.city || school.city;
      school.description = req.body.description || school.description;
      school.contactEmail = req.body.contactEmail || school.contactEmail;
      school.contactPhone = req.body.contactPhone || school.contactPhone;
      school.website = req.body.website || school.website;
      school.admissionOpen = req.body.admissionOpen !== undefined ? req.body.admissionOpen : school.admissionOpen;
      school.facilities = req.body.facilities || school.facilities;
      school.fees = req.body.fees || school.fees;

      const updatedSchool = await school.save();
      res.json(updatedSchool);
    } else {
      res.status(404).json({ message: 'School not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);

    if (school) {
        if (school.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this school' });
        }
      await school.deleteOne();
      res.json({ message: 'School removed' });
    } else {
      res.status(404).json({ message: 'School not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
