// Inside your VibrationChart useEffect sync interval:
const sync = setInterval(async () => {
  if (buffer.current.length > 0) {
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          values: buffer.current,
          is_baseline: isBaselineMode // New flag passed from Index.tsx
        })
      });
      const result = await res.json();
      console.log("Integrity Score:", result.integrity_score);
    } catch (e) {
      console.log("Sync failed");
    }
  }
}, 1000);