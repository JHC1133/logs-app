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
import React, { useState } from 'react';

function App() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedLogEntry, setSelectedLogEntry] = useState(null);
  const [logEntries, setLogEntries] = useState([]);
  const [showBars, setShowBars] = useState(false);

  const handleMediaSelect = (media) => {
    setSelectedMedia(media);
  }

  const handleAddLog = () => {
    setSelectedLogEntry(null); 
    setShowBars(true);
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

  // return ( 
  //   <div className='app-container'>
  //     <Sidebar logEntries={logEntries} handleAddLog={handleAddLog} handleLogItemClick={handleLogItemClick} showHomeScreen={handleLogTitleClick} />
  //     <div className='review-diary-container'>
  //       {selectedLogEntry ? (
  //         <ReadLogItemBar logEntry={selectedLogEntry} />
  //       ) : showBars ? (
  //         <>
  //           <ReviewBar handleMediaSelect={handleMediaSelect} />
  //           <DiaryBar selectedMedia={selectedMedia} saveLogEntry={saveLogEntry} />
  //         </>
  //       ) : (
  //           <HomeScreen />
  //       )}  
  //     </div>
  //   </div>
  // );

  return ( 
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
                    <DiaryBar selectedMedia={selectedMedia} saveLogEntry={saveLogEntry} />
                </>
            ) : (
                <HomeScreen />
            )}  
        </div>
    </div>
);
}

export default App;
