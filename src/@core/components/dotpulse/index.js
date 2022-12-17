import React from "react"

const DotPulse = ({
    className = "my-5"
}) => {
    return (
        <div className={`three-dots-pulse ${className}`}>
            <div className="dot-pulse"></div>
        </div>
    )
}

export default DotPulse