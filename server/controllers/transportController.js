import Vehicle from '../models/Vehicle.js';
import Route from '../models/Route.js';

export const getTransportData = async (req, res) => {
    try {
        const schoolId = req.user.school;
        const [vehicles, routes] = await Promise.all([
            Vehicle.find({ school: schoolId }),
            Route.find({ school: schoolId }).populate('vehicle')
        ]);
        
        const activeRoutesCount = routes.length;
        const totalVehicles = vehicles.length;
        const driversAvailable = vehicles.filter(v => v.status === 'Active').length;

        res.json({
            stats: { totalVehicles, activeRoutes: activeRoutesCount, studentsUsingTransport: 0, pendingRequests: 0, driversAvailable },
            vehicles,
            routes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createVehicle = async (req, res) => {
    try {
        const v = new Vehicle({ ...req.body, school: req.user.school });
        await v.save();
        res.status(201).json(v);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteVehicle = async (req, res) => {
    try {
        await Vehicle.findOneAndDelete({ _id: req.params.id, school: req.user.school });
        res.json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createRoute = async (req, res) => {
    try {
        const r = new Route({ ...req.body, school: req.user.school });
        await r.save();
        res.status(201).json(r);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteRoute = async (req, res) => {
    try {
        await Route.findOneAndDelete({ _id: req.params.id, school: req.user.school });
        res.json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};
