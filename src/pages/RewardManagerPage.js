import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RewardManagerPage = () => {
  const [rewards, setRewards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://loyaltyappdb.onrender.com/api/admin/rewards', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRewards(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching rewards');
      }
    };

    fetchRewards();
  }, []);
  const deleteReward = async (rewardId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reward?");
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://loyaltyappdb.onrender.com/api/admin/rewards/${rewardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setError('');
      setRewards((prev) => prev.filter((r) => r.reward_id !== rewardId)); // Update list without refetching
    } catch (err) {
      setError('Failed to delete reward.');
    }
  };
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Reward Manager</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Reward</th>
            <th>Description</th>
            <th>Cost</th>
            <th>Business</th>
            <th>Actions</th> {/* ✅ Add this */}
          </tr>
        </thead>
        <tbody>
          {rewards.map((reward) => (
            <tr key={reward.reward_id}>
              <td>{reward.title}</td>
              <td>{reward.description}</td>
              <td>{reward.cost}</td>
              <td>{reward.business_name}</td>
              <td>
                <button
                  onClick={() => deleteReward(reward.reward_id)}
                  style={{ color: 'red' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardManagerPage;
