from fastapi import FastAPI
import numpy as np
from pydantic import BaseModel
from typing import List

app = FastAPI()

class VibrationData(BaseModel):
    values: List[float]

@app.post("/analyze")
async def analyze_vibration(data: VibrationData):
    # Convert to numpy array for math modeling
    signal = np.array(data.values)
    
    # Calculate FFT (Mathematical Modeling)
    fft_result = np.abs(np.fft.fft(signal))
    dominant_freq = np.argmax(fft_result)
    
    # Simple anomaly detection logic
    status = "healthy" if np.max(signal) < 10.0 else "warning"
    
    return {
        "dominant_frequency": float(dominant_freq),
        "status": status,
        "rms_amplitude": float(np.sqrt(np.mean(signal**2)))
    }