import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

function LendingHistory({ userId }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_id', userId)
        .eq('type', 'loan_fund');
      if (error) console.error('Error fetching transactions:', error.message);
      else setTransactions(data || []);
    };
    fetchTransactions();
  }, [userId]);

  return (
    <div className="mt-4">
      <h4 className="text-xl font-semibold">Lending History</h4>
      {transactions.length > 0 ? (
        <ul className="mt-2">
          {transactions.map(transaction => (
            <li key={transaction.id} className="p-2 bg-white rounded mt-1">
              <p>Amount: ${transaction.amount}</p>
              <p>Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
              <p>Description: {transaction.description || 'Loan funded'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2">No lending history yet.</p>
      )}
    </div>
  );
}

export default LendingHistory;