# EcoOS Core — Pitch Video Script (2:30–3:00)

## [0:00–0:20] Hook + Problem

```
[Camera — you, natural light, speak to lens]
```

**You:** "Every Tuesday, a Hong Kong school cafeteria throws away 40 kilograms of untouched chicken. Over a school year, that's one tonne of waste from a single menu item."

"Hong Kong sends 3,600 tonnes of food to landfill every day. We built EcoOS Core to stop it before it hits the bin."

---

## [0:20–1:40] Live Demo

```
[Cut to screen recording — already on the dashboard, skip login]
[Zoom in so text is readable — Cmd+ to magnify if needed]
```

**You (voiceover):** "This is Ms. Wong. She runs a school kitchen. She opens EcoOS — a terminal-green dashboard that predicts waste before lunch is served."

"Three inputs: menu, attendance, weather."

```
[Click menu field, type "Grilled chicken" — have it pre-typed, just click into it]
[Set attendance slider to 350]
[Click "Run Waste Prediction"]
```

"In seconds, the AI returns: 42.3 kilograms predicted waste with a confidence interval, a risk level, and three interventions ranked by cost savings."

```
[Pause briefly on results — let the typewriter effect play]
[Point cursor at "Reduce chicken portions by 15%"]
```

"Each recommendation includes a dollar savings estimate. She can copy, download, or review them."

"Next she opens the Triage console. She pastes a situation report — already copied to her clipboard."

```
[Switch to triage page]
[Paste pre-copied text: "Students left most of the fried rice uneaten on a hot day"]
[Show structured output appear]
```

"The AI structures it: category, cause, action plan. She reviews the recommendation and acknowledges the risk — she stays in control."

```
[Briefly show analytics page — 3 seconds]
[Show session impact tracker bar — 2 seconds]
```

---

## [1:40–2:00] How It Works

**You (voiceover):** "Behind the terminal is an ensemble of five ML models — Random Forest, XGBoost, Neural Network, Linear Regression, and an LLM — trained on 50,000+ meal events."

"If the HuggingFace API is unavailable, a local deterministic fallback takes over silently. The user never sees an error."

---

## [2:00–2:20] Responsible AI

```
[Back to camera]
```

**You:** "Three safeguards. One: every prediction shows a confidence interval and risk level — you always see how certain the AI is. Two: a deterministic fallback guarantees the app never errors during a demo. Three: the human acknowledges the risk before any recommendation is acted on — because only Ms. Wong knows about the sports day that doubles attendance tomorrow."

---

## [2:20–2:45] Closing

```
[Back to camera]
```

**You:** "For Ms. Wong, climate action isn't about global targets. It's about Tuesday's chicken. EcoOS gives her the data to cut waste without cutting portions — and keep her students fed."

"AI predicts. Humans decide. Waste decreases."

"EcoOS Core — USAII Global AI Hackathon 2026, Direction A: Food Waste Rescue Radar. Thank you."

---

> **Recording tips:**
> - Speak conversationally, not reading — glance at script on second monitor
> - Screen recording: 1080p, clean desktop, Cmd+ to zoom browser to 150% so terminal text is readable
> - Have text pre-copied before recording (menu text, triage report, etc.)
> - Total: keep under 3 minutes — shorter = judges actually watch
> - Upload to YouTube as **unlisted**, paste link into Devpost
