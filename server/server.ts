import dotenv from 'dotenv';
import app from './app.js';
import pool from '../config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Start the Express server
 * Tests database connection before starting
 */
const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    const connection = await pool.getConnection();
    console.log('✓ Database connected successfully');
    connection.release();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('✗ Failed to start server:', errorMessage);
    process.exit(1);
  }
};

startServer();
