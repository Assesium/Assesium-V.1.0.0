import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaMinusCircle, 
  FaSearchPlus, 
  FaSearchMinus, 
  FaRedo, 
  FaDownload, 
  FaEye, 
  FaSync, 
  FaPaperPlane, 
  FaCommentAlt,
  FaRobot,
  FaFileAlt,
  FaList,
  FaComment,
  FaGripVertical,
  FaChartLine,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaGraduationCap,
  FaBookOpen,
  FaLightbulb,
  FaExclamationTriangle,
  FaInfoCircle,
  FaPalette,
  FaChevronDown,
  FaFileExport,
  FaHome,
  FaBars,
  FaTimes,
  FaExpand,
  FaCompress,
  FaPrint,
  FaSave,
  FaShare
} from 'react-icons/fa';
import '../App.css'; // This path will need to be adjusted or the CSS integrated

// Mock data for questions with enhanced marks information
const questionsData = [
  { id: 1, status: 'correct', score: '+2', maxScore: 5, progress: 100 },
  { id: 2, status: 'incorrect', score: '-3', maxScore: 10, progress: 0 },
  { id: 3, status: 'partial', score: '+1', maxScore: 5, progress: 65 },
  { id: 4, status: 'correct', score: '+2', maxScore: 3, progress: 100 },
  { id: 5, status: 'incorrect', score: '-2', maxScore: 5, progress: 0 },
  { id: 6, status: 'correct', score: '+6', maxScore: 8, progress: 100},
  { id: 7, status: 'partial', score: '+1', maxScore: 2, progress: 65 },
  { id: 8, status: 'correct', score: '+2', maxScore: 10, progress: 100 },
  { id: 9, status: 'incorrect', score: '+6', maxScore: 7, progress: 0 },
  { id: 10, status: 'correct', score: '+2', maxScore: 5, progress: 100 }
];

// Mock feedback data
const feedbackData = [
  {
    question: 'Question 2',
    status: 'incorrect',
    icon: <FaTimesCircle />,
    reason: 'Definition lacks precision. The answer does not clearly explain the process of osmosis and its relationship to water potential.',
    recommendation: 'Clarify key terms like "diffusion", "membrane permeability", and "water potential" in your explanation. Include the role of solute concentration.',
    severity: 'high'
  },
  {
    question: 'Question 3',
    status: 'partial',
    icon: <FaMinusCircle />,
    reason: 'Partially correct but missing key components of the cellular respiration process. Only two stages mentioned.',
    recommendation: 'Include all three stages: glycolysis, Krebs cycle, and electron transport chain. Explain where each occurs in the cell.',
    severity: 'medium'
  },
  {
    question: 'Question 5',
    status: 'incorrect',
    icon: <FaTimesCircle />,
    reason: 'Incorrect identification of the organelle. The structure shown is a mitochondrion, not a chloroplast.',
    recommendation: 'Review the differences between mitochondria and chloroplasts in terms of structure, function, and location within cells.',
    severity: 'high'
  },
  {
    question: 'Question 7',
    status: 'partial',
    icon: <FaMinusCircle />,
    reason: 'Enzyme explanation is incomplete. Missing information about specificity and factors affecting enzyme activity.',
    recommendation: 'Include details about enzyme-substrate specificity, active sites, and factors like temperature and pH that affect enzyme function.',
    severity: 'medium'
  }
];

