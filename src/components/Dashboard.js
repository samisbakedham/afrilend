import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = ({ totalFunded, totalLoansFunded, borrowersImpacted, lendingHistory }) => {
  // Ensure unique labels for bar chart
  const uniqueLendingHistory = lendingHistory.reduce((acc, curr) => {
    if (!acc.find(item => item.date === curr.date)) acc.push(curr);
    return acc;
  }, []);

  // Bar chart for lending history
  const barData = {
    labels: uniqueLendingHistory.map(entry => entry.date),
    datasets: [
      {
        label: 'Amount Funded ($)',
        data: uniqueLendingHistory.map(entry => entry.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...uniqueLendingHistory.map(entry => entry.amount)) * 1.2 || 100, // Dynamic max
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
    height: 300, // Fixed height to prevent overflow
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

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    height: 300, // Fixed height
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-kiva-green mb-4 text-center">Your Impact Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md h-96">
          <h4 className="text-lg font-medium text-kiva-text mb-2">Funding History</h4>
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-96">
          <h4 className="text-lg font-medium text-kiva-text mb-2">Impact Breakdown</h4>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;