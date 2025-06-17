import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAdvancedHealthEntry, updateAdvancedHealthEntry, fetchAdvancedHealthEntries } from '../../redux/slices/advancedHealthSlice';
import { Pill, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';

const MedicationReminders = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const { entries } = useSelector(state => state.advancedHealth);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [time, setTime] = useState('');
  const [medicationType, setMedicationType] = useState('supplement');
  const [notes, setNotes] = useState('');

  const medicationEntries = entries.filter(entry => entry.type === 'medication');

  const medicationTypes = [
    { id: 'prescription', label: 'Prescription', color: 'bg-red-100 text-red-600', icon: '💊' },
    { id: 'supplement', label: 'Supplement', color: 'bg-blue-100 text-blue-600', icon: '💊' },
    { id: 'vitamin', label: 'Vitamin', color: 'bg-green-100 text-green-600', icon: '💊' },
    { id: 'other', label: 'Other', color: 'bg-gray-100 text-gray-600', icon: '💊' }
  ];

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'As needed',
    'Weekly',
    'Monthly'
  ];

  const addMedication = async () => {
    try {
      await dispatch(createAdvancedHealthEntry({
        type: 'medication',
        date: selectedDate,
        name,
        dosage,
        frequency,
        time: time ? new Date(time) : null,
        taken: false,
        notes,
        type: medicationType
      })).unwrap();
      
      // Reset form
      setName('');
      setDosage('');
      setFrequency('');
      setTime('');
      setNotes('');
    } catch (error) {
      console.error('Failed to add medication:', error);
    }
  };

  const toggleTaken = async (entryId, currentTaken) => {
    try {
      await dispatch(updateAdvancedHealthEntry({
        id: entryId,
        entryData: { taken: !currentTaken }
      })).unwrap();
    } catch (error) {
      console.error('Failed to update medication status:', error);
    }
  };

  const getMedicationTypeColor = (type) => {
    const medication = medicationTypes.find(m => m.id === type);
    return medication ? medication.color : 'bg-gray-100 text-gray-600';
  };

  const getMedicationIcon = (type) => {
    const medication = medicationTypes.find(m => m.id === type);
    return medication ? medication.icon : '💊';
  };

  const getTakenStatus = () => {
    const taken = medicationEntries.filter(entry => entry.medication.taken).length;
    const total = medicationEntries.length;
    return { taken, total, percentage: total > 0 ? Math.round((taken / total) * 100) : 0 };
  };

  const getUpcomingMedications = () => {
    const now = new Date();
    const today = new Date(selectedDate);
    return medicationEntries
      .filter(entry => !entry.medication.taken)
      .filter(entry => {
        if (!entry.medication.time) return true;
        const medicationTime = new Date(entry.medication.time);
        return medicationTime >= now;
      })
      .sort((a, b) => {
        if (!a.medication.time && !b.medication.time) return 0;
        if (!a.medication.time) return 1;
        if (!b.medication.time) return -1;
        return new Date(a.medication.time) - new Date(b.medication.time);
      });
  };

  const takenStatus = getTakenStatus();
  const upcomingMedications = getUpcomingMedications();

  return (
    <div className="space-y-6">
      {/* Add Medication */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Pill className="h-5 w-5 mr-2 text-orange-600" />
            Medication Reminders
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(selectedDate).toLocaleDateString()}
          </div>
        </div>

        {/* Medication Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Medication Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {medicationTypes.map((medication) => (
              <button
                key={medication.id}
                onClick={() => setMedicationType(medication.id)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  medicationType === medication.id
                    ? medication.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <div className="text-lg mb-1">{medication.icon}</div>
                {medication.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medication Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Medication Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Prenatal Vitamins"
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dosage
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 1 tablet"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select frequency</option>
              {frequencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time (optional)
            </label>
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
            placeholder="Special instructions, side effects, etc."
          />
        </div>

        <button
          onClick={addMedication}
          disabled={!name || !dosage || !frequency}
          className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="h-4 w-4 inline mr-2" />
          Add Medication
        </button>
      </div>

      {/* Today's Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Today's Progress
        </h4>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{takenStatus.taken} of {takenStatus.total} taken</span>
            <span>{takenStatus.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-orange-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${takenStatus.percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {takenStatus.taken}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Taken</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {takenStatus.total - takenStatus.taken}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Remaining</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {upcomingMedications.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Upcoming</div>
          </div>
        </div>
      </div>

      {/* Upcoming Medications */}
      {upcomingMedications.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-600" />
              Upcoming Medications
            </h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {upcomingMedications.map((entry) => (
                <div key={entry._id} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getMedicationTypeColor(entry.medication.type)}`}>
                      <span className="text-lg">{getMedicationIcon(entry.medication.type)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {entry.medication.name} • {entry.medication.dosage}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {entry.medication.frequency}
                        {entry.medication.time && ` • ${new Date(entry.medication.time).toLocaleTimeString()}`}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleTaken(entry._id, entry.medication.taken)}
                    className="p-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Medications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Medications
          </h3>
        </div>
        
        <div className="p-6">
          {medicationEntries.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No medications recorded yet
            </p>
          ) : (
            <div className="space-y-4">
              {medicationEntries.map((entry) => (
                <div key={entry._id} className={`flex items-center justify-between p-4 rounded-lg ${
                  entry.medication.taken 
                    ? 'bg-green-50 dark:bg-green-900/20' 
                    : 'bg-gray-50 dark:bg-gray-700'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getMedicationTypeColor(entry.medication.type)}`}>
                      <span className="text-lg">{getMedicationIcon(entry.medication.type)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {entry.medication.name} • {entry.medication.dosage}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {entry.medication.frequency}
                        {entry.medication.time && ` • ${new Date(entry.medication.time).toLocaleTimeString()}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {entry.medication.taken ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    )}
                    <button
                      onClick={() => toggleTaken(entry._id, entry.medication.taken)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        entry.medication.taken
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                          : 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200'
                      }`}
                    >
                      {entry.medication.taken ? 'Taken' : 'Mark Taken'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationReminders; 