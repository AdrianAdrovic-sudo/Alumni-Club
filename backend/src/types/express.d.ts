// This file extends the express library's types to include custom request properties.

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // You can replace 'any' with a specific user type if you have one
      file?: any; 
      files?: any[];  
    }
  }
}