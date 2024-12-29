// import React, {useState } from "react"
import LogItem from './LogItem';

// The SideBar holds the saved logentries, the button for adding a new log as well as the clickable title that shows the home screen.
const Sidebar = ({ logEntries, handleAddLog, handleLogItemClick, showHomeScreen }) => {
    return (
        <div className="sidebar rounded box-shadow protest-strike">
            <h1 className="sidebar-title" onClick={showHomeScreen}>Logs</h1>
            <button className="add-log-button protest-strike box-shadow" onClick={handleAddLog}>Add log <strong>+</strong></button>
            <div className="log-item-panel rounded box-shadow">
                <div className="log-container">
                    {logEntries.map((entry, index) =>
                        <LogItem 
                            key={index} 
                            content={`${entry.date} - ${entry.media?.title || 'Log'}`}
                            onClick={() => handleLogItemClick(entry)}
                            />
                    )}
                </div>
            </div>
            
        </div>
    )
}

export default Sidebar;

