// backend/src/types/express.d.ts
import { JwtUserPayload } from "./auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

export {};
