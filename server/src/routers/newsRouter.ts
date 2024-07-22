import { Router } from 'express';
import controller from '../controllers/newController';
const router = Router();

router.get('/', controller.getNews);
router.get('/:id', controller.getNewsById);
router.post('/new', controller.createNews);
router.put('/edit/:id', controller.editNews);
router.delete('/remove/:id', controller.deleteNews);

export default router;
