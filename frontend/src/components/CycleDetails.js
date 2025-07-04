import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';

const CycleDetails = ({ cycle, onClose }) => {
  const [journals, setJournals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cycle) return;
    setLoading(true);
    setError(null);
    Promise.all([
      axios.get('/api/journal?cycle=' + cycle._id),
      axios.get('/api/appointments?cycle=' + cycle._id),
      axios.get('/api/health-metrics?cycle=' + cycle._id)
    ])
      .then(([jRes, aRes, mRes]) => {
        setJournals(jRes.data);
        setAppointments(aRes.data);
        setMetrics(mRes.data);
      })
      .catch(() => setError('Failed to fetch cycle data'))
      .finally(() => setLoading(false));
  }, [cycle]);

  if (!cycle) return null;

  return (
    <div>
      <button onClick={onClose} style={{ float: 'right' }}>Close</button>
      <h3>Cycle Details</h3>
      <p><b>Start:</b> {new Date(cycle.startDate).toLocaleDateString()}</p>
      <p><b>End:</b> {cycle.endDate ? new Date(cycle.endDate).toLocaleDateString() : '-'}</p>
      <p><b>Status:</b> {cycle.status}</p>
      <p><b>Notes:</b> {cycle.notes || '-'}</p>
      {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <>
          <h4>Journal Entries</h4>
          {journals.length === 0 ? <p>No journal entries.</p> : (
            <ul>
              {journals.map(j => (
                <li key={j._id}><b>{j.title}</b> ({new Date(j.date).toLocaleDateString()})</li>
              ))}
            </ul>
          )}
          <h4>Appointments</h4>
          {appointments.length === 0 ? <p>No appointments.</p> : (
            <ul>
              {appointments.map(a => (
                <li key={a._id}><b>{a.title}</b> ({a.date} {a.time})</li>
              ))}
            </ul>
          )}
          <h4>Health Metrics</h4>
          {metrics.length === 0 ? <p>No health metrics.</p> : (
            <ul>
              {metrics.map(m => (
                <li key={m._id}><b>{new Date(m.date).toLocaleDateString()}</b>: Weight {m.weight}, BP {m.bloodPressure?.systolic}/{m.bloodPressure?.diastolic}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default CycleDetails; 