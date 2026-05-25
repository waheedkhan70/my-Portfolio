import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
// If variables (like MONGODB_URI) aren't found, try loading the repo root .env
if (!process.env.MONGODB_URI) {
  const rootEnv = path.join(__dirname, '..', '.env');
  dotenv.config({ path: rootEnv });
}

const startServer = async () => {
    try {
        await connectDB();
        
        const app = express();
        app.use(cors());
        app.use(express.json());

        // Ensure uploads directory exists
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
          console.log(`Created uploads directory at ${uploadDir}`);
        } else {
          console.log(`Using existing uploads directory at ${uploadDir}`);
        }

        app.use('/api/projects', projectRoutes);
        app.use('/api/skills', skillRoutes);
        app.use('/api/profile', profileRoutes);
        app.use('/api/upload', uploadRoutes);
        app.use('/api/contact', contactRoutes);

        // Serve static files from the uploads directory
        app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

        // Error handling middleware
        app.use(notFound);
        app.use(errorHandler);

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
