import { Router } from 'express';
import Sale from '../models/Sale';
import Bike from '../models/Bike';
import Customer from '../models/Customer';

const router = Router();

// Record a new bike sale
router.post('/', async (req, res) => {
    try {
        const { customerName, customerPhone, bikeId, variant, salePrice } = req.body;

        // 1. Find or create customer in CRM
        let customer = await Customer.findOne({ phone: customerPhone });
        if (!customer) {
            customer = new Customer({ name: customerName, phone: customerPhone });
            await customer.save();
        }

        // 2. Find bike and verify stock availability
        const bike = await Bike.findById(bikeId);
        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike not found in inventory' });
        }

        if (bike.stock <= 0) {
            return res.status(400).json({ success: false, message: `The ${bike.name} (${variant}) is currently out of stock.` });
        }

        // 3. Automated Inventory Subtraction
        bike.stock -= 1;
        await bike.save();

        // 4. Record Transaction in Sales CRM
        const sale = new Sale({
            customerId: customer._id,
            bikeId: bike._id,
            customerName,
            customerPhone,
            bikeName: bike.name,
            variant,
            salePrice
        });
        await sale.save();

        // 5. Broadcast Real-time Updates
        const io = (req as any).io;
        if (io) {
            io.emit('sale_recorded', sale.toObject());
            io.emit('inventory_updated', bike.toObject());
        }

        res.status(201).json({ success: true, data: sale });
    } catch (error: any) {
        console.error("Sale processing error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Fetch Sales History / CRM Records
router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find().sort({ createdAt: -1 });
        res.json({ success: true, data: sales });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
