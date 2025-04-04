import React, { useEffect, useState } from "react";
import { Bounce, toast } from 'react-toastify';

const PdfModal = ({ pdfUrl, onClose }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let timeoutId;

        timeoutId = setTimeout(() => {
            if (loading) {
                setLoading(false);
                toast.info('🦄 File Not Loaded!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                onClose();
            }
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [pdfUrl, onClose]);

    useEffect(() => {
        if (pdfUrl) {
            setLoading(true);
            const loadSimulationTimeout = setTimeout(() => {
                setLoading(false);
            }, 500);
            return () => clearTimeout(loadSimulationTimeout);
        }
    }, [pdfUrl]);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: "0px",
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    position: "relative",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "5px",
                    }}
                >
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
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <iframe
                        src={pdfUrl}
                        style={{ width: "100%", height: "100%", border: "none" }}
                    />
                )}
            </div>
        </div>
    );
};

export default PdfModal;