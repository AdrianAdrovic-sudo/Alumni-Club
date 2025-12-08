import React from 'react';

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    totalPosts: number;
    totalEvents: number;
    totalComments: number;
    recentRegistrations: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statCards = [
    {
      title: 'Ukupno korisnika',
      value: stats.totalUsers,
      color: 'bg-blue-500',
      icon: '👥'
    },
    {
      title: 'Aktivni korisnici',
      value: stats.activeUsers,
      color: 'bg-green-500',
      icon: '✅'
    },
    {
      title: 'Neaktivni korisnici',
      value: stats.inactiveUsers,
      color: 'bg-red-500',
      icon: '❌'
    },
    {
      title: 'Ukupno objava',
      value: stats.totalPosts,
      color: 'bg-purple-500',
      icon: '📝'
    },
    {
      title: 'Ukupno događaja',
      value: stats.totalEvents,
      color: 'bg-orange-500',
      icon: '📅'
    },
    {
      title: 'Nedavne registracije',
      value: stats.recentRegistrations,
      color: 'bg-teal-500',
      icon: '🆕'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
            <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}