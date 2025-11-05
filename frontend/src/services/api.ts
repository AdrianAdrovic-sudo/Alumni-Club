// frontend/src/services/api.ts

export interface Stats {
  totalUsers: number;
  verifiedUsers: number;
  blogs: number;
  news: number;
}

// Za sada mock podaci
export const getStats = async (): Promise<Stats> => {
  return {
    totalUsers: 120,
    verifiedUsers: 95,
    blogs: 25,
    news: 6,
  };
};