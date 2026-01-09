from fastapi import FastAPI
import numpy as np
from pydantic import BaseModel
from typing import List

app = FastAPI()

class SensorReading(BaseModel):
    data: List[float]

@app.post("/analyze")
async def analyze_bridge(reading: SensorReading):
    # Perform Mathematical Modeling (e.g., FFT or Anomaly Detection)
    arr = np.array(reading.data)
    rms = np.sqrt(np.mean(arr**2))
    
    # Determine health status based on vibration intensity
    status = "healthy"
    if rms > 0.5: status = "warning"
    if rms > 1.2: status = "critical"
    
    return {
        "status": status,
        "intensity": float(rms),
        "recommendation": "Check structure" if status != "healthy" else "Monitor"
    }