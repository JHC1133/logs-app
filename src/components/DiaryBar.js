import React, { useState } from "react";

const DiaryBar = ({ selectedMedia, saveLogEntry }) => {
    const [diaryEntry, setDiaryEntry] = useState('');
    const [diaryDate, setDiaryDate] = useState ('');

    const handleDiaryChange = (event) => {
        setDiaryEntry(event.target.value); 
    }

    const handleDateChange = (event) => {
        setDiaryDate(event.target.value);
    }

    const handleSave = () => {
        saveLogEntry(diaryEntry, diaryDate);
        setDiaryEntry('');
        setDiaryDate('');
    };

    const today = new Date();
    const maxDate = today.toISOString().split("T")[0];

    return (
        <form 
            className="diary-bar rounded protest-strike box-shadow" 
            onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                if (diaryEntry && diaryDate) { // Check if both fields are filled
                    handleSave(); // Call save function if valid
                }
            }}
            >
            <div className="left-container">
                <div className="header-container">
                    <h1 className="diary-bar-title">... Or Log your day?</h1>
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
                    placeholder="Write your diary entry here..."
                    required 
                />
            </div>
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
            </div>
        </form>
    );
};

export default DiaryBar;