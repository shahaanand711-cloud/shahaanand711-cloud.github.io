import json, re
import pandas as pd

MAX_SIM_T = 23.0  # Matches your trimmed video flight window (58.73s - 35.8s)

events = []
header = None

with open("rocketcampSimwork.csv", "r", encoding="utf-8") as f:
    for line in f:
        s = line.strip()
        if s.startswith("# Time (s),"):
            header = [c.strip().replace("\u200b", "") for c in s[2:].split(",")]
        elif "# Event " in s:
            m = re.search(r"Event (\w+) occurred at t=([\d.]+)", s)
            if m and m.group(1) in {"LIFTOFF", "BURNOUT", "APOGEE", "RECOVERY_DEVICE_DEPLOYMENT"}:
                t_val = float(m.group(2))
                if t_val <= MAX_SIM_T:
                    events.append({"label": m.group(1), "t": t_val})

df = pd.read_csv("rocketcampSimwork.csv", comment="#", names=header)
df = df[df["Time (s)"] <= MAX_SIM_T]
mach_col = [c for c in df.columns if "Mach" in c][0]

payload = {
    "events": events,
    "points": [
        {
            "t": round(r["Time (s)"], 3),
            "alt": round(r["Altitude (ft)"], 1),
            "vel": round(r["Total velocity (ft/s)"], 1),
            "accG": round(r["Total acceleration (ft/s²)"] / 32.174, 2),
            "mach": round(r[mach_col], 3),
        }
        for _, r in df.iterrows()
    ],
}

with open("src/data/rocketcamp-flight.json", "w") as out:
    json.dump(payload, out)

print(f"Done! Saved {len(payload['points'])} points and {len(payload['events'])} events.")