import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import { ttsRequestSchema } from '../../schemas/tts';

const router = Router();

/**
 * POST /tts
 * Synthesize speech from text.
 */
router.post(
  '/tts',
  authenticate,
  validate(ttsRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text } = req.body as { text: string };
      res.status(200).json({ text });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
