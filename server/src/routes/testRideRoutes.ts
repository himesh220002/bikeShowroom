import { Router } from 'express';
import * as testRideController from '../controllers/testRideController';

const router = Router();

router.post('/', testRideController.createTestRide);
router.get('/', testRideController.getTestRides);
router.get('/unread-count', testRideController.getUnreadCount);
router.patch('/:id', testRideController.updateTestRideStatus);

export default router;
