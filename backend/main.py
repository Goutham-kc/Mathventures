from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from scipy.signal import welch, detrend

app = FastAPI()
baseline_freq = None

class VibrationData(BaseModel):
    values: List[float]
    is_baseline: bool = False

@app.post("/analyze")
async def analyze_vibration(data: VibrationData):
    global baseline_freq
    
    # 1. Clean the signal
    arr = np.array(data.values)
    if len(arr) < 20:
        return {"error": "Need more data"}

    # Detrend removes the 'random' drift/slope from the phone data
    arr_cleaned = detrend(arr - np.mean(arr))
    
    # 2. High-Resolution FFT
    # Increasing nfft to 2048 makes the Hz reading much more stable
    freqs, psd = welch(arr_cleaned, fs=60, nfft=2048)
    
    # Filter out low-frequency noise (like hand tilt)
    mask = freqs > 1.0 
    if not any(mask):
        return {"integrity_score": 0, "current_hz": 0}
        
    current_peak_freq = freqs[mask][np.argmax(psd[mask])]
    
    # 3. Handle Logic
    if data.is_baseline:
        baseline_freq = current_peak_freq
        return {"status": "success", "hz": round(baseline_freq, 2)}

    # 4. Calculate Final Score
    score = 100
    if baseline_freq and baseline_freq > 0:
        # Stiffness ratio squared
        score = (current_peak_freq / baseline_freq) ** 2 * 100
        score = min(100, max(0, score))

    return {
        "integrity_score": round(score, 1),
        "current_hz": round(current_peak_freq, 2),
        "baseline_hz": round(baseline_freq, 2) if baseline_freq else 0
    }