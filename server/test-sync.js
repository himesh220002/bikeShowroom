const mongoose = require('mongoose');
const Sale = require('./src/models/Sale').default;
const UserBike = require('./src/models/UserBike').default;

const mongoUri = 'mongodb+srv://himesh682:himesh682@cluster0.zps3i.mongodb.net/bikeYamahaDB?retryWrites=true&w=majority&appName=Cluster0';

async function testSync() {
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const testChassis = 'TEST-CHASSIS-123';

    // 1. Create a dummy UserBike
    await UserBike.deleteMany({ chassisNumber: testChassis });
    const userBike = new UserBike({
        userId: new mongoose.Types.ObjectId(),
        bikeModel: 'Test Bike',
        registrationNumber: 'OLD-REG',
        chassisNumber: testChassis,
        purchaseDate: new Date()
    });
    await userBike.save();
    console.log('Created UserBike');

    // 2. Create a dummy Sale
    await Sale.deleteMany({ chassisNumber: testChassis });
    const sale = new Sale({
        customerId: new mongoose.Types.ObjectId(),
        bikeId: new mongoose.Types.ObjectId(),
        customerName: 'Test Customer',
        customerPhone: '1234567890',
        bikeName: 'Test Bike',
        variant: 'Standard',
        exShowroomPrice: '100000',
        salePrice: '110000',
        chassisNumber: testChassis
    });
    await sale.save();
    console.log('Created Sale');

    // 3. Update Sale via local logic (mimic the route)
    const registrationNumber = 'NEW-REG-VERIFIED';
    sale.registrationNumber = registrationNumber;
    sale.registrationVerified = true;
    await sale.save();

    const normalizedChassis = sale.chassisNumber.trim().toUpperCase();
    const foundUserBike = await UserBike.findOne({
        chassisNumber: { $regex: new RegExp(`^${normalizedChassis}$`, 'i') }
    });
    if (foundUserBike) {
        foundUserBike.registrationNumber = registrationNumber;
        foundUserBike.registrationVerified = true;
        await foundUserBike.save();
        console.log('Sync SUCCESSFUL');
    } else {
        console.log('Sync FAILED: UserBike not found');
    }

    // 4. Verify
    const finalBike = await UserBike.findOne({ chassisNumber: testChassis });
    console.log('Final UserBike Reg:', finalBike.registrationNumber);
    console.log('Final UserBike Verified:', finalBike.registrationVerified);

    await mongoose.disconnect();
}

testSync().catch(console.error);
