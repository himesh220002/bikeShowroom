import { Router } from 'express';
import Sale from '../models/Sale';
import Bike from '../models/Bike';
import Customer from '../models/Customer';
import UserBike from '../models/UserBike';

const router = Router();

// Record a new bike sale
router.post('/', async (req, res) => {
    try {
        const {
            customerName,
            customerPhone,
            bikeId,
            variant,
            exShowroomPrice,
            insurance,
            roadTax,
            salePrice,
            chassisNumber,
            engineNumber,
            paymentMethod,
            financeProvider,
            invoiceNumber,
            salesperson
        } = req.body;

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

        // Find bike color and verify stock availability
        const colorIndex = bike.colors.findIndex((c: any) => c.name === variant || c.colorOption === variant);
        if (colorIndex === -1) {
            return res.status(400).json({ success: false, message: `Color variant "${variant}" not found for ${bike.name}.` });
        }

        if (bike.colors[colorIndex].stock <= 0) {
            return res.status(400).json({ success: false, message: `The ${bike.name} (${variant}) is currently out of stock.` });
        }

        // 3. Automated Inventory Subtraction
        bike.colors[colorIndex].stock -= 1;
        bike.markModified('colors');
        await bike.save();

        // 4. Record Transaction in Sales CRM
        const sale = new Sale({
            customerId: customer._id,
            bikeId: bike._id,
            customerName,
            customerPhone,
            bikeName: bike.name,
            variant,
            exShowroomPrice,
            insurance,
            roadTax,
            salePrice,
            chassisNumber,
            engineNumber,
            paymentMethod,
            financeProvider,
            invoiceNumber,
            salesperson
        });
        await sale.save();

        // Update Customer LTV
        const numericPrice = Number(salePrice.toString().replace(/[^0-9.]/g, ''));
        if (!isNaN(numericPrice) && customer) {
            customer.lifetimeValue = (customer.lifetimeValue || 0) + numericPrice;
            await customer.save();
        }

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

// Update registration number and sync with UserBike
router.put('/:id/registration', async (req, res) => {
    try {
        const { registrationNumber } = req.body;
        const sale = await Sale.findById(req.params.id);

        if (!sale) {
            return res.status(404).json({ success: false, message: 'Sale record not found' });
        }

        sale.registrationNumber = registrationNumber;
        sale.registrationVerified = true;
        await sale.save();

        // Sync with UserBike if it exists
        if (sale.chassisNumber) {
            const normalizedChassis = sale.chassisNumber.trim().toUpperCase();
            const userBike = await UserBike.findOne({
                chassisNumber: { $regex: new RegExp(`^${normalizedChassis}$`, 'i') }
            });
            if (userBike) {
                userBike.registrationNumber = registrationNumber;
                userBike.registrationVerified = true;
                await userBike.save();
                console.log(`Synced registration ${registrationNumber} to UserBike for chassis ${normalizedChassis}`);
            } else {
                console.log(`No UserBike found for chassis ${normalizedChassis} to sync registration.`);
            }
        }

        res.json({ success: true, data: sale, message: 'Registration updated and synced' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
