// This file manages environment variables and configurations for the application.

import { config } from 'dotenv';

config();

export const DATABASE_URL = process.env.DATABASE_URL || '';
export const PORT = process.env.PORT || 3000;