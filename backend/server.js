const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*', // Allow all origins for dev
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Route files
const auth = require('./routes/authRoutes');
const tasks = require('./routes/taskRoutes');
const logs = require('./routes/activityRoutes');
const ai = require('./routes/aiRoutes');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/tasks', tasks);
app.use('/api/logs', logs);
app.use('/api/ai', ai);

// Socket.io Real-time Logics
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinOrganization', (orgId) => {
    socket.join(orgId);
    console.log(`User joined organization: ${orgId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Attach io to req for use in controllers
app.set('io', io);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
