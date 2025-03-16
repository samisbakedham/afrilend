import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = ({ totalFunded, totalLoansFunded, borrowersImpacted, lendingHistory }) => {
  // Bar chart for lending history (amount over time)
  const barData = {
    labels: lendingHistory.map(entry => entry.date),
    datasets: [
      {
        label: 'Amount Funded ($)',
        data: lendingHistory.map(entry => entry.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Pie chart for impact breakdown
  const pieData = {
    labels: ['Loans Funded', 'Borrowers Impacted'],
    datasets: [
      {
        data: [totalLoansFunded, borrowersImpacted],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-afrilend-green mb-4 text-center">Your Impact Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Funding History</h4>
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Impact Breakdown</h4>
          <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;