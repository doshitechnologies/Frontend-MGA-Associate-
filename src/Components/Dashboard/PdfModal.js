import React, { useEffect, useState } from "react";

const PdfModal = ({ pdfUrl, onClose }) => {
    const [loading, setLoading] = useState(true);
    const googleDocsViewerUrl = `https://docs.google.com/viewerng/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

    useEffect(() => {
        setLoading(true);
        const loadTimeout = setTimeout(() => {
            setLoading(false);
        }, 1500); // Adjust the timeout as needed
        return () => clearTimeout(loadTimeout);
    }, [pdfUrl]);

    return (
        <div style={fullScreenOverlayStyle}>
            <div style={fullScreenContentStyle}>
                <button onClick={onClose} style={fullScreenCloseButtonStyle}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-8 p-y-2 text-white bg-[#3B3B3B] cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                {loading ? (
                    <div style={fullScreenLoadingContainerStyle}>
                        <div style={spinnerStyle}></div>
                    </div>
                ) : (
                    <iframe
                        src={googleDocsViewerUrl}
                        style={fullScreenIframeStyle}
                        title="PDF Viewer"
                    />
                )}
            </div>
        </div>
    );
};

const fullScreenOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.9)", // Slightly darker for better contrast
    display: "flex",
    justifyContent: "center", // Center horizontally (though not strictly needed for full screen)
    alignItems: "center", // Center vertically (though not strictly needed for full screen)
    zIndex: 1000,
};

const fullScreenContentStyle = {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    position: "relative",
};

const fullScreenCloseButtonStyle = {
    position: "absolute",
    top: "20px", 
    left: "20px",
    background: "rgba(0, 0, 0, 0.5)",
    border: "none",
    cursor: "pointer",
    padding: "2px",
    borderRadius: "5px",
    zIndex: 1100,
};

const fullScreenLoadingContainerStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)", // Match overlay for seamless transition
    zIndex: 1050, // Above the content but below the close button
};

const fullScreenIframeStyle = {
    width: "100%",
    height: "100%",
    border: "none",
};

const spinnerStyle = {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    animation: "spin 1s linear infinite",
};

// Keyframes for spinner animation (ensure this is in your global CSS or a <style> tag)
const spinAnimation = `@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerHTML = spinAnimation;
document.head.appendChild(styleSheet);

export default PdfModal;