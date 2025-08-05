import React, { useState, useEffect } from 'react';
import { PlayCircle, Upload, CheckCircle, Clock, X, Users, User, ArrowLeft, ArrowRight } from 'lucide-react';

// Main application component that handles routing between screens
function App() {
  const [hasStarted, setHasStarted] = useState(false);

  // Conditional rendering to show either the Onboarding or the Dashboard
  if (hasStarted) {
    return <Dashboard />;
  } else {
    return <OnboardingScreen onStart={() => setHasStarted(true)} />;
  }
}

// Reusable modal component for in-app alerts
const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full relative">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Alert</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          OK</button>
      </div>
    </div>
  );
};

// Onboarding/Homepage component with a more engaging design
const OnboardingScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4 font-sans text-white">
      <div className="text-center max-w-xl">
        <div className="mb-6">
          <PlayCircle size={80} className="mx-auto text-white animate-pulse-slow" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          AI Padel Analyst Dashboard
        </h1>
        <p className="mt-4 text-lg md:text-xl font-light opacity-80">
          Upload your Padel performance videos, get detailed analysis, and improve your technique with the power of AI.
        </p>
        <button
          onClick={onStart}
          className="mt-8 px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
        >
          Start Analysis
        </button>
      </div>
    </div>
  );
};

