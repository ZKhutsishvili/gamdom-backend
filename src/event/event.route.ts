import express, { Request, Response } from 'express';
import { authenticateToken } from '../utils/auth.middlware';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();


//gets all events
router.get('/', authenticateToken(), async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});


//gets events on which user made a bet
router.get('/user/:userId', authenticateToken(), async (req, res): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const events = await prisma.event.findMany({
      where: {
        users: {
          some: {
            userId: userId
          }
        }
      }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user events' });
  }
});

// bet placement
router.post('/:id/user', authenticateToken(), async (req, res): Promise<void> => {
    try {
      const eventId = parseInt(req.params.id);
      const { userId } = req.body;
  
      
      const existingParticipant = await prisma.userOnEvent.findUnique({
        where: {
          eventId,
          userId
        }
      });
  
      if (existingParticipant) {
        res.status(400).json({ error: 'User has already has a bet' });
        return;
      }
  
      const participant = await prisma.userOnEvent.create({
        data: {
          eventId,
          userId
        }
      });
      res.status(201).json(participant);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add bet to event' });
    }
});

export default router;
