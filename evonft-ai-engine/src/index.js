import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { evolutionRouter } from './routes/evolution.js';
import { monitorRouter } from './routes/monitor.js';
import { startEvolutionScheduler } from './services/scheduler.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/evolution', evolutionRouter);
app.use('/api/monitor', monitorRouter);

// Error handling
app.use((err, req, res, next) => {
    logger.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
    logger.info(`🚀 AI Engine running on port ${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);

    // Start background scheduler
    startEvolutionScheduler();
});

export default app;
