import express from 'express';
import { getTransportData, createVehicle, deleteVehicle, createRoute, deleteRoute } from '../controllers/transportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'school_admin'));

router.get('/', getTransportData);
router.post('/vehicles', createVehicle);
router.delete('/vehicles/:id', deleteVehicle);
router.post('/routes', createRoute);
router.delete('/routes/:id', deleteRoute);

export default router;
