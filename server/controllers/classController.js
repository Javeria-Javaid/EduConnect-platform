import Class from '../models/Class.js';
import StudentProfile from '../models/StudentProfile.js';

export const getClasses = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const classes = await Class.find({ school: schoolId }).populate('sections.classTeacher', 'firstName lastName');
    
    // Count students for each section
    const formattedClasses = await Promise.all(classes.map(async (cls) => {
        const sectionsWithCounts = await Promise.all(cls.sections.map(async (sec) => {
            const count = await StudentProfile.countDocuments({ 
                school: schoolId, 
                class: cls.name, 
                section: sec.name 
            });
            return {
                ...sec.toObject(),
                studentCount: count
            };
        }));
        return {
            ...cls.toObject(),
            sections: sectionsWithCounts,
            totalStudents: sectionsWithCounts.reduce((acc, s) => acc + s.studentCount, 0)
        };
    }));

    res.json(formattedClasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createClass = async (req, res) => {
  try {
    const { name, sections } = req.body;
    const schoolId = req.user.school;

    const newClass = new Class({
      school: schoolId,
      name,
      sections: sections || []
    });

    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { name, sections, active } = req.body;
    const cls = await Class.findById(req.params.id);
    
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    cls.name = name || cls.name;
    cls.sections = sections || cls.sections;
    cls.active = active !== undefined ? active : cls.active;

    await cls.save();
    res.json(cls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findOneAndDelete({ _id: req.params.id, school: req.user.school });
    if (!deleted) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClassesStats = async (req, res) => {
    try {
        const schoolId = req.user.school;
        const classes = await Class.find({ school: schoolId });
        
        const totalClasses = classes.length;
        const totalSections = classes.reduce((acc, c) => acc + c.sections.length, 0);
        
        const studentProfiles = await StudentProfile.find({ school: schoolId });
        const totalStudents = studentProfiles.length;
        const avgStudents = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
        
        const teachersWithAssignment = classes.reduce((acc, c) => {
            return acc + c.sections.filter(s => s.classTeacher).length;
        }, 0);
        
        const teacherAssignment = totalSections > 0 ? Math.round((teachersWithAssignment / totalSections) * 100) : 0;

        res.json({
            totalClasses,
            totalSections,
            avgStudents,
            teacherAssignment,
            recentlyAdded: 0,
            issues: []
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
