import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaWallet, FaPlus, FaHistory } from 'react-icons/fa';

function Wallet({ user }) {
  const [wallet, setWallet] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const walletRes = await axios.get('/user/wallet');
      setWallet(walletRes.data.wallet);

      const transRes = await axios.get('/user/transactions');
      setTransactions(transRes.data);
    } catch (error) {
      toast.error('Error fetching wallet data');
    }
  };

  const handleAddFunds = async (method) => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      if (method === 'stripe') {
        const response = await axios.post('/payment/stripe/add-funds', {
          amount: parseFloat(amount)
        });
        window.location.href = response.data.url;
      } else if (method === 'paypal') {
        await axios.post('/payment/paypal/add-funds', {
          amount: parseFloat(amount)
        });
        toast.success('Redirecting to PayPal...');
      }
    } catch (error) {
      toast.error('Error adding funds');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <FaWallet className="text-yellow-400" />
          My Wallet
        </h1>

        {/* Wallet Balance */}
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-8 rounded-lg shadow-lg mb-8">
          <p className="text-yellow-200 mb-2">Current Balance</p>
          <p className="text-5xl font-bold">${wallet.toFixed(2)}</p>
        </div>

        {/* Add Funds */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FaPlus />
            Add Funds
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount ($)"
              className="flex-1 bg-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleAddFunds('stripe')}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-lg font-bold transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Add with Stripe'}
            </button>
            <button
              onClick={() => handleAddFunds('paypal')}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 py-3 px-6 rounded-lg font-bold transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Add with PayPal'}
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FaHistory />
            Transaction History
          </h2>

          {transactions.length === 0 ? (
            <p className="text-gray-400">No transactions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Method</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="border-t border-gray-700 hover:bg-gray-700">
                      <td className="p-3">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className={tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}>
                          {tx.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3">${tx.amount}</td>
                      <td className="p-3">{tx.method}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded ${
                          tx.status === 'completed' ? 'bg-green-600' :
                          tx.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wallet;