export default function RealtimeMarking() {
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isProcessing, setIsProcessing] = useState(true);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [markingStatus, setMarkingStatus] = useState('analyzing');
  const [colorScheme, setColorScheme] = useState('default');
  const [isMobile, setIsMobile] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [paperRotation, setPaperRotation] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const containerRef = useRef(null);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setIsProcessing(false);
          setMarkingStatus('completed');
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !leftPanelCollapsed && !rightPanelCollapsed) {
        setRightPanelCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [leftPanelCollapsed, rightPanelCollapsed]);

  const scrollToQuestion = (questionId) => {
    setSelectedQuestion(questionId);
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const rotatePaper = () => {
    setPaperRotation(prev => (prev + 90) % 360);
  };

  const downloadPaper = () => {
    const link = document.createElement('a');
    link.href = '/biology-exam.png';
    link.download = 'biology-exam-marked.png';
    link.click();
  };

  const printPaper = () => {
    window.print();
  };

  const savePaper = () => {
    alert('Paper saved successfully!');
  };

  const sharePaper = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Biology Exam Results',
        text: `Exam results for Sarah Johnson - Score: ${totalScore}/${maxScore}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const uploadExam = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Exam uploaded: ${file.name}`);
      }
    };
    input.click();
  };

  const uploadMarkingScheme = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Marking scheme uploaded: ${file.name}`);
      }
    };
    input.click();
  };

  const viewHandwrittenAnswers = () => {
    alert('Opening handwritten answers viewer...');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const exportResults = () => {
    const exportData = {
      examInfo: {
        title: "Biology Exam • Grade 10",
        student: "Sarah Johnson",
        date: "Dec 15, 2024",
        duration: "2 Hours"
      },
      totalScore: totalScore,
      maxScore: maxScore,
      percentage: Math.round((totalScore / maxScore) * 100),
      questions: questionsData,
      feedback: feedbackData
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exam-results.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const colorSchemes = {
    default: {
      correct: { bg: '#10b981', text: '#ffffff' },
      incorrect: { bg: '#ef4444', text: '#ffffff' },
      partial: { bg: '#f59e0b', text: '#ffffff' }
    },
    pastel: {
      correct: { bg: '#86efac', text: '#065f46' },
      incorrect: { bg: '#fca5a5', text: '#7f1d1d' },
      partial: { bg: '#fde68a', text: '#92400e' }
    },
    vibrant: {
      correct: { bg: '#22c55e', text: '#ffffff' },
      incorrect: { bg: '#dc2626', text: '#ffffff' },
      partial: { bg: '#eab308', text: '#ffffff' }
    },
    monochrome: {
      correct: { bg: '#374151', text: '#ffffff' },
      incorrect: { bg: '#6b7280', text: '#ffffff' },
      partial: { bg: '#9ca3af', text: '#ffffff' }
    },
    ocean: {
      correct: { bg: '#0891b2', text: '#ffffff' },
      incorrect: { bg: '#be185d', text: '#ffffff' },
      partial: { bg: '#c2410c', text: '#ffffff' }
    }
  };

  const getQuestionColors = (status) => {
    return colorSchemes[colorScheme][status] || colorSchemes.default[status];
  };

  const toggleLeftPanel = () => {
    if (isMobile) {
      setLeftPanelCollapsed(!leftPanelCollapsed);
      if (!leftPanelCollapsed) {
        setRightPanelCollapsed(true);
      }
    }
  };

  const toggleRightPanel = () => {
    if (isMobile) {
      setRightPanelCollapsed(!rightPanelCollapsed);
      if (!rightPanelCollapsed) {
        setLeftPanelCollapsed(true);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'correct':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'incorrect':
        return <FaTimesCircle className="w-4 h-4" />;
      case 'partial':
        return <FaMinusCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'medium':
        return <FaInfoCircle className="text-orange-500" />;
      case 'low':
        return <FaLightbulb className="text-blue-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const totalScore = questionsData.reduce((sum, q) => {
    const score = parseInt(q.score.replace('+', '').replace('-', ''));
    return sum + (q.score.startsWith('+') ? score : 0);
  }, 0);

  const maxScore = questionsData.reduce((sum, q) => sum + q.maxScore, 0);
  const correctAnswers = questionsData.filter(q => q.status === 'correct').length;
  const incorrectAnswers = questionsData.filter(q => q.status === 'incorrect').length;
  const partialAnswers = questionsData.filter(q => q.status === 'partial').length;

  const getMarksDisplay = (question) => {
    const earnedScore = question.score.startsWith('+') ? parseInt(question.score.replace('+', '')) : 0;
    return `${earnedScore}/${question.maxScore}`;
  };

  return (
    <div className="min-h-screen transition-all duration-300 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="dashboard-container">
        <header className="header">
          <div className="brand">
            <div className="brand-icon">
              <FaHome className="w-6 h-6" />
            </div>
          </div>
          
          {!isMobile && (
            <div className="header-center">
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="Search questions, answers, or feedback..." 
                  className="search-input"
                />
              </div>
            </div>
          )}

          <div className="header-actions">
            {isMobile ? (
              <>
                <div className="score-display mobile-score">
                  <div className="score-value">{totalScore}/{maxScore}</div>
                  <div className="score-percentage">{Math.round((totalScore / maxScore) * 100)}%</div>
                </div>
                <button className="mobile-menu-button" onClick={toggleMobileMenu}>
                  {showMobileMenu ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <>
                <button className="action-button upload-button" onClick={uploadExam}>
                  <FaFileAlt className="w-4 h-4" />
                  Exam
                </button>
                <button className="action-button upload-button" onClick={uploadMarkingScheme}>
                  <FaFileAlt className="w-4 h-4" />
                  Marking Scheme
                </button>
                <button className="action-button remark-button">
                  <FaRedo className="w-4 h-4" />
                  Remark
                </button>
                <button className="action-button publish-button">
                  <FaPaperPlane className="w-4 h-4" />
                  Publish Results
                </button>
                <div className="score-display">
                  <div className="score-value">{totalScore}/{maxScore}</div>
                  <div className="score-percentage">{Math.round((totalScore / maxScore) * 100)}%</div>
                </div>
              </>
            )}
          </div>
        </header>

        {isMobile && showMobileMenu && (
          <div className="mobile-menu">
            <div className="mobile-search">
              <input 
                type="text" 
                placeholder="Search questions, answers, or feedback..." 
                className="mobile-search-input"
              />
            </div>
            <div className="mobile-menu-actions">
              <button className="mobile-action-button" onClick={() => { uploadExam(); setShowMobileMenu(false); }}>
                <FaFileAlt className="w-4 h-4" />
                Upload Exam
              </button>
              <button className="mobile-action-button" onClick={() => { uploadMarkingScheme(); setShowMobileMenu(false); }}>
                <FaFileAlt className="w-4 h-4" />
                Upload Marking Scheme
              </button>
              <button className="mobile-action-button" onClick={() => setShowMobileMenu(false)}>
                <FaRedo className="w-4 h-4" />
                Remark
              </button>
              <button className="mobile-action-button" onClick={() => setShowMobileMenu(false)}>
                <FaPaperPlane className="w-4 h-4" />
                Publish Results
              </button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="processing-banner">
            <div className="processing-content">
              <div className="processing-icon">
                <FaRobot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="processing-text">
                <span className="processing-title">AI Analysis in Progress</span>
                <span className="processing-subtitle">Analyzing handwritten responses and providing feedback...</span>
              </div>
              <div className="processing-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{processingProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {showStats && (
          <div className="stats-panel">
            <div className="stats-grid">
              <div className="stat-card correct">
                <FaCheckCircle className="stat-icon" />
                <span className="stat-value">{correctAnswers}</span>
                <span className="stat-label">Correct</span>
              </div>
              <div className="stat-card incorrect">
                <FaTimesCircle className="stat-icon" />
                <span className="stat-value">{incorrectAnswers}</span>
                <span className="stat-label">Incorrect</span>
              </div>
              <div className="stat-card partial">
                <FaMinusCircle className="stat-icon" />
                <span className="stat-value">{partialAnswers}</span>
                <span className="stat-label">Partial</span>
              </div>
              <div className="stat-card total">
                <FaList className="stat-icon" />
                <span className="stat-value">{questionsData.length}</span>
                <span className="stat-label">Total Questions</span>
              </div>
            </div>
          </div>
        )}

        <div className="main-content" ref={containerRef}>
          <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
            {!leftPanelCollapsed && (
              <Panel defaultSize={20} minSize={15} maxSize={30} className="panel left-panel">
                <div className="panel-header">
                  <h3 className="panel-title"><FaList className="icon" /> Questions Overview</h3>
                  <span className="panel-info">{questionsData.length} Questions • {totalScore}/{maxScore} Points</span>
                  {!isMobile && (
                    <button onClick={() => setLeftPanelCollapsed(true)} className="collapse-button">
                      <FaCompress />
                    </button>
                  )}
                </div>
                <div className="question-list">
                  {questionsData.map((q) => (
                    <div 
                      key={q.id} 
                      className={`question-item ${selectedQuestion === q.id ? 'selected' : ''}`}
                      onClick={() => scrollToQuestion(q.id)}
                    >
                      <div className="question-header">
                        <span className="question-number">Q{q.id}</span>
                        <span className="question-score" style={{ color: getQuestionColors(q.status).bg }}>
                          {getMarksDisplay(q)}
                        </span>
                      </div>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar-fill"
                          style={{
                            width: `${q.progress}%`,
                            backgroundColor: getQuestionColors(q.status).bg
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="performance-summary">
                  <h4 className="summary-title"><FaChartLine className="icon" /> Performance</h4>
                  <div className="summary-item">
                    <span>T.Score</span>
                    <span>{totalScore}/{maxScore}</span>
                  </div>
                  <div className="summary-item">
                    <span>%</span>
                    <span>{Math.round((totalScore / maxScore) * 100)}%</span>
                  </div>
                  <div className="summary-item">
                    <span>Grade</span>
                    <span className="grade">A</span>
                  </div>
                  <button className="export-button" onClick={exportResults}>
                    <FaFileExport className="icon" /> Export Results
                  </button>
                </div>
              </Panel>
            )}

            {!leftPanelCollapsed && !rightPanelCollapsed && (
              <PanelResizeHandle className="resize-handle" />
            )}

            <Panel defaultSize={isMobile ? 100 : 60} minSize={30} className="panel center-panel">
              <div className="panel-header">
                <h3 className="panel-title"><FaFileAlt className="icon" /> Exam Paper</h3>
                <div className="panel-actions">
                  <button onClick={handleZoomOut} className="action-button" title="Zoom Out"><FaSearchMinus /></button>
                  <span className="zoom-level">{zoomLevel}%</span>
                  <button onClick={handleZoomIn} className="action-button" title="Zoom In"><FaSearchPlus /></button>
                  <button onClick={resetZoom} className="action-button" title="Reset Zoom"><FaSync /></button>
                  <button onClick={rotatePaper} className="action-button" title="Rotate"><FaRedo /></button>
                  <button onClick={toggleFullscreen} className="action-button" title="Fullscreen">
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                  <button onClick={downloadPaper} className="action-button" title="Download"><FaDownload /></button>
                  <button onClick={printPaper} className="action-button" title="Print"><FaPrint /></button>
                  <button onClick={savePaper} className="action-button" title="Save"><FaSave /></button>
                  <button onClick={sharePaper} className="action-button" title="Share"><FaShare /></button>
                  {isMobile && (
                    <button onClick={toggleLeftPanel} className="collapse-button">
                      <FaExpand />
                    </button>
                  )}
                </div>
              </div>
              <div className="exam-paper-content" style={{ transform: `scale(${zoomLevel / 100}) rotate(${paperRotation}deg)` }}>
                <div className="exam-info">
                  <div className="info-item"><FaUser className="info-icon" /> Student: Sarah Johnson</div>
                  <div className="info-item"><FaCalendarAlt className="info-icon" /> Date: December 15, 2024</div>
                  <div className="info-item"><FaClock className="info-icon" /> Duration: 2 Hours</div>
                  <div className="info-item"><FaGraduationCap className="info-icon" /> Subject: Biology</div>
                </div>
                <div className="exam-questions">
                  {questionsData.map((q) => (
                    <div key={q.id} id={`question-${q.id}`} className="question-section">
                      <div className="question-header">
                        <h4 className="question-title">Question {q.id}</h4>
                        <span className="question-marks">
                          {getStatusIcon(q.status)} {getMarksDisplay(q)} marks
                        </span>
                      </div>
                      <p className="question-text">Explain the process of photosynthesis and its importance in the ecosystem. Include the chemical equation and describe the light-dependent and light-independent reactions.</p>
                      <div className="answer-area">
                        {/* Placeholder for student's handwritten answer */}
                        <div className="handwritten-answer-placeholder">
                          <FaBookOpen className="placeholder-icon" />
                          <span>Student's Handwritten Answer</span>
                          <button onClick={viewHandwrittenAnswers} className="view-answer-button">
                            <FaEye /> View Answer
                          </button>
                        </div>
                      </div>
                      <div className="marking-area">
                        <label className="marking-label">Awarded Marks:</label>
                        <input 
                          type="number" 
                          min="0" 
                          max={q.maxScore} 
                          defaultValue={parseInt(q.score.replace('+', ''))} 
                          className="marks-input"
                        />
                        <button className="save-marks-button"><FaSave /> Save</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            {!rightPanelCollapsed && (
              <PanelResizeHandle className="resize-handle" />
            )}

            {!rightPanelCollapsed && (
              <Panel defaultSize={20} minSize={15} maxSize={30} className="panel right-panel">
                <div className="panel-header">
                  <h3 className="panel-title"><FaCommentAlt className="icon" /> AI Feedback & Recommendations</h3>
                  {!isMobile && (
                    <button onClick={() => setRightPanelCollapsed(true)} className="collapse-button">
                      <FaCompress />
                    </button>
                  )}
                </div>
                <div className="feedback-list">
                  <p className="feedback-intro">Intelligent analysis and improvement suggestions</p>
                  {feedbackData.map((feedback, index) => (
                    <div key={index} className="feedback-item">
                      <div className="feedback-header">
                        <span className="feedback-question">{feedback.question}</span>
                        <span className="feedback-status" style={{ color: getQuestionColors(feedback.status).bg }}>
                          {feedback.status.replace(/\b\w/g, char => char.toUpperCase())}
                        </span>
                        {getSeverityIcon(feedback.severity)}
                      </div>
                      <div className="feedback-content">
                        <p className="issue-text"><strong>Issue Identified:</strong> {feedback.reason}</p>
                        <p className="recommendation-text"><strong>Recommendation:</strong> {feedback.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="feedback-actions">
                  <button className="action-button generate-report" onClick={exportResults}>
                    <FaFileExport className="icon" /> Generate Report
                  </button>
                  <button className="action-button send-feedback">
                    <FaPaperPlane className="icon" /> Send Feedback
                  </button>
                </div>
              </Panel>
            )}
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}

