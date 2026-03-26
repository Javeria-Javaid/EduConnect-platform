import Product from '../models/Product.js';
import School from '../models/School.js';
import Order from '../models/Order.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user._id }).populate('school', 'name schoolName city');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.vendor.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Unauthorized' });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVendorStats = async (req, res) => {
  try {
    const [products, orders] = await Promise.all([
        Product.find({ vendor: req.user._id }),
        Order.find({ vendor: req.user._id })
    ]);
    
    const lowStockAlerts = products.filter(p => p.stock < 5).length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const monthlyEarnings = orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.amount, 0);
    
    res.json({
      activeServices: products.length,
      pendingOrders,
      monthlyEarnings,
      avgRating: 4.8,
      lowStockAlerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;
    const product = new Product({
      vendor: req.user._id,
      name,
      description,
      price,
      stock,
      category,
      imageUrl
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.vendor.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Unauthorized' });

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.vendor.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Unauthorized' });

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