// Main Dashboard component with navigation and content sections
const Dashboard = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [activeSection, setActiveSection] = useState('upload');
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [isPostAnalysisReview, setIsPostAnalysisReview] = useState(false);
  const [currentSelectedPlayer, setCurrentSelectedPlayer] = useState(null);
  const [coachNote, setCoachNote] = useState('');
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState('');
  
  // Mock data for the Team Dashboard
  const teamPlayers = [
    { id: 1, name: 'John Doe', sport: 'Padel' },
    { id: 2, name: 'Jane Smith', sport: 'Padel' },
    { id: 3, name: 'Mike Johnson', sport: 'Padel' },
  ];

  // Mock data for a player's performance details
  const performanceHistory = [
    {
      playerId: 1,
      history: [
        {
          date: '2023-10-20',
          summary: 'Volley Analysis',
          stats: {
            'Serve Consistency': 85,
            'Volley Power': 70,
            'Forehand Technique': 80,
            'Backhand Defense': 60,
            'Footwork Speed': 75,
          },
          goodPoints: [
            'Solid stance at the net, ready for action.',
            'Efficient paddle movements, no big swings.'
          ],
          badPoints: [
            { point: 'Often hitting volleys too high, giving opponents an easy smash.', priority: 'High' },
            { point: 'Footwork is sometimes static, not moving into the ball.', priority: 'Medium' },
            { point: 'Lacks variation in volley shots.', priority: 'Low' }
          ],
          improvedPoints: [
            'Initial positioning has improved since last week.'
          ],
          coachNotes: "John's volley is a major weapon, but we need to focus on keeping the ball low and varying the angle to become more unpredictable."
        },
      ]
    },
    {
      playerId: 2,
      history: [
        {
          date: '2023-10-26',
          summary: 'Backhand Analysis',
          stats: {
            'Serve Consistency': 70,
            'Volley Power': 65,
            'Forehand Technique': 85,
            'Backhand Defense': 55,
            'Footwork Speed': 90,
          },
          goodPoints: [
            'Excellent preparation with a wide stance.',
            'Good follow-through motion after the shot.'
          ],
          badPoints: [
            { point: 'Lacking power due to poor body rotation.', priority: 'High' },
            { point: 'The paddle face is too open on contact, leading to slices.', priority: 'High' },
            { point: 'Recovery to the center is sometimes slow.', priority: 'Low' }
          ],
          improvedPoints: [
            'Body rotation has seen a slight improvement.'
          ],
          coachNotes: "Jane's backhand has potential. We'll work on her body rotation in the next few sessions to generate more power and prevent slicing."
        },
        {
          date: '2023-10-22',
          summary: 'Serve Analysis',
          stats: {
            'Serve Consistency': 80,
            'Volley Power': 75,
            'Forehand Technique': 85,
            'Backhand Defense': 60,
            'Footwork Speed': 88,
          },
          goodPoints: [
            'Strong toss and consistent ball placement.',
          ],
          badPoints: [
            { point: 'Body is not aligned with the net, affecting accuracy.', priority: 'High' },
            { point: 'Toss is often too far forward.', priority: 'Medium' }
          ],
          improvedPoints: [
            'Ball toss is more consistent now.'
          ],
          coachNotes: "Jane has a solid foundation on her serve. Focus on body alignment drills to improve accuracy and make her serve more of a threat."
        },
      ]
    },
    {
      playerId: 3,
      history: [
        {
          date: '2023-10-25',
          summary: 'Serve Analysis',
          stats: {
            'Serve Consistency': 90,
            'Volley Power': 78,
            'Forehand Technique': 90,
            'Backhand Defense': 70,
            'Footwork Speed': 85,
          },
          goodPoints: [
            'Serve consistency is high.',
            'Good rhythm and timing of the swing.'
          ],
          badPoints: [
            { point: 'Lacks variation in serve placement, making it predictable.', priority: 'High' },
            { point: 'Follow-through is sometimes rushed.', priority: 'Medium' }
          ],
          improvedPoints: [
            'Serve toss has become more predictable for the opponent.'
          ],
          coachNotes: "Mike's serve is very reliable. The next step is to add more spin and variation to his serves to keep opponents guessing."
        },
      ]
    },
  ];

  // Function to handle video file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  // Function to handle the analysis process and pop-up
  const startAnalysis = () => {
    setIsLoading(true);
    setVideoFile(null); // Clear video file to show only the analysis message
    setVideoUrl(''); // Clear the video URL as well
    setTimeout(() => {
      setIsLoading(false);
      // Simulasikan hasil analisis AI yang lebih terstruktur
      const mockAiResult = {
          overallSummary: "Based on the simulated video, the athlete shows great potential with a solid offensive game. The primary area for improvement is defense, particularly in transitioning from a defensive position to an offensive one. The backhand technique is strong, but can be more consistent under pressure.",
          strengths: [
            "Powerful forehand drive with excellent top-spin.",
            "Aggressive net play and effective volley placement.",
            "Strong serves with high accuracy."
          ],
          weaknesses: [
            { point: "Inconsistent footwork when moving laterally, affecting defensive reach.", priority: 'High' },
            { point: "Recovery to the center of the court is sometimes slow after a shot.", priority: 'Medium' },
            { point: "Padel face is slightly too open on defensive backhands, leading to shots with less depth.", priority: 'Low' }
          ],
          drills: [
            "Lateral Shuffle Drills: Practice quick side-to-side movements.",
            "Split Step Drills: Focus on a proper split step before every shot.",
            "Deep Lob Practice: Work on hitting deep defensive lobs to reset the point."
          ]
      };
      setAiAnalysisResult(mockAiResult);
      setModalMessage("This is an MVP. Video analysis functionality is not yet implemented. You can now label the player and add your notes based on the AI analysis.");
      // The modal's onClose handler will set isPostAnalysisReview to true
    }, 2000);
  };

  const handleModalClose = () => {
    setModalMessage(null);
    setIsPostAnalysisReview(true);
  };
  
  const handleSaveAnalysis = () => {
      // Simulate saving the analysis
      // For this prototype, we just clear the states and show a confirmation
      setModalMessage("Analysis saved successfully!");
      setCurrentSelectedPlayer(null);
      setCoachNote('');
      setCorrectionNotes('');
      setIsPostAnalysisReview(false);
      setVideoFile(null);
      setVideoUrl('');
      setActiveSection('upload');
  };
  
  // Content for the Post-Analysis Review section
  const PostAnalysisReview = () => (
      <>
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => {
              setIsPostAnalysisReview(false);
              setVideoFile(null);
              setVideoUrl('');
            }}
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 flex-1">
            Review & Label
          </h1>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Player:
            </label>
            <select
              value={currentSelectedPlayer?.id || ''}
              onChange={(e) => setCurrentSelectedPlayer(teamPlayers.find(p => p.id === parseInt(e.target.value)))}
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Choose a player</option>
              {teamPlayers.map(player => (
                <option key={player.id} value={player.id}>{player.name}</option>
              ))}
            </select>
          </div>
          <div className="p-3 bg-gray-100 rounded-md">
            <h3 className="font-semibold text-gray-700 mb-2">AI Analysis Result:</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap font-bold mb-2">Overall Summary:</p>
            <p className="text-sm text-gray-600 mb-4">{aiAnalysisResult.overallSummary}</p>

            <p className="font-semibold text-green-600 flex items-center gap-1">
              <CheckCircle size={16} /> Strengths:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 ml-5 mb-2">
              {aiAnalysisResult.strengths.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>

            <p className="font-semibold text-red-600 flex items-center gap-1">
              <X size={16} /> Areas for Improvement:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 ml-5 mb-2">
              {aiAnalysisResult.weaknesses.map((point, i) => (
                <li key={i}>{point.point} ({point.priority} priority)</li>
              ))}
            </ul>
            
            <p className="font-semibold text-blue-600 flex items-center gap-1">
              <CheckCircle size={16} /> Recommended Drills:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 ml-5">
              {aiAnalysisResult.drills.map((drill, i) => (
                <li key={i}>{drill}</li>
              ))}
            </ul>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Coach's Notes:
            </label>
            <textarea
              value={coachNote}
              onChange={(e) => setCoachNote(e.target.value)}
              placeholder="Add your personal notes here..."
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correction Notes from AI Result:
            </label>
            <textarea
              value={correctionNotes}
              onChange={(e) => setCorrectionNotes(e.target.value)}
              placeholder="E.g., Based on the AI, the forehand needs more wrist action."
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <button
            onClick={handleSaveAnalysis}
            disabled={!currentSelectedPlayer || !correctionNotes}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <CheckCircle size={20} />
            Save Analysis
          </button>
        </div>
      </>
  );

  // Content for the Upload section
  const UploadSection = () => (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Upload Video</h1>
        <p className="text-gray-500 text-sm mt-1">Select a video file to analyze.</p>
        <p className="text-xs text-gray-400 mt-2">
          (Note: This is an MVP. Just click "Start Analysis" to see a mock result and continue.)
        </p>
      </div>
      <div className="mb-6">
        <label
          htmlFor="video-upload"
          className="flex items-center justify-center p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center text-gray-500">
            <Upload size={28} className="mb-2" />
            <span className="font-semibold text-sm">
              {videoFile ? `Video uploaded: ${videoFile.name}` : 'Click to upload video (or skip)'}
            </span>
            <span className="text-xs">(supports MP4, MOV, etc.)</span>
          </div>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>
      {videoUrl && (
        <div className="mb-6">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg shadow-md mb-4"
          />
        </div>
      )}
      <button
        onClick={startAnalysis}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        <PlayCircle size={20} />
        {isLoading ? 'Analyzing...' : 'Start Analysis'}
      </button>

      {/* Loading state message */}
      {isLoading && (
        <div className="p-4 mt-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <Clock size={40} className="mx-auto mb-2 text-blue-500 animate-spin" />
          <p className="text-gray-700 font-medium">Analyzing...</p>
        </div>
      )}
    </>
  );

  // Content for the Team Dashboard section
  const TeamDashboardSection = () => (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Team Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor your team's performance at a glance.</p>
      </div>
      <div className="space-y-4">
        {teamPlayers.map((player) => (
          <div key={player.id} className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{player.name}</h3>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedPlayerId(player.id);
                setActiveSection('performance');
              }}
              className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full flex items-center gap-1 hover:bg-blue-600 transition-colors"
            >
              View Performance
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </>
  );

  // Content for the Player Performance section
  const PerformanceSection = () => {
    const player = teamPlayers.find(p => p.id === selectedPlayerId);
    const playerHistory = performanceHistory.find(h => h.playerId === selectedPlayerId);

    useEffect(() => {
        if (playerHistory && playerHistory.history.length > 0 && !selectedAnalysis) {
            setSelectedAnalysis(playerHistory.history[0]);
        }
    }, [selectedPlayerId, playerHistory, selectedAnalysis]);

    if (!player || !playerHistory) {
      return (
        <div className="text-center text-gray-400 mt-8">
          <p>No performance data available for this player.</p>
          <button
            onClick={() => {
              setSelectedPlayerId(null);
              setActiveSection('team_dashboard');
            }}
            className="mt-4 text-blue-600 hover:underline flex items-center mx-auto gap-1"
          >
            <ArrowLeft size={16} /> Back to Team
          </button>
        </div>
      );
    }
    
    // Padel performance stats for radar chart
    const stats = selectedAnalysis ? selectedAnalysis.stats : {};
    const statLabels = Object.keys(stats);
    const statValues = Object.values(stats);
    const numStats = statLabels.length;
    const angle = 2 * Math.PI / numStats;

    const points = statValues.map((value, i) => {
      const radius = value / 100 * 40; // Scale value to fit chart size
      const x = 50 + radius * Math.cos(i * angle - Math.PI / 2);
      const y = 50 + radius * Math.sin(i * angle - Math.PI / 2);
      return `${x},${y}`;
    }).join(' ');
    
    // Calculate the length of the polygon path for animation
    const pathLength = 100; // A reasonable estimate for a simple polygon

    const statGrid = Array.from({ length: numStats }, (_, i) => {
      const x = 50 + 40 * Math.cos(i * angle - Math.PI / 2);
      const y = 50 + 40 * Math.sin(i * angle - Math.PI / 2);
      return `${x},${y}`;
    }).join(' ');

    const RadarChart = () => (
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <style>
          {`
            @keyframes draw {
              to {
                stroke-dashoffset: 0;
              }
            }
            @keyframes fadeIn {
              to {
                opacity: 1;
              }
            }
            .animate-draw {
              stroke-dasharray: ${pathLength};
              stroke-dashoffset: ${pathLength};
              animation: draw 2s ease-out forwards;
            }
            .animate-fill {
              opacity: 0;
              animation: fadeIn 1s ease-in forwards 2s; /* Starts after draw animation */
            }
          `}
        </style>
        <polygon points={statGrid} stroke="#ccc" fill="none" />
        {statValues.map((_, i) => (
          <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(i * angle - Math.PI / 2)} y2={50 + 40 * Math.sin(i * angle - Math.PI / 2)} stroke="#ccc" />
        ))}
        <polygon points={points} className="animate-draw" stroke="rgb(37, 99, 235)" strokeWidth="1" fill="rgba(59, 130, 246, 0.5)" />
        {statLabels.map((label, i) => {
          const x = 50 + 45 * Math.cos(i * angle - Math.PI / 2);
          const y = 50 + 45 * Math.sin(i * angle - Math.PI / 2);
          const textAnchor = x > 50 ? 'start' : x < 50 ? 'end' : 'middle';
          return (
            <text key={i} x={x} y={y} fontSize="5" textAnchor={textAnchor} fill="#333" className="font-bold animate-fill">
              {label}
            </text>
          );
        })}
      </svg>
    );

    return (
      <>
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => {
              setSelectedPlayerId(null);
              setSelectedAnalysis(null);
              setActiveSection('team_dashboard');
            }}
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 flex-1">
            {player.name}'s Performance
          </h1>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="space-y-6">
            {playerHistory.history.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Analysis:
                </label>
                <select
                  value={selectedAnalysis?.summary || ''}
                  onChange={(e) => {
                    const newAnalysis = playerHistory.history.find(a => a.summary === e.target.value);
                    setSelectedAnalysis(newAnalysis);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                >
                  {playerHistory.history.map((analysis, index) => (
                    <option key={index} value={analysis.summary}>{analysis.summary} - {analysis.date}</option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedAnalysis && (
              <div key={selectedAnalysis.date} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{selectedAnalysis.summary}</h3>
                  <span className="text-xs text-gray-500">{selectedAnalysis.date}</span>
                </div>

                {/* Animated Performance Diagram */}
                <div className="mb-4">
                  <p className="font-semibold text-gray-700 mb-2">Performance Chart:</p>
                  <div className="bg-gray-50 p-4 rounded-lg flex justify-center items-center h-40">
                    <RadarChart />
                  </div>
                </div>

                {/* Display Statistics */}
                <div className="mb-4">
                  <p className="font-semibold text-gray-700 mb-2">Statistics:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(selectedAnalysis.stats).map(([key, value]) => (
                      <div key={key} className="p-2 bg-gray-100 rounded-md">
                        <span className="font-medium text-gray-600">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Good Points */}
                <div className="mb-4">
                  <p className="font-semibold text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> Good Points:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 ml-5">
                    {selectedAnalysis.goodPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>

                {/* Bad Points (Prioritized) */}
                <div className="mb-4">
                  <p className="font-semibold text-red-600 flex items-center gap-1">
                    <X size={16} /> Areas for Improvement:
                  </p>
                  <div className="space-y-2">
                    {['High', 'Medium', 'Low'].map(priority => {
                      const points = selectedAnalysis.badPoints.filter(p => p.priority === priority);
                      if (points.length > 0) {
                        return (
                          <div key={priority}>
                            <p className="font-medium text-red-700 ml-5">
                              {priority === 'High' ? 'Top Priorities:' : `${priority} Priority:`}
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-600 ml-10">
                              {points.map((point, i) => (
                                <li key={i}>{point.point}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                {/* Improved Points */}
                <div>
                  <p className="font-semibold text-blue-600 flex items-center gap-1">
                    <CheckCircle size={16} /> Improved Points:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 ml-5">
                    {selectedAnalysis.improvedPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>

                {/* Coach's Notes */}
                {selectedAnalysis.coachNotes && (
                  <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                    <p className="font-semibold text-yellow-700">Coach's Notes:</p>
                    <p className="text-sm text-gray-700 mt-1">{selectedAnalysis.coachNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // Renders the content based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case 'upload':
        return isPostAnalysisReview ? <PostAnalysisReview /> : <UploadSection />;
      case 'team_dashboard':
        return <TeamDashboardSection />;
      case 'performance':
        return <PerformanceSection />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="relative w-full max-w-sm h-[700px] bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto font-sans">
          {renderContent()}
        </div>

        {/* Navigation Bar at the bottom */}
        <nav className="flex justify-around bg-white border-t border-gray-200 p-2 z-10">
          <button
            onClick={() => {
              setSelectedPlayerId(null);
              setIsPostAnalysisReview(false);
              setActiveSection('upload');
            }}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeSection === 'upload' && !isPostAnalysisReview ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <Upload size={20} />
            <span className="text-xs">Upload</span>
          </button>
          <button
            onClick={() => {
              setSelectedPlayerId(null);
              setIsPostAnalysisReview(false);
              setActiveSection('team_dashboard');
            }}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              (activeSection === 'team_dashboard' || activeSection === 'performance') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <Users size={20} />
            <span className="text-xs">Team</span>
          </button>
        </nav>
      </div>
      {modalMessage && <Modal message={modalMessage} onClose={handleModalClose} />}
    </div>
  );
};

export default App;
