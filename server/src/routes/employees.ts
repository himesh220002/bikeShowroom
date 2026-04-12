import express from 'express';
import Employee from '../models/Employee';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../../client/public/images/employees');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all employees (Active by default)
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const employees = await Employee.find(filter).sort({ joiningDate: -1 });
        res.json({ success: true, data: employees });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Create new employee
router.post('/', upload.single('image'), async (req: any, res) => {
    try {
        const employeeData = { ...req.body };
        if (req.file) {
            employeeData.imageUrl = `/images/employees/${req.file.filename}`;
        }
        const employee = new Employee(employeeData);
        await employee.save();
        res.json({ success: true, data: employee });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Update employee (promotions, info, resignation)
router.put('/:id', upload.single('image'), async (req: any, res) => {
    try {
        const { id } = req.params;
        const update = { ...req.body };

        if (req.file) {
            update.imageUrl = `/images/employees/${req.file.filename}`;
            // Cleanup old image if it's a local one
            const oldEmployee = await Employee.findById(id);
            if (oldEmployee && oldEmployee.imageUrl && oldEmployee.imageUrl.startsWith('/images/employees/')) {
                const oldPath = path.join(__dirname, '../../../client/public', oldEmployee.imageUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        // If status changes to Resigned, set leavingDate if not provided
        if (update.status === 'Resigned' && !update.leavingDate) {
            update.leavingDate = new Date();
        }

        const employee = await Employee.findByIdAndUpdate(id, update, { new: true });
        res.json({ success: true, data: employee });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Delete employee (rare, use Resigned instead)
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee && employee.imageUrl && employee.imageUrl.startsWith('/images/employees/')) {
            const filePath = path.join(__dirname, '../../../client/public', employee.imageUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Employee deleted' });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
