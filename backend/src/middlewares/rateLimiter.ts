import rateLimit from "express-rate-limit";

// Ograničava 5 zahteva u minuti po IP adresi
export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minut
  max: 5,
  message: {
    error: {
      status: 429,
      message: "Previše pokušaja. Pokušajte ponovo kasnije.",
    },
  },
  standardHeaders: true, // X-RateLimit headers
  legacyHeaders: false,
});
