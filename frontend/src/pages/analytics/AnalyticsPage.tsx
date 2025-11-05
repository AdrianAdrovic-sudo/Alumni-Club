import React, { useEffect, useState } from 'react';
import { getStats } from '../../services/api';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

interface Stats {
  totalUsers: number;
  verifiedUsers: number;
  blogs: number;
  news: number;
}

const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    async function fetchStats() {
      const data = await getStats();
      setStats(data);
      setLastUpdated(new Date().toLocaleString());
    }
    fetchStats();
  }, []);

  if (!stats) return <div>Učitavanje...</div>;

  const chartData = {
    labels: ['Ukupno članova', 'Verifikovani članovi', 'Blogovi', 'Novosti'],
    datasets: [
      {
        label: 'Statistika',
        data: [stats.totalUsers, stats.verifiedUsers, stats.blogs, stats.news],
        backgroundColor: ['#60A5FA', '#34D399', '#FBBF24', '#F87171'],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analitički Panel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Ukupno članova</p>
          <p className="text-xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Verifikovani članovi</p>
          <p className="text-xl font-bold">{stats.verifiedUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Blogovi</p>
          <p className="text-xl font-bold">{stats.blogs}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Novosti</p>
          <p className="text-xl font-bold">{stats.news}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <Bar data={chartData} />
      </div>

      <p className="text-gray-400 text-sm">Poslednje ažurirano: {lastUpdated}</p>
    </div>
  );
};

export default AnalyticsPage;
