import { Router } from 'express';
import { AlumniController } from '../controllers/alumni.controller';

const router = Router();
const alumniController = new AlumniController();

// Define routes for alumni
router.get('/', alumniController.getAllAlumni);
router.get('/:id', alumniController.getAlumniById);
router.post('/', alumniController.createAlumni);
router.put('/:id', alumniController.updateAlumni);
router.delete('/:id', alumniController.deleteAlumni);

export default router;