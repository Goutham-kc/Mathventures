from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np

app = FastAPI()

class VibrationData(BaseModel):
    values: List[float]

@app.post("/analyze")
async def analyze_vibration(data: VibrationData):
    # Mathematical Modelling: Signal analysis
    signal = np.array(data.values)
    rms = np.sqrt(np.mean(signal**2)) if len(signal) > 0 else 0
    
    # Simple logic to determine if the bridge is under stress
    status = "healthy"
    if rms > 1.5: status = "warning"
    if rms > 3.0: status = "critical"
    
    return {
        "status": status,
        "rms_intensity": float(rms),
        "data_points_processed": len(signal)
    }