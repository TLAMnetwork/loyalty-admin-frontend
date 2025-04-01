import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RewardManagerPage = () => {
  const [rewards, setRewards] = useState([]);
  const [error, setError] = useState('');
  const [newReward, setNewReward] = useState({
    reward_name: '',
    points_required: '',
    business_id: '',
    is_network_wide: false
  });

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

  useEffect(() => {
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
      setRewards((prev) => prev.filter((r) => r.reward_id !== rewardId));
    } catch (err) {
      setError('Failed to delete reward.');
    }
  };

  const createReward = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://loyaltyappdb.onrender.com/api/admin/rewards', newReward, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewReward({
        reward_name: '',
        points_required: '',
        business_id: '',
        is_network_wide: false
      });
      fetchRewards();
      setError('');
    } catch (err) {
      setError('Failed to create reward.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Reward Manager</h2>

      {/* ✅ Reward creation form */}
      <form onSubmit={createReward} style={{ marginBottom: '2rem' }}>
        <h3>Create New Reward</h3>
        <input
          type="text"
          placeholder="Reward Name"
          value={newReward.reward_name}
          onChange={(e) => setNewReward({ ...newReward, reward_name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Points Required"
          value={newReward.points_required}
          onChange={(e) => setNewReward({ ...newReward, points_required: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Business ID"
          value={newReward.business_id}
          onChange={(e) => setNewReward({ ...newReward, business_id: e.target.value })}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={newReward.is_network_wide}
            onChange={(e) => setNewReward({ ...newReward, is_network_wide: e.target.checked })}
          />
          Network Wide
        </label>
        <button type="submit">Create Reward</button>
      </form>

      {/* ✅ Error display */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* ✅ Rewards table */}
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Reward</th>
            <th>Cost</th>
            <th>Network Wide</th>
            <th>Business</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rewards.map((reward) => (
            <tr key={reward.reward_id}>
              <td>{reward.reward_name}</td>
              <td>{reward.points_required}</td>
              <td>{reward.is_network_wide ? 'Yes' : 'No'}</td>
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
