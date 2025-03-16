import React, { memo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = ({ totalFunded, totalLoansFunded, borrowersImpacted, lendingHistory }) => {
  // Log the data for debugging
  console.log('Dashboard.js: Rendering with lendingHistory:', lendingHistory);

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
    maintainAspectRatio: false, // Allow the chart to fill the container
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...uniqueLendingHistory.map(entry => entry.amount)) * 1.2 || 100, // Dynamic max
        ticks: {
          stepSize: 25, // Control tick intervals
        },
      },
      x: {
        ticks: {
          maxRotation: 45, // Rotate labels for better readability
          minRotation: 45,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
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
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-kiva-green mb-4 text-center">Your Impact Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-kiva-text mb-2">Funding History</h4>
          <div className="h-64"> {/* Fixed height container */}
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-kiva-text mb-2">Impact Breakdown</h4>
          <div className="h-64"> {/* Fixed height container */}
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize the Dashboard component to prevent unnecessary re-renders
export default memo(Dashboard);