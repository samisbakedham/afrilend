import React, { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalFunded, setTotalFunded] = useState(0);
  const [totalLoansFunded, setTotalLoansFunded] = useState(0);
  const [borrowersImpacted, setBorrowersImpacted] = useState(0);
  const [lendingHistory, setLendingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          setError('User not logged in.');
          setLoading(false);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('total_loans_funded, borrowers_impacted')
          .eq('id', userId)
          .single();
        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
          setError('Failed to load profile data.');
          setLoading(false);
          return;
        }
        setTotalLoansFunded(profileData.total_loans_funded || 0);
        setBorrowersImpacted(profileData.borrowers_impacted || 0);

        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('balance')
          .eq('id', userId)
          .single();
        if (walletError) {
          console.error('Error fetching wallet:', walletError.message);
          setError('Failed to load wallet data.');
          setLoading(false);
          return;
        }
        // Use wallet balance as total funded for simplicity (adjust as needed)
        setTotalFunded(walletData.balance || 0);

        const { data: supports, error: supportError } = await supabase
          .from('loan_supports')
          .select('amount, created_at')
          .eq('user_id', userId)
          .eq('status', 'pending');
        if (supportError) {
          console.error('Error fetching loan supports:', supportError.message);
          setLendingHistory([]);
        } else {
          const history = supports.map(support => ({
            date: new Date(support.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: support.amount / 100,
          }));
          setLendingHistory(history);
        }
      } catch (err) {
        console.error('Unexpected error in fetchDashboardData:', err.message);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <p className="text-center">Loading dashboard...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  const uniqueLendingHistory = lendingHistory.reduce((acc, curr) => {
    if (!acc.find(item => item.date === curr.date)) acc.push(curr);
    return acc;
  }, []);

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
        max: Math.max(...uniqueLendingHistory.map(entry => entry.amount), 0) * 1.2 || 100,
        ticks: { stepSize: 25 },
      },
      x: {
        ticks: { maxRotation: 45, minRotation: 45 },
      },
    },
    plugins: { legend: { display: true, position: 'top' } },
  };

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
    plugins: { legend: { display: true, position: 'top' } },
  };

  return (
    <div className="max-w-4xl mx-auto bg-kiva-bg p-8">
      <h2 className="text-4xl font-bold text-kiva-green mb-8 text-center">My Dashboard</h2>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-kiva-text mb-4">Wallet Overview</h3>
          <p className="text-2xl font-bold text-kiva-green">${totalFunded.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Total Funds Lent</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-medium text-kiva-text mb-2">Funding History</h4>
            <div className="h-64">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-medium text-kiva-text mb-2">Impact Breakdown</h4>
            <div className="h-64">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-kiva-text mb-4">Your Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-kiva-green">${totalFunded.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Funded</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-kiva-green">{totalLoansFunded}</p>
              <p className="text-sm text-gray-600">Loans Funded</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-kiva-green">{borrowersImpacted}</p>
              <p className="text-sm text-gray-600">Borrowers Impacted</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="w-full mt-6 bg-kiva-green text-white py-2 rounded-lg hover:bg-kiva-light-green transition"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
};

// Memoize the Dashboard component
export default memo(Dashboard);