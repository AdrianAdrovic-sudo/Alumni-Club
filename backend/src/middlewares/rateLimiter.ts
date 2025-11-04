import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minut
  max: 5,
  message: {
    error: 'Previše pokušaja. Pokušajte ponovo kasnije.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
