import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: 'Events route' });
});

export default router;
