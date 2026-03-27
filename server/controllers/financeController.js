import Transaction from '../models/Transaction.js';

export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ school: req.user.school })
            .populate('student', 'firstName lastName')
            .sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTransaction = async (req, res) => {
    try {
        const trx = new Transaction({ ...req.body, school: req.user.school });
        await trx.save();
        res.status(201).json(trx);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, school: req.user.school });
        if (!deleted) return res.status(404).json({ message: 'Transaction not found' });
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFinanceStats = async (req, res) => {
    try {
        const schoolId = req.user.school;
        
        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0);
        
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0,0,0,0);

        const allTransactions = await Transaction.find({ school: schoolId });
        
        const collectedToday = allTransactions.filter(t => t.type === 'Income' && t.status === 'Paid' && new Date(t.date) >= startOfDay).reduce((sum, t) => sum + t.amount, 0);
        const collectedMonth = allTransactions.filter(t => t.type === 'Income' && t.status === 'Paid' && new Date(t.date) >= startOfMonth).reduce((sum, t) => sum + t.amount, 0);
        const pendingDues = allTransactions.filter(t => t.type === 'Income' && t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);
        
        const expensesMonthRecords = allTransactions.filter(t => t.type === 'Expense' && new Date(t.date) >= startOfMonth);
        const expensesMonth = expensesMonthRecords.reduce((sum, t) => sum + t.amount, 0);

        // Calculate Expense breakdown
        const expenseCategoriesMap = {};
        expensesMonthRecords.forEach(t => {
            expenseCategoriesMap[t.category] = (expenseCategoriesMap[t.category] || 0) + t.amount;
        });

        const expenseCategories = Object.keys(expenseCategoriesMap).map(cat => ({
            category: cat,
            amount: expenseCategoriesMap[cat],
            percentage: expensesMonth > 0 ? Math.round((expenseCategoriesMap[cat] / expensesMonth) * 100) : 0
        })).sort((a,b) => b.amount - a.amount);

        res.json({
            collectedToday,
            collectedMonth,
            pendingDues,
            expensesMonth,
            expenseCategories
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
