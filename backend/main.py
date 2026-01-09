from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np
from scipy.signal import welch, detrend

app = FastAPI()

# Persistent state
storage = {
    "baseline_freq": None,
    "baseline_snr": None
}

class VibrationData(BaseModel):
    values: List[float]
    is_baseline: bool = False

def calculate_crlb(snr, n_samples, fs=60):
    """
    Cramér-Rao Lower Bound for frequency estimation variance.
    Formula: var(f) >= 12 / ((2*pi)^2 * SNR * N * (N^2 - 1))
    """
    if snr <= 0: return 0.5 # Default error margin if SNR is bad
    
    # Normalized SNR (linear scale)
    N = n_samples
    denom = (4 * (np.pi**2)) * snr * N * (N**2 - 1)
    variance_normalized = 12 / denom
    
    # Scale by sampling frequency to get Hz error
    return np.sqrt(variance_normalized) * fs

@app.post("/analyze")
async def analyze_vibration(data: VibrationData):
    # 1. Signal Cleaning
    arr = np.array(data.values)
    n_samples = len(arr)
    
    if n_samples < 20:
        return {"error": "Insufficient data points"}

    # Detrend and normalize
    arr_centered = arr - np.mean(arr)
    arr_cleaned = detrend(arr_centered)
    
    # Calculate SNR (Signal Power / Noise Power)
    # We estimate noise from the variance of the detrended signal's residuals
    signal_power = np.mean(arr_cleaned**2)
    noise_power = np.var(arr - arr_cleaned) # Approximation of noise floor
    snr = signal_power / (noise_power + 1e-9) 

    # 2. Spectral Analysis (Welch Method)
    # Using 2048 NFFT gives us 'interpolated' frequency resolution
    fs = 60 
    freqs, psd = welch(arr_cleaned, fs=fs, nfft=2048)
    
    # Focus on structural frequencies (1Hz to 30Hz)
    mask = (freqs > 1.0) & (freqs < 30.0)
    if not any(mask):
        return {"integrity_score": 0, "current_hz": 0}
        
    current_peak_freq = freqs[mask][np.argmax(psd[mask])]

    # 3. Logic: Baseline (5s) vs Tracking (3s)
    if data.is_baseline:
        storage["baseline_freq"] = current_peak_freq
        storage["baseline_snr"] = snr
        return {
            "status": "success", 
            "hz": round(current_peak_freq, 2),
            "snr": round(snr, 2)
        }

    # 4. Error Analysis & Integrity
    score = 100.0
    error_margin = 0.0
    
    if storage["baseline_freq"]:
        # C.R. Rao Error Margin
        # This tells the judges the theoretical precision of your Hz reading
        error_margin = calculate_crlb(snr, n_samples, fs)
        
        # Integrity calculation (f_curr / f_base)^2
        # We use the square because stiffness K is proportional to freq^2
        ratio = current_peak_freq / storage["baseline_freq"]
        score = (ratio ** 2) * 100
        score = min(100, max(0, score))

    return {
        "integrity_score": round(score, 1),
        "current_hz": round(current_peak_freq, 3),
        "baseline_hz": round(storage["baseline_freq"], 3) if storage["baseline_freq"] else 0,
        "error_margin_hz": round(error_margin, 4),
        "confidence": "High" if error_margin < 0.05 else "Low"
    }