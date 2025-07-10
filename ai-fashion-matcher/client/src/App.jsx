import React, { useState, useRef } from 'react';

function App() {
    const [capturedImage, setCapturedImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const videoRef = useRef(null);

    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
    };

    const takePhoto = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
    };

    const analyzeImage = async () => {
        if (!capturedImage) return;
        const base64 = capturedImage.replace(/^data:image\/\w+;base64,/, '');
        try {
            const response = await fetch('http://localhost:5000/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 })
            });
            const data = await response.json();
            setAnalysisResult(data);
        } catch (error) {
            console.error('Error analyzing image:', error);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>AI Fashion Matcher</h2>
            {!capturedImage ? (
                <div>
                    <video ref={videoRef} autoPlay playsInline width="300" height="300"></video>
                    <br />
                    <button onClick={startCamera}>Start Camera</button>
                    <button onClick={takePhoto}>Take Photo</button>
                </div>
            ) : (
                <div>
                    <img src={capturedImage} alt="Captured" style={{ width: '300px' }} />
                    <br />
                    <button onClick={analyzeImage}>Analyze Photo</button>
                    <button onClick={() => setCapturedImage(null)}>Retake</button>
                </div>
            )}
            {analysisResult && (
                <pre style={{ textAlign: 'left', marginTop: 20 }}>
                    {JSON.stringify(analysisResult, null, 2)}
                </pre>
            )}
        </div>
    );
}

export default App;
