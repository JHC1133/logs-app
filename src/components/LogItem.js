import React from "react";

// The LogItem object are the saved logs or reviews that are shown in the sidebar, after they have been saved
const LogItem = ({ content, onClick }) => {
    return (
        <div className="log-item" onClick={onClick}>
            {content}
        </div>
    )
}

export default LogItem;