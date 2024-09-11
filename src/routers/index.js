import { Router } from 'express';
import authRouter from './auth.js';
import carRouter from './cars.js';
import contactRouter from './contacts.js';
import userRouter from './users.js';

const routers = Router();

routers.use('/users', userRouter);
routers.use('/auth', authRouter);
routers.use('/cars', carRouter);
routers.use('/contacts', contactRouter);

export default routers;
