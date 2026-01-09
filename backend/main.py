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
    Cramér–Rao Lower Bound for frequency estimation error (Hz)
    """
    if snr <= 0:
        return 0.5  # conservative fallback

    N = n_samples
    denom = (4 * np.pi**2) * snr * N * (N**2 - 1)
    variance = 12 / denom
    return np.sqrt(variance) * fs

@app.post("/analyze")
async def analyze_vibration(data: VibrationData):

    # -------------------------
    # 1. Signal Pre-processing
    # -------------------------
    arr = np.array(data.values)
    n_samples = len(arr)

    if n_samples < 50:
        return {"error": "Insufficient data points"}

    arr = detrend(arr - np.mean(arr))

    # -------------------------
    # 2. SNR Estimation
    # -------------------------
    signal_power = np.mean(arr**2)
    noise_power = np.var(arr)
    snr = signal_power / (noise_power + 1e-9)

    # -------------------------
    # 3. Spectral Analysis
    # -------------------------
    fs = 60
    freqs, psd = welch(arr, fs=fs, nfft=2048)

    mask = (freqs > 1.0) & (freqs < 30.0)
    if not np.any(mask):
        return {"integrity_score": 0, "current_hz": 0}

    freqs_band = freqs[mask]
    psd_band = psd[mask]

    peak_idx = np.argmax(psd_band)
    current_peak_freq = freqs_band[peak_idx]

    # -------------------------
    # 4. Baseline Mode
    # -------------------------
    if data.is_baseline:
        storage["baseline_freq"] = float(current_peak_freq)
        storage["baseline_snr"] = float(snr)
        return {
            "status": "baseline_set",
            "hz": round(current_peak_freq, 3),
            "snr": round(snr, 2)
        }

    # -------------------------
    # 5. Tracking Mode
    # -------------------------
    integrity_score = 100.0
    error_margin = calculate_crlb(snr, n_samples, fs)

    if storage["baseline_freq"] is not None:
        baseline = storage["baseline_freq"]

        # Only consider frequency DROPS beyond noise floor
        freq_drop = baseline - current_peak_freq

        if freq_drop > error_margin:
            ratio = current_peak_freq / baseline
            integrity_score = (ratio ** 2) * 100

        integrity_score = min(100.0, max(0.0, integrity_score))

    return {
        "integrity_score": round(integrity_score, 1),
        "current_hz": round(current_peak_freq, 3),
        "baseline_hz": round(storage["baseline_freq"], 3),
        "error_margin_hz": round(error_margin, 4),
        "confidence": "High" if error_margin < 0.05 else "Low"
    }
