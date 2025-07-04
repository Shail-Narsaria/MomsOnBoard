import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import CycleDetails from './CycleDetails';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

const PregnancyCycles = ({ onCycleChange }) => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/pregnancy-cycles');
      setCycles(res.data);
    } catch (err) {
      setError('Failed to fetch cycles');
    }
    setLoading(false);
  };

  const handleStartCycle = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await axios.post('/api/pregnancy-cycles', { startDate, notes });
      setStartDate('');
      setNotes('');
      fetchCycles();
      if (onCycleChange) onCycleChange();
    } catch (err) {
      setError('Failed to start new cycle');
    }
    setSubmitting(false);
  };

  const handleTerminateCycle = async (cycleId) => {
    setSubmitting(true);
    setError(null);
    try {
      await axios.put(`/api/pregnancy-cycles/${cycleId}/terminate`);
      fetchCycles();
      if (onCycleChange) onCycleChange();
    } catch (err) {
      setError('Failed to terminate cycle');
    }
    setSubmitting(false);
  };

  const activeCycle = cycles.find(c => c.status === 'active');

  return (
    <div>
      <h2>Pregnancy Cycles</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          {activeCycle ? (
            <div style={{ border: '1px solid #ccc', padding: 16, marginBottom: 16 }}>
              <h3>Active Cycle</h3>
              <p><b>Start Date:</b> {new Date(activeCycle.startDate).toLocaleDateString()}</p>
              <p><b>Notes:</b> {activeCycle.notes || '-'}</p>
              <button onClick={() => handleTerminateCycle(activeCycle._id)} disabled={submitting}>
                Terminate Cycle
              </button>
            </div>
          ) : (
            <form onSubmit={handleStartCycle} style={{ marginBottom: 16 }}>
              <h3>Start New Cycle</h3>
              <label>
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                />
              </label>
              <br />
              <label>
                Notes:
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Optional"
                />
              </label>
              <br />
              <button type="submit" disabled={submitting}>
                Start Cycle
              </button>
            </form>
          )}

          <h3>All Cycles</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map(cycle => (
                <tr key={cycle._id} style={cycle.status === 'active' ? { background: '#e0ffe0', cursor: 'pointer' } : { cursor: 'pointer' }} onClick={() => setSelectedCycle(cycle)}>
                  <td>{new Date(cycle.startDate).toLocaleDateString()}</td>
                  <td>{cycle.endDate ? new Date(cycle.endDate).toLocaleDateString() : '-'}</td>
                  <td>{cycle.status}</td>
                  <td>{cycle.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Dialog open={!!selectedCycle} onClose={() => setSelectedCycle(null)} maxWidth="md" fullWidth>
            <DialogTitle>Cycle Details</DialogTitle>
            <DialogContent>
              <CycleDetails cycle={selectedCycle} onClose={() => setSelectedCycle(null)} />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default PregnancyCycles; 