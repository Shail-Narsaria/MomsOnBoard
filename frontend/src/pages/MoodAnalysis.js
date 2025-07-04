import React, { useState, useEffect } from 'react';
import './MoodAnalysis.css';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Button,
  Collapse
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  SentimentSatisfiedAlt,
  SentimentNeutral,
  SentimentVeryDissatisfied,
  SelfImprovement,
  Spa,
  MusicNote,
  Nature,
  Favorite,
  TrendingUp,
  TrendingDown,
  BugReport
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';

const MoodAnalysis = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector(state => state.auth);
  const [moodData, setMoodData] = useState([]);
  const [weeklyAverage, setWeeklyAverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  // Enhanced sentiment analysis function with more comprehensive word lists and context
  const analyzeSentiment = (text) => {
    if (!text) return { score: 1, mood: 'neutral' };

    const positiveWords = [
      // High intensity positive
      'ecstatic', 'thrilled', 'elated', 'overjoyed', 'delighted', 'euphoric', 'blissful',
      'wonderful', 'amazing', 'fantastic', 'excellent', 'perfect', 'brilliant', 'outstanding',
      
      // Medium intensity positive
      'happy', 'joy', 'excited', 'great', 'good', 'love', 'blessed', 'grateful', 'thankful',
      'peaceful', 'calm', 'relaxed', 'energetic', 'motivated', 'inspired', 'hopeful',
      'optimistic', 'content', 'satisfied', 'fulfilled', 'proud', 'confident', 'strong',
      
      // Pregnancy-specific positive
      'baby', 'kicks', 'movement', 'healthy', 'growing', 'progress', 'milestone', 'appointment',
      'ultrasound', 'heartbeat', 'nursery', 'preparation', 'support', 'family', 'partner',
      
      // General positive
      'nice', 'beautiful', 'lovely', 'sweet', 'kind', 'gentle', 'warm', 'comfortable',
      'safe', 'secure', 'stable', 'balanced', 'harmonious', 'serene', 'tranquil'
    ];

    const negativeWords = [
      // High intensity negative
      'devastated', 'heartbroken', 'miserable', 'terrified', 'horrified', 'desperate',
      'hopeless', 'worthless', 'suicidal', 'panic', 'hysterical', 'furious', 'enraged',
      
      // Medium intensity negative
      'sad', 'depressed', 'anxious', 'worried', 'stressed', 'angry', 'frustrated',
      'tired', 'exhausted', 'lonely', 'scared', 'fearful', 'overwhelmed',
      'disappointed', 'hurt', 'pain', 'sick', 'nauseous', 'uncomfortable',
      
      // Pregnancy-specific negative
      'morning sickness', 'nausea', 'vomiting', 'back pain', 'cramps', 'swelling',
      'fatigue', 'insomnia', 'heartburn', 'constipation', 'braxton hicks',
      'preterm', 'complications', 'risk', 'concern', 'anxiety', 'fear',
      
      // General negative
      'bad', 'terrible', 'awful', 'horrible', 'dreadful', 'miserable', 'unhappy',
      'upset', 'annoyed', 'irritated', 'bothered', 'disturbed', 'troubled',
      'difficult', 'hard', 'challenging', 'struggling', 'suffering'
    ];

    // Enhanced scoring with word frequency and context
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    let totalWords = words.length;

    words.forEach(word => {
      // Check for exact matches
      if (positiveWords.includes(word)) {
        positiveScore += 1;
      }
      if (negativeWords.includes(word)) {
        negativeScore += 1;
      }
      
      // Check for partial matches (for compound words)
      positiveWords.forEach(posWord => {
        if (word.includes(posWord) && word !== posWord) {
          positiveScore += 0.5;
        }
      });
      
      negativeWords.forEach(negWord => {
        if (word.includes(negWord) && word !== negWord) {
          negativeScore += 0.5;
        }
      });
    });

    // Calculate sentiment ratio
    const sentimentRatio = (positiveScore - negativeScore) / Math.max(totalWords, 1);
    
    // More sensitive scoring system
    if (sentimentRatio > 0.15) return { score: 3, mood: 'happy' };
    if (sentimentRatio > 0.05) return { score: 2, mood: 'content' };
    if (sentimentRatio > -0.05) return { score: 1, mood: 'neutral' };
    if (sentimentRatio > -0.15) return { score: 0, mood: 'sad' };
    return { score: -1, mood: 'very_sad' };
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'happy':
        return <SentimentSatisfiedAlt sx={{ color: '#4CAF50', fontSize: 40 }} />;
      case 'content':
        return <SentimentSatisfiedAlt sx={{ color: '#8BC34A', fontSize: 40 }} />;
      case 'neutral':
        return <SentimentNeutral sx={{ color: '#FFC107', fontSize: 40 }} />;
      case 'sad':
        return <SentimentVeryDissatisfied sx={{ color: '#FF9800', fontSize: 40 }} />;
      case 'very_sad':
        return <SentimentVeryDissatisfied sx={{ color: '#F44336', fontSize: 40 }} />;
      default:
        return <SentimentNeutral sx={{ color: '#FFC107', fontSize: 40 }} />;
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'happy': return '#4CAF50';
      case 'content': return '#8BC34A';
      case 'neutral': return '#FFC107';
      case 'sad': return '#FF9800';
      case 'very_sad': return '#F44336';
      default: return '#FFC107';
    }
  };

  const getMoodLabel = (mood) => {
    switch (mood) {
      case 'happy': return 'Happy';
      case 'content': return 'Content';
      case 'neutral': return 'Neutral';
      case 'sad': return 'Sad';
      case 'very_sad': return 'Very Sad';
      default: return 'Neutral';
    }
  };

  const getWeeklySuggestions = (averageMood) => {
    if (averageMood === 'sad' || averageMood === 'very_sad') {
      return [
        {
          title: 'Gentle Yoga',
          description: 'Try 10-15 minutes of gentle yoga poses to release tension and improve mood',
          icon: <SelfImprovement />
        },
        {
          title: 'Deep Breathing',
          description: 'Practice deep breathing exercises for 5-10 minutes daily',
          icon: <Spa />
        },
        {
          title: 'Listen to Music',
          description: 'Create a playlist of your favorite uplifting songs',
          icon: <MusicNote />
        },
        {
          title: 'Nature Walk',
          description: 'Take a short walk outside to connect with nature',
          icon: <Nature />
        },
        {
          title: 'Self-Care Activities',
          description: 'Treat yourself to something you enjoy - a warm bath, reading, or meditation',
          icon: <Favorite />
        }
      ];
    }
    return [];
  };

  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/journal');
        let entries = response.data;

        // If no entries, add some sample data for testing
        if (entries.length === 0) {
          entries = [
            {
              _id: 'sample1',
              content: 'Today I felt so happy and excited! The baby kicked for the first time and it was amazing. I feel so blessed and grateful for this beautiful journey.',
              createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              _id: 'sample2',
              content: 'Feeling a bit tired and nauseous today. Morning sickness is really challenging but I know it will pass. Trying to stay positive.',
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              _id: 'sample3',
              content: 'Had a wonderful appointment today! The doctor said everything looks perfect and healthy. I feel so relieved and content.',
              createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              _id: 'sample4',
              content: 'Feeling anxious and worried about the upcoming ultrasound. What if something is wrong? I can\'t stop thinking about it.',
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              _id: 'sample5',
              content: 'Today was absolutely fantastic! The baby is growing so well and I feel so strong and confident. This pregnancy is a blessing.',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              _id: 'sample6',
              content: 'Feeling sad and lonely today. Missing my family and feeling overwhelmed with all the preparations. Everything seems so difficult.',
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];
        }

        // Analyze sentiment for each entry
        const analyzedEntries = entries.map(entry => {
          const sentiment = analyzeSentiment(entry.content);
          return {
            ...entry,
            sentiment,
            date: new Date(entry.createdAt).toLocaleDateString(),
            timestamp: new Date(entry.createdAt).getTime()
          };
        });

        // Sort by date
        analyzedEntries.sort((a, b) => a.timestamp - b.timestamp);

        // Group by week and calculate weekly averages
        const weeklyData = {};
        analyzedEntries.forEach(entry => {
          const weekStart = new Date(entry.timestamp);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekKey = weekStart.toISOString().split('T')[0];
          
          if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = { scores: [], entries: [] };
          }
          weeklyData[weekKey].scores.push(entry.sentiment.score);
          weeklyData[weekKey].entries.push(entry);
        });

        // Calculate weekly averages
        const weeklyAverages = Object.keys(weeklyData).map(weekKey => {
          const scores = weeklyData[weekKey].scores;
          const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
          let averageMood = 'neutral';
          
          if (averageScore > 1.5) averageMood = 'happy';
          else if (averageScore > 0.5) averageMood = 'content';
          else if (averageScore > -0.5) averageMood = 'neutral';
          else if (averageScore > -1.5) averageMood = 'sad';
          else averageMood = 'very_sad';

          return {
            week: weekKey,
            averageScore,
            averageMood,
            entries: weeklyData[weekKey].entries
          };
        });

        setMoodData(analyzedEntries);
        
        // Get current week's average
        const currentWeek = weeklyAverages[weeklyAverages.length - 1];
        setWeeklyAverage(currentWeek);

        setLoading(false);
      } catch (err) {
        setError('Failed to load journal entries');
        setLoading(false);
      }
    };

    fetchJournalEntries();
  }, []);

  const chartData = moodData.map(entry => ({
    date: entry.date,
    mood: entry.sentiment.score,
    moodLabel: getMoodLabel(entry.sentiment.mood)
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Mood Analysis
        </Typography>
        <Button
          startIcon={<BugReport />}
          onClick={() => setShowDebug(!showDebug)}
          variant="outlined"
          size="small"
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </Button>
      </Box>

      {/* Debug Section */}
      <Collapse in={showDebug}>
        <Card sx={{ mb: 3, bgcolor: 'grey.100' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Debug Information
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Total entries analyzed: {moodData.length}
            </Typography>
            {moodData.length > 0 && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Sample analysis for first entry:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'white' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Content:</strong> {moodData[0]?.content?.substring(0, 100)}...
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Sentiment Score:</strong> {moodData[0]?.sentiment?.score}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Mood:</strong> {getMoodLabel(moodData[0]?.sentiment?.mood)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {moodData[0]?.date}
                  </Typography>
                </Paper>
              </Box>
            )}
          </CardContent>
        </Card>
      </Collapse>

      {moodData.length === 0 ? (
        <Alert severity="info">
          No journal entries found. Start writing in your journal to see mood analysis.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Weekly Average Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  This Week's Mood
                </Typography>
                {weeklyAverage && (
                  <Box sx={{ textAlign: 'center' }}>
                    {getMoodIcon(weeklyAverage.averageMood)}
                    <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
                      {getMoodLabel(weeklyAverage.averageMood)}
                    </Typography>
                    <Chip 
                      label={`${weeklyAverage.entries.length} entries`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Mood Trend */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Daily Mood Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[-1, 3]} ticks={[-1, 0, 1, 2, 3]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        getMoodLabel(chartData[value]?.moodLabel || 'neutral'),
                        'Mood'
                      ]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke={theme.palette.primary.main}
                      strokeWidth={3}
                      dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Mood Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Mood Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[-1, 3]} ticks={[-1, 0, 1, 2, 3]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        getMoodLabel(chartData[value]?.moodLabel || 'neutral'),
                        'Mood'
                      ]}
                    />
                    <Bar 
                      dataKey="mood" 
                      fill={theme.palette.primary.main}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Suggestions */}
          {weeklyAverage && (weeklyAverage.averageMood === 'sad' || weeklyAverage.averageMood === 'very_sad') && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp sx={{ color: 'success.main' }} />
                    Mood Improvement Suggestions
                  </Typography>
                  <List>
                    {getWeeklySuggestions(weeklyAverage.averageMood).map((suggestion, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ color: 'primary.main' }}>
                          {suggestion.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={suggestion.title}
                          secondary={suggestion.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Recent Entries with Mood */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Entries with Mood Analysis
                </Typography>
                <Grid container spacing={2}>
                  {moodData.slice(-6).reverse().map((entry, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper sx={{ p: 2, borderLeft: `4px solid ${getMoodColor(entry.sentiment.mood)}` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {getMoodIcon(entry.sentiment.mood)}
                          <Typography variant="subtitle2" sx={{ ml: 1 }}>
                            {getMoodLabel(entry.sentiment.mood)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {entry.date}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {entry.content}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MoodAnalysis; 