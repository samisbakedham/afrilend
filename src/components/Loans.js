import React from 'react';

function Loans() {
  const sampleLoans = [
    { id: 1, name: 'Amina', country: 'Kenya', amount: 300, purpose: 'Expand her shop' },
    { id: 2, name: 'Kwame', country: 'Ghana', amount: 500, purpose: 'Buy farming tools' },
  ];

  return (
    <div>
      <h2>Browse Loans</h2>
      {sampleLoans.map(loan => (
        <div key={loan.id} className="loan-card">
          <h3>{loan.name} - {loan.country}</h3>
          <p>Needs ${loan.amount} to {loan.purpose}</p>
          <label>Interest Rate: </label>
          <select>
            <option value="0">0%</option>
            <option value="2.5">2.5%</option>
            <option value="5">5%</option>
          </select>
          <button>Lend $25</button>
        </div>
      ))}
    </div>
  );
}

export default Loans;