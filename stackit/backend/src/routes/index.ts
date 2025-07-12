import express from 'express';
import authRoutes from './authRoutes';
import questionRoutes from './questionRoutes';
import answerRoutes from './answerRoutes';
import notificationRoutes from './notificationRoutes';
import adminRoutes from './adminRoutes';

const router = express.Router();

// Use authentication routes
router.use('/auth', authRoutes);

// Use question routes
router.use('/questions', questionRoutes);

// Use answer routes
router.use('/answers', answerRoutes);

// Use notification routes
router.use('/notifications', notificationRoutes);

// Use admin routes
router.use('/admin', adminRoutes);

export default router;