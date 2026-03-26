import express from 'express';
const router = express.Router();
import { getVendorStats, getProducts, createProduct, updateProduct, deleteProduct, getOrders, updateOrderStatus } from '../controllers/vendorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.get('/stats', protect, authorize('vendor'), getVendorStats);
router.get('/products', protect, authorize('vendor'), getProducts);
router.post('/products', protect, authorize('vendor'), createProduct);
router.put('/products/:id', protect, authorize('vendor'), updateProduct);
router.delete('/products/:id', protect, authorize('vendor'), deleteProduct);

// Order Management
router.get('/orders', protect, authorize('vendor'), getOrders);
router.patch('/orders/:id/status', protect, authorize('vendor'), updateOrderStatus);

export default router;
