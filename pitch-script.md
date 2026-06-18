# EcoOS Core — Pitch Video Script (3–4 min)

## [0:00–1:00] The Problem & User

```
[Camera — you, natural lighting, speak directly to lens]
```

**You:** "Every Tuesday at 11am, a school cafeteria in Hong Kong prepares 120 portions of baked chicken. By 1pm, 40 kilograms of that food sits untouched in the trash. That's over a tonne of food waste every school year — from just one menu item, one day a week."

"Multiply that across 580 secondary schools in Hong Kong. That's 3,600 tonnes of food waste sent to landfills every single day — generating 446,000 tonnes of CO₂e per year."

"I'm [your name], and we built EcoOS Core — an AI-powered waste prediction platform for the USAII Global AI Hackathon 2026, Direction A: Food Waste Rescue Radar."

"Our user is Ms. Wong, a cafeteria manager at Demo Secondary School in Hong Kong. She's been running a school kitchen for twelve years. She knows food gets wasted — but she doesn't know when, why, or how to stop it without either wasting money or running out of food."

"Until now."

---

## [1:00–2:00] How the AI Works

```
[Cut to screen recording — app, landing page with terminal boot animation]
```

**You (voiceover):** "Here's what Ms. Wong opens on her laptop. A terminal — green on black, scanning in real time."

"Behind this terminal, we built an ensemble machine learning engine. Five models — Random Forest, XGBoost, Neural Network, Linear Regression, and LLM — each cross-validated against 50,000+ meal events."

```
[Show the prediction terminal widget on the landing page]
```

"The inputs are simple: menu item, day of week, weather, attendance count, and historical waste data. Ms. Wong types in 'Wednesday, Grilled Chicken, 350 students' — and the AI returns:"

" 'Predicted waste: 42.3 kilograms. Confidence: 94.2%. Risk level: moderate.' "

"Three actionable interventions appear ranked by cost savings — like 'reduce chicken portions by 15%' and 'offer a vegetarian alternative.'"

"After she runs the prediction, she can triage a situation report — the AI reads raw text and structures it into an environmental response plan. Every result feeds into the session impact tracker, which accumulates real-time metrics: kilograms of waste identified, dollars in projected savings, CO₂e prevented, and interventions applied."

```
[Show dashboard: prediction page, triage page, impact tracker bar]
```

---

## [2:00–3:00] Walkthrough

```
[Live demo — login to dashboard, walk through features]
```

**You (live or voiceover):** "Let me show you the full flow."

"Ms. Wong logs in — quick demo, no password needed. She lands on the dashboard. She sees her school's waste stats: 446,000 tonnes CO₂e, 30% of municipal waste is food, and her session impact tracking the results she's generated today."

"She opens the prediction console. She picks a menu item, enters attendance, and runs the model. Within seconds, EcoOS returns a waste forecast with confidence interval and risk level. She can select which ML model to use — from the simple Linear Regression for speed, to the LLM for deeper analysis."

"She switches to the triage console. She pastes a situation report — 'Students left most of the fried rice uneaten on a hot day' — and the AI structures it: category: overproduction. Cause: weather-related appetite drop. Action: adjust rice portions on hot days."

"She reviews the recommendation. She clicks approve — or rejects it. The AI never takes action without a human in the loop."

"Over on the analytics page, she can see waste trends over time: which menu items waste most, best-performing models, and what-if scenarios with CO₂ impact visualizations."

```
[Show analytics and what-if pages briefly — 3-5 seconds each]
```

---

## [3:00–3:45] Responsible AI

```
[Back to camera]
```

**You:** "We designed three responsible AI safeguards into EcoOS Core."

"First: **human-in-the-loop**. The AI predicts and recommends — but it never places an order, never changes a menu, and never dispatches resources. Only Ms. Wong can approve an intervention. Because only she knows about the school's upcoming sports day celebration that will increase attendance."

"Second: **confidence transparency**. Every prediction shows a confidence percentage and risk level — low, moderate, or high. Users can see when the AI is uncertain, and choose whether to trust it."

"Third: **deterministic fallback**. If the HuggingFace API is unavailable or the AI model returns low confidence, a local deterministic predictor takes over — computing waste estimates from menu keywords, day of week, and attendance patterns. The app never breaks, never shows an error. It always gives an answer."

"Ms. Wong doesn't need to trust black-box AI. She sees the reasoning, she stays in control, and the system never leaves her without guidance."

---

## [3:45–4:00] Closing

```
[Back to camera]
```

**You:** "We built EcoOS Core because climate action shouldn't feel abstract. For Ms. Wong, it's not about global carbon targets. It's about Tuesday's chicken."

"AI predicts. Humans decide. Waste decreases."

"EcoOS Core — Food Waste Rescue Radar, Direction A. Thank you."

---

> **Tips for recording:**
> - Keep energy up — speak with conviction, not reading
> - Screen recordings: use 1080p, clean your desktop, zoom into relevant areas
> - Walkthrough section: record live if possible, or pre-record clips and splice them
> - Total length: 3:45–4:00 is ideal (max 5 min)
