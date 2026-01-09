from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from scipy import signal

app = FastAPI()

# Global variable to store the baseline frequency
baseline_freq = None

class VibrationData(BaseModel):
    values: List[float]
    is_baseline: Optional[bool] = False

@app.post("/analyze")
async def analyze_vibration(data: VibrationData):
    global baseline_freq
    
    # Step 1: Transform the Data (FFT Analysis)
    # Using numpy to find the Power Spectral Density
    arr = np.array(data.values)
    if len(arr) < 2:
        return {"error": "Insufficient data"}

    # Calculate FFT and find Peak Frequency
    sample_rate = 60  # Typical mobile accelerometer rate
    frequencies, psd = signal.welch(arr, fs=sample_rate)
    current_peak_freq = frequencies[np.argmax(psd)]
    
    # Step 2: Establish a "Golden Baseline"
    if data.is_baseline:
        baseline_freq = current_peak_freq
        return {
            "status": "baseline_captured",
            "baseline_frequency": float(baseline_freq)
        }

    # Step 3: Implement Integrity Score Formula
    integrity_score = 100
    status = "healthy"
    
    if baseline_freq and baseline_freq > 0:
        # Stiffness Loss Index: (f_current / f_baseline)^2 * 100
        integrity_score = (current_peak_freq / baseline_freq)**2 * 100
        integrity_score = min(100, float(integrity_score)) # Cap at 100%

        # Status Mapping
        if integrity_score < 80: status = "critical"
        elif integrity_score < 95: status = "warning"

    return {
        "status": status,
        "integrity_score": round(integrity_score, 2),
        "current_peak_freq": float(current_peak_freq),
        "baseline_freq": float(baseline_freq) if baseline_freq else None,
        "recommendation": "Structure stable" if status == "healthy" else "Stiffness loss detected"
    }