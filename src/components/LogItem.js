import React from "react";

const LogItem = ({ content, onClick }) => {
    return (
        <div className="log-item" onClick={onClick}>
            {content}
        </div>
    )
}

export default LogItem;