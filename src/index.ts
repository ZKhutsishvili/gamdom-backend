import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import userRouter from './user/user.route';
import eventRouter from './event/event.route';
import { PrismaClient } from '@prisma/client';
import cors from 'cors'; // Import the cors package

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Prisma client initialization
export const prisma = new PrismaClient();


app.use(cors())
app.use(express.json());

// Add request logging middleware BEFORE routes
app.use((req: Request, res: Response, next: any) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

console.log('Setting up routes...');
app.use('/api/user', userRouter);
app.use('/api/event', eventRouter);
console.log('Routes set up completed');

// Add error handling middleware AFTER routes
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err.stack);
  res.status(500).send('Something broke!');
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express and Prisma!');
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
