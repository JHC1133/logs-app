"use-strict";
import React, { useState } from "react";

const DiaryBar = ({ selectedMedia, saveLogEntry, removeSelectedMedia }) => {
    const [diaryEntry, setDiaryEntry] = useState('');
    const [diaryDate, setDiaryDate] = useState ('');

    // Handles changes in the diary entry textarea
    const handleDiaryChange = (event) => {
        setDiaryEntry(event.target.value); 
    }

    const handleDateChange = (event) => {
        setDiaryDate(event.target.value);
    }

    const handleSave = () => {
        saveLogEntry(diaryEntry, diaryDate);

        // Resets the diary entry and date after saving
        setDiaryEntry('');
        setDiaryDate('');
    };

    // Gets today's date and format it to the date input
    const today = new Date();
    const maxDate = today.toISOString().split("T")[0];

    return (
        <div>
            <form 
            className="diary-bar rounded protest-strike box-shadow" 
            onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                if (diaryEntry && diaryDate) { // Check if both fields are filled
                    handleSave(); // Call save function if valid
                }
            }}
            >
            {/* The left container holds the diaryBar title, selected date and textarea */}
            <div className="left-container">
                <div className="header-container">
                    <h1 className="diary-bar-title">
                        {selectedMedia ? "Review" : "... Or Log your day?"}</h1>
                    <input 
                        type="date" 
                        className="calender protest-strike rounded"
                        value={diaryDate}
                        onChange={handleDateChange}
                        max={maxDate} 
                        required
                    />
                </div>
                <textarea 
                    className="diary-bar-textfield rounded"
                    value={diaryEntry}
                    onChange={handleDiaryChange}
                    placeholder={selectedMedia ? "Write your review here..." : "Write your diary entry here..."}
                    required 
                />
            </div>
            { /* The right container holds the info for the selected media as well as the buttons for saving and removing */ }
            <div className="right-container">
                {selectedMedia && (
                    <div className="media-info">
                        <h2>Selected Media</h2>
                        <p>{selectedMedia.title}</p>
                        <img 
                            src={selectedMedia.imageUrl} 
                            alt={selectedMedia.title} 
                            className="media-image" 
                        />   
                    </div>
                )}
                <button type="submit" className="save-button protest-strike box-shadow">Save</button>   
                <button type="button" className="remove-button protest-strike box-shadow" onClick={removeSelectedMedia}>Remove</button>                                      
            </div>
        </form>
    </div>
        
    );
};

export default DiaryBar;