import Admission from '../models/Admission.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Financials from '../models/Financials.js';
import mongoose from 'mongoose';

export const getEnrollmentReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const report = await Admission.aggregate([
      { $match: match },
      {
        $group: {
          _id: { 
             month: { $month: "$createdAt" },
             year: { $year: "$createdAt" }
          },
          students: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatted = report.map(item => ({
      month: monthNames[item._id.month - 1],
      students: item.students
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let match = { type: 'Income' };
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    const report = await Financials.aggregate([
      { $match: match },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatted = report.map(item => ({
      name: monthNames[item._id.month - 1],
      amount: item.amount
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let match = {};
    if (startDate || endDate) {
      match.appliedAt = {};
      if (startDate) match.appliedAt.$gte = new Date(startDate);
      if (endDate) match.appliedAt.$lte = new Date(endDate);
    }

    const report = await Application.aggregate([
      { $match: match },
      {
        $group: {
          _id: { month: { $month: "$appliedAt" } },
          applications: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatted = report.map(item => ({
      name: monthNames[item._id - 1],
      applications: item.applications
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
