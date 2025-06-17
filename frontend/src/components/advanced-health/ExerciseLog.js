import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAdvancedHealthEntry, fetchAdvancedHealthEntries } from '../../redux/slices/advancedHealthSlice';
import { Activity, Clock, Flame, Target } from 'lucide-react';

const ExerciseLog = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const { entries } = useSelector(state => state.advancedHealth);
  const [exerciseType, setExerciseType] = useState('walking');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState('moderate');
  const [calories, setCalories] = useState(0);
  const [notes, setNotes] = useState('');

  const exerciseEntries = entries.filter(entry => entry.type === 'exercise');

  const exerciseTypes = [
    { id: 'walking', label: 'Walking', icon: '🚶‍♀️', color: 'bg-blue-100 text-blue-600' },
    { id: 'yoga', label: 'Prenatal Yoga', icon: '🧘‍♀️', color: 'bg-green-100 text-green-600' },
    { id: 'swimming', label: 'Swimming', icon: '🏊‍♀️', color: 'bg-cyan-100 text-cyan-600' },
    { id: 'prenatal_fitness', label: 'Prenatal Fitness', icon: '💪', color: 'bg-purple-100 text-purple-600' },
    { id: 'stretching', label: 'Stretching', icon: '🤸‍♀️', color: 'bg-orange-100 text-orange-600' },
    { id: 'other', label: 'Other', icon: '🎯', color: 'bg-gray-100 text-gray-600' }
  ];

  const intensityLevels = [
    { value: 'light', label: 'Light', color: 'bg-green-100 text-green-800', description: 'Easy, comfortable pace' },
    { value: 'moderate', label: 'Moderate', color: 'bg-yellow-100 text-yellow-800', description: 'Some effort, can talk' },
    { value: 'vigorous', label: 'Vigorous', color: 'bg-red-100 text-red-800', description: 'Hard effort, difficult to talk' }
  ];

  const addExerciseEntry = async () => {
    try {
      await dispatch(createAdvancedHealthEntry({
        type: 'exercise',
        date: selectedDate,
        type: exerciseType,
        duration: parseInt(duration),
        intensity,
        calories: parseInt(calories) || 0,
        notes
      })).unwrap();
      
      // Reset form
      setDuration(30);
      setCalories(0);
      setNotes('');
    } catch (error) {
      console.error('Failed to add exercise entry:', error);
    }
  };

  const getExerciseTypeColor = (type) => {
    const exercise = exerciseTypes.find(e => e.id === type);
    return exercise ? exercise.color : 'bg-gray-100 text-gray-600';
  };

  const getExerciseIcon = (type) => {
    const exercise = exerciseTypes.find(e => e.id === type);
    return exercise ? exercise.icon : '🎯';
  };

  const getIntensityColor = (intensity) => {
    const level = intensityLevels.find(i => i.value === intensity);
    return level ? level.color : 'bg-gray-100 text-gray-800';
  };

  const calculateTotalDuration = () => {
    return exerciseEntries.reduce((total, entry) => total + entry.exercise.duration, 0);
  };

  const calculateTotalCalories = () => {
    return exerciseEntries.reduce((total, entry) => total + (entry.exercise.calories || 0), 0);
  };

  const getMostCommonExercise = () => {
    if (exerciseEntries.length === 0) return 'None';
    const exerciseCounts = {};
    exerciseEntries.forEach(entry => {
      exerciseCounts[entry.exercise.type] = (exerciseCounts[entry.exercise.type] || 0) + 1;
    });
    return Object.keys(exerciseCounts).reduce((a, b) => exerciseCounts[a] > exerciseCounts[b] ? a : b);
  };

  return (
    <div className="space-y-6">
      {/* Add Exercise Entry */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-600" />
            Exercise Log
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(selectedDate).toLocaleDateString()}
          </div>
        </div>

        {/* Exercise Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Exercise Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {exerciseTypes.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => setExerciseType(exercise.id)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  exerciseType === exercise.id
                    ? exercise.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <div className="text-lg mb-1">{exercise.icon}</div>
                {exercise.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration (minutes)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                max="300"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              />
              <span className="text-gray-500 dark:text-gray-400">min</span>
            </div>
          </div>

          {/* Calories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Calories Burned (optional)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                min="0"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              />
              <span className="text-gray-500 dark:text-gray-400">cal</span>
            </div>
          </div>
        </div>

        {/* Intensity */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Intensity Level
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {intensityLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => setIntensity(level.value)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  intensity === level.value
                    ? level.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <div className="font-semibold">{level.label}</div>
                <div className="text-xs opacity-75">{level.description}</div>
              </button>
            ))}
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
            placeholder="How did the exercise feel? Any modifications needed?"
          />
        </div>

        <button
          onClick={addExerciseEntry}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Add Exercise Entry
        </button>
      </div>

      {/* Exercise Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Today's Exercise Summary
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {exerciseEntries.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Sessions</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {calculateTotalDuration()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Minutes</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {calculateTotalCalories()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Calories</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {getMostCommonExercise()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Most Common</div>
          </div>
        </div>
      </div>

      {/* Recent Exercise Entries */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Exercise Entries
          </h3>
        </div>
        
        <div className="p-6">
          {exerciseEntries.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No exercise entries recorded yet
            </p>
          ) : (
            <div className="space-y-4">
              {exerciseEntries.slice(0, 5).map((entry) => (
                <div key={entry._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getExerciseTypeColor(entry.exercise.type)}`}>
                      <span className="text-lg">{getExerciseIcon(entry.exercise.type)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {entry.exercise.duration}min • {entry.exercise.intensity}
                        {entry.exercise.calories > 0 && ` • ${entry.exercise.calories}cal`}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {entry.exercise.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {entry.exercise.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseLog; 