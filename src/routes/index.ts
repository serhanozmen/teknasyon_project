import { Router } from 'express';
import { days, collect } from '../controllers/';

const router = Router();

router.get('/days', days);
router.post('/collect', collect);

export default router;
