import './styles/App.css';
import './styles/Sidebar.css';
import './styles/ReviewBar.css'
import './styles/DiaryBar.css'
import './styles/HomeScreen.css'
import './styles/ReadLogItemBar.css'
import Sidebar from './components/Sidebar';
import ReviewBar from './components/ReviewBar';
import DiaryBar from './components/DiaryBar';
import ReadLogItemBar from './components/ReadLogItemBar';
import HomeScreen from './components/Homescreen';
import React, { useEffect, useState } from 'react';

function App() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedLogEntry, setSelectedLogEntry] = useState(null);
  const [logEntries, setLogEntries] = useState([]);
  const [showBars, setShowBars] = useState(false); // Controls whether to show the ReviewBar and DiaryBar

  // Fetch the log entries from the localstorage
  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('logEntries')) || [];
    setLogEntries(storedLogs);
  }, []);

  // Save the log entries to localstorage
  useEffect(() => {
    localStorage.setItem('logEntries', JSON.stringify(logEntries));
  }, [logEntries]);

  // Selects a media from the reviewbar. This media is then utilized throughout the app until changed.
  const handleMediaSelect = (media) => {
    setSelectedMedia(media);
  }

  const handleAddLog = () => {
    setSelectedLogEntry(null); 
    setShowBars(true);
  }

  const handleRemoveMedia = () => {
    setSelectedMedia(null);
  }

  const saveLogEntry = (text, date) => {
    if (text && date) {
      const newLogEntry = { text, date, media: selectedMedia };
      setLogEntries((prevEntries) => [...prevEntries, newLogEntry]);
      setSelectedMedia(null);
    }
  }

  const handleLogItemClick = (logEntry) => {
    setSelectedLogEntry(logEntry);
    setShowBars(false);
  }

  return ( 
    // The app container holds all of the bars the constitutes the website. The bars are shown depending on conditional values.
    <div className='app-container'>
        <Sidebar 
            logEntries={logEntries} 
            handleAddLog={handleAddLog} 
            handleLogItemClick={handleLogItemClick} 
            showHomeScreen={() => {
                setSelectedLogEntry(null); // Clear selected log entry
                setShowBars(false); // Hide bars to show home screen
            }} 
        />
        <div className='review-diary-container'>
            {selectedLogEntry ? (
                <ReadLogItemBar logEntry={selectedLogEntry} />
            ) : showBars ? (
                <>
                    <ReviewBar handleMediaSelect={handleMediaSelect} />
                    <DiaryBar selectedMedia={selectedMedia} saveLogEntry={saveLogEntry} removeSelectedMedia={handleRemoveMedia} />
                </>
            ) : (
                <HomeScreen />
            )}  
        </div>
    </div>
);
}

export default App;
