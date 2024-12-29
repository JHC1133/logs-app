"use-strict";

// The ReadLogItemBar is the bar that is shown when a LogItem is clicked. The bar shows the written information for the log 
// as well as the media if it is a review.
const ReadLogItemBar = ({ logEntry }) => {
    if (!logEntry) {
        return null;
    }

    return (
        <div className="read-log-item-bar rounded box-shadow protest-strike">
            <div className="left-container">
                <h1>Log Details</h1>
                <h2>{logEntry.date}</h2>
                <p className="log-entry-container rounded box-shadow"> {logEntry.text}</p>
            </div>
            <div className="right-container">
                {logEntry.media && (
                        <div className="media-info">
                            <h2>Review</h2>
                            <p>{logEntry.media.title}</p>
                            <img 
                                src={logEntry.media.imageUrl} 
                                alt={logEntry.media.title} 
                                className="media-image" 
                            />
                        </div>
                    )}
            </div>
        </div>
    );
}

export default ReadLogItemBar;