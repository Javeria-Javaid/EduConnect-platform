import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import connectDB from './config/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Route imports
import authRoutes from './routes/authRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import homeworkRoutes from './routes/homeworkRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import parentRoutes from './routes/parentRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import examRoutes from './routes/examRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import transportRoutes from './routes/transportRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// Passport config
import './config/passport.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const httpServer = createServer(app);

const CORS_ORIGIN = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'];
const io = new Server(httpServer, {
    cors: { origin: CORS_ORIGIN, credentials: true }
});

// Middleware
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/profile', profileRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Socket.io Real-Time Messaging Hub
io.on('connection', (socket) => {
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
    });

    socket.on('new message', (newMessageReceived) => {
        const conversation = newMessageReceived.conversation;
        if (!conversation || !conversation.participants) return;
        
        conversation.participants.forEach(user => {
            // Don't send notification to the sender
            if (user._id === newMessageReceived.sender._id || user === newMessageReceived.sender._id) return;
            // Emit to recipient's private room
            socket.in(user._id || user).emit('message received', newMessageReceived);
        });
    });

    socket.on('typing', (data) => socket.in(data.roomId).emit('typing', data));
    socket.on('stop typing', (data) => socket.in(data.roomId).emit('stop typing', data));
    
    socket.on('disconnect', () => {
        // cleanup 
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server & Socket.io running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
