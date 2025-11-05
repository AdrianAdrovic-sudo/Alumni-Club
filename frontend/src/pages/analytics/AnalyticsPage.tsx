import React from "react";

const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-4 rounded-2xl shadow">Card 1</div>
        <div className="bg-white p-4 rounded-2xl shadow">Card 2</div>
        <div className="bg-white p-4 rounded-2xl shadow">Card 3</div>
        <div className="bg-white p-4 rounded-2xl shadow">Card 4</div>
      </section>

      <section className="mt-8">
        <div className="bg-white p-4 rounded-2xl shadow">Chart section</div>
      </section>
    </div>
  );
};

export default AnalyticsPage;
