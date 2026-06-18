import { PredictionInput, PredictionResult, TriageResult, EnvironmentalIntent, GeoLocation, ActionItem, AIRecommendation } from './types';

const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions';
const HF_MODEL = 'meta-llama/Llama-3.1-8B-Instruct:fastest';

const SYSTEM_PROMPT = [
  'You are EcoOS Core Food Waste Prediction Engine, an AI that predicts cafeteria food waste based on operational parameters. Your task is to analyze the input data and output a structured prediction.',
  '',
  'FEW-SHOT EXAMPLES:',
  '',
  'Example 1:',
  'Input: {"dayOfWeek": "Friday", "scheduledMenu": "Pizza with vegetables", "expectedAttendance": 400, "weatherCondition": "Sunny", "temperature": 72}',
  'Reasoning: Friday afternoons have reduced attendance as students leave for weekend activities. Pizza is popular but 400 servings for 400 expected students on a Friday typically results in 15-20% overproduction. Sunny weather means more students may go off-campus for lunch.',
  'Output: {"predictedWasteKg": 26.4, "actionableInterventions": ["Reduce pizza preparation by 18% on Fridays — historical data shows 22% lower Friday attendance than forecast", "Launch a Friday Flex program offering half-portions with a side salad option to reduce plate waste", "Create a pre-order system closing Thursday 3 PM to get accurate Friday counts"], "riskWarning": "Predictions are based on generalized food service patterns. Actual waste may vary by +/-35% depending on student food preferences, portion size variations, and unplanned schedule changes. Always verify against your local 4-week rolling average before making procurement decisions.", "humanInTheLoopAction": "Run a 2-week controlled trial: reduce pizza by 15% on Fridays and manually measure actual waste vs. prediction. Use those measured results to calibrate future AI predictions before automating any supply chain changes."}',
  '',
  'Example 2:',
  'Input: {"dayOfWeek": "Monday", "scheduledMenu": "Fresh salad bar with grilled chicken", "expectedAttendance": 300, "weatherCondition": "Rainy", "temperature": 58}',
  'Reasoning: Monday attendance is typically higher as students return from weekend. However, rainy weather and cold temperature (58F) significantly reduces hot food demand and overall cafeteria participation. Salad bar on a cold rainy day is particularly unpopular. Expect 25-30% of salad bar to go uneaten.',
  'Output: {"predictedWasteKg": 38.2, "actionableInterventions": ["Swap salad bar for hot soup and sandwich combo when forecast shows below 65F with precipitation", "Reduce total preparation by 12% on rainy days — attendance typically drops 10-15% in bad weather", "Offer a warm bowl alternative (rice + protein) alongside the salad bar to give cold-weather options"], "riskWarning": "Predictions are based on generalized food service patterns. Actual waste may vary by +/-35% depending on student food preferences, portion size variations, and unplanned schedule changes. Always verify against your local 4-week rolling average before making procurement decisions.", "humanInTheLoopAction": "Create a weather-based menu override playbook: when forecast shows rain + temp below 62F, shift 30% of salad prep budget to a hot soup station. Track adoption and waste for 4 weeks before making this a permanent automated rule."}',
  '',
  'Example 3:',
  'Input: {"dayOfWeek": "Wednesday", "scheduledMenu": "Pasta with marinara and garlic bread", "expectedAttendance": 350, "weatherCondition": "Cloudy", "temperature": 70}',
  'Reasoning: Wednesday mid-week has the most reliable attendance patterns. Pasta is a high-acceptance menu item across all grade levels. Cloudy with mild temperature has minimal impact on participation. Waste is typically limited to portion completion rather than full-tray rejection. Expect 8-12% waste ratio.',
  'Output: {"predictedWasteKg": 12.1, "actionableInterventions": ["Maintain current preparation levels — this menu/weather combination shows the lowest waste profile", "Introduce a taste-test portion option (half-size) for students unsure about pasta to reduce tray waste", "Collect student feedback on pasta sauce preference (marinara vs. alfredo vs. pesto) to further optimize"], "riskWarning": "Predictions are based on generalized food service patterns. Actual waste may vary by +/-35% depending on student food preferences, portion size variations, and unplanned schedule changes. Always verify against your local 4-week rolling average before making procurement decisions.", "humanInTheLoopAction": "Use this low-waste prediction as a benchmark. Document the current waste measurement (manual weigh-in of post-lunch discard) and compare against this prediction. If actual waste is within 20% of predicted, this combination can be flagged as low risk for future automated procurement adjustments."}',
].join('\n');

export async function predictWasteWithLLM(
  input: PredictionInput,
  apiKey: string,
  signal?: AbortSignal
): Promise<PredictionResult> {
  const startTime = performance.now();

  const userContent = [
    'Analyze this input and return ONLY valid JSON. No reasoning, no explanation, no markdown, no code fences, no extra text before or after the JSON. Begin your response with { and end with }.',
    '',
    'Input:',
    JSON.stringify({
      dayOfWeek: input.dayOfWeek,
      scheduledMenu: input.scheduledMenu,
      expectedAttendance: input.expectedAttendance,
      weatherCondition: input.weatherCondition,
      temperature: input.temperature ?? 70,
    }, null, 2),
    '',
    'Output:',
  ].join('\n');

  const payload = {
    model: HF_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    max_tokens: 800,
    temperature: 0.1,
    top_p: 0.95,
  };

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Hugging Face API error (${response.status}): ${errorBody || response.statusText}`);
  }

  const result = await response.json();
  const generatedText = result?.choices?.[0]?.message?.content;

  if (!generatedText) {
    throw new Error('No response generated from AI model.');
  }

  const parsed = parsePredictionResponse(generatedText);
  const latencyMs = Math.round(performance.now() - startTime);

  return {
    predictedWasteKg: parsed.predictedWasteKg,
    actionableInterventions: parsed.actionableInterventions,
    riskWarning: parsed.riskWarning,
    humanInTheLoopAction: parsed.humanInTheLoopAction,
    metadata: {
      modelUsed: 'meta-llama/Llama-3.1-8B-Instruct',
      latencyMs,
      processedAt: new Date().toISOString(),
      inputSnapshot: { ...input },
    },
  };
}

export async function triageText(
  input: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<TriageResult> {
  const startTime = performance.now();

  const payload = {
    model: 'meta-llama/Llama-3.1-8B-Instruct:fastest',
    messages: [
      { role: 'system', content: 'You analyze food waste descriptions and extract structured environmental intelligence. Return ONLY valid JSON. No reasoning, no explanation, no markdown, no code fences, no extra text. Begin with { and end with }. Use this exact structure: { "environmentalIntent": { "category": "waste"|"emission"|"water"|"energy"|"biodiversity"|"unknown", "confidence": 0.95, "subcategory": "string" }, "locations": [{ "name": "string", "type": "school"|"hospital"|"restaurant"|"office"|"warehouse"|"home"|"other", "estimatedScale": "small"|"medium"|"large" }], "actions": [{ "id": "act-1", "description": "string", "priority": "critical"|"high"|"medium"|"low", "environmentalImpact": "string", "estimatedSavings": "string", "effort": "quick"|"moderate"|"significant" }], "recommendation": { "summary": "string", "reasoning": ["string"], "nextSteps": ["string"], "impactProjection": { "wasteReduction": "string", "costSavings": "string", "co2Reduction": "string" } } }' },
      { role: 'user', content: `Analyze this waste situation:\n\n"${input}"` },
    ],
    max_tokens: 1024,
    temperature: 0.1,
  };

  const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Triage API error: ${response.status}`);
  }

  const result = await response.json();
  const generatedText = result?.choices?.[0]?.message?.content;

  if (!generatedText) {
    throw new Error('No response from triage model.');
  }

  const parsed = parseTriageResponse(generatedText);
  const latencyMs = Math.round(performance.now() - startTime);

  return {
    rawInput: input,
    processedAt: new Date().toISOString(),
    environmentalIntent: parsed.environmentalIntent,
    locations: parsed.locations,
    actions: parsed.actions,
    recommendation: parsed.recommendation,
    modelUsed: 'meta-llama/Llama-3.1-8B-Instruct',
    latencyMs,
  };
}

function parseTriageResponse(text: string): {
  environmentalIntent: EnvironmentalIntent;
  locations: GeoLocation[];
  actions: ActionItem[];
  recommendation: AIRecommendation;
} {
  const stripped = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '');
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse triage response. Expected JSON object.');
  }

  const cleaned = jsonMatch[0]
    .replace(/\/\/.*$/gm, '')
    .replace(/,\s*}/g, '}')
    .replace(/,\s*\]/g, ']');

  try {
    const parsed = JSON.parse(cleaned);

    return {
      environmentalIntent: {
        category: parsed.environmentalIntent?.category || 'unknown',
        confidence: typeof parsed.environmentalIntent?.confidence === 'number' ? parsed.environmentalIntent.confidence : 0,
        subcategory: parsed.environmentalIntent?.subcategory || 'Unspecified environmental impact',
      },
      locations: Array.isArray(parsed.locations)
        ? parsed.locations.map((l: any) => ({
            name: l.name || 'Unspecified location',
            type: l.type || 'other',
            estimatedScale: l.estimatedScale || 'medium',
          }))
        : [],
      actions: Array.isArray(parsed.actions)
        ? parsed.actions.map((a: any, i: number) => ({
            id: a.id || `act-${i + 1}`,
            description: a.description || '',
            priority: a.priority || 'medium',
            environmentalImpact: a.environmentalImpact || '',
            estimatedSavings: a.estimatedSavings || '',
            effort: a.effort || 'moderate',
          }))
        : [],
      recommendation: {
        summary: parsed.recommendation?.summary || '',
        reasoning: Array.isArray(parsed.recommendation?.reasoning)
          ? parsed.recommendation.reasoning
          : [],
        nextSteps: Array.isArray(parsed.recommendation?.nextSteps)
          ? parsed.recommendation.nextSteps
          : [],
        impactProjection: {
          wasteReduction: parsed.recommendation?.impactProjection?.wasteReduction || 'N/A',
          costSavings: parsed.recommendation?.impactProjection?.costSavings || 'N/A',
          co2Reduction: parsed.recommendation?.impactProjection?.co2Reduction || 'N/A',
        },
      },
    };
  } catch {
    return {
      environmentalIntent: { category: 'unknown', confidence: 0, subcategory: 'Unable to determine environmental intent from description' },
      locations: [],
      actions: [
        {
          id: 'act-1',
          description: 'Conduct a manual waste audit to gather baseline data',
          priority: 'high',
          environmentalImpact: 'Establishes a measurable baseline for waste reduction targets',
          estimatedSavings: 'Varies based on audit findings — typically 10-20% reduction identified',
          effort: 'moderate',
        },
        {
          id: 'act-2',
          description: 'Implement a source separation program for identified waste streams',
          priority: 'medium',
          environmentalImpact: 'Enables recycling and composting of diverted materials',
          estimatedSavings: '15-30% reduction in disposal costs',
          effort: 'significant',
        },
      ],
      recommendation: {
        summary: 'Start with a structured waste audit to quantify the problem before implementing solutions.',
        reasoning: [
          'Without baseline data, it is impossible to measure the effectiveness of interventions',
          'A structured audit identifies the highest-impact waste streams to target first',
        ],
        nextSteps: [
          'Schedule a 1-week manual waste sort and measurement',
          'Categorize waste by type (food, packaging, recyclables)',
          'Report findings with recommended interventions',
        ],
        impactProjection: {
          wasteReduction: '15-25% within 3 months',
          costSavings: '$200-500/month estimated',
          co2Reduction: '0.5-1.5 metric tons CO₂e annually',
        },
      },
    };
  }
}

export function predictWasteLocally(input: PredictionInput): PredictionResult {
  const menu = input.scheduledMenu.toLowerCase();
  const attendance = input.expectedAttendance;

  let basePer100 = 8;
  if (menu.includes('fish') || menu.includes('seafood')) basePer100 = 15;
  else if (menu.includes('liver') || menu.includes('tofu') || menu.includes('eggplant')) basePer100 = 13;
  else if (menu.includes('salad') || menu.includes('vegetable stir')) basePer100 = 11;
  else if (menu.includes('stir-fry') || menu.includes('soup')) basePer100 = 10;
  else if (menu.includes('pizza') || menu.includes('pasta') || menu.includes('spaghetti')) basePer100 = 6;
  else if (menu.includes('chicken tend') || menu.includes('nugget') || menu.includes('burger')) basePer100 = 5;
  else if (menu.includes('taco') || menu.includes('wrap') || menu.includes('sandwich')) basePer100 = 7;
  else if (menu.includes('mac') && menu.includes('cheese')) basePer100 = 6;

  const dayMult: Record<string, number> = { Monday: 1.15, Tuesday: 1.05, Wednesday: 0.90, Thursday: 1.10, Friday: 0.85, Saturday: 1.20, Sunday: 1.25 };
  const weatherMult: Record<string, number> = { Sunny: 0.90, Cloudy: 1.00, Rainy: 1.20, Snowy: 1.15, Hot: 1.10, Cold: 1.15, Mild: 0.95, Windy: 1.05 };
  const temp = input.temperature ?? 70;
  const tempMult = temp > 90 || temp < 40 ? 1.15 : temp > 80 || temp < 50 ? 1.05 : 1.0;
  const dayFactor = dayMult[input.dayOfWeek] ?? 1.0;
  const weatherFactor = weatherMult[input.weatherCondition] ?? 1.0;
  const raw = basePer100 * (attendance / 100) * dayFactor * weatherFactor * tempMult + attendance * 0.01;
  const predictedWasteKg = Math.round(raw * 10) / 10;

  const day = input.dayOfWeek;
  const short = menu.split(' ').slice(0, 3).join(' ');

  let interventions: string[];
  if (predictedWasteKg > 40) {
    interventions = [
      `Reduce ${short} portions by 25% on ${day}s — high waste pattern detected for this menu`,
      `Run a taste-test alternative on ${day}s for 3 weeks to find a higher-acceptance option`,
      `Switch to pre-orders closing 24h before ${day} lunch to get accurate counts`,
    ];
  } else if (predictedWasteKg > 25) {
    interventions = [
      `Reduce ${short} production by 15% on ${day}s — moderate overproduction pattern detected`,
      `Add a half-portion option to reduce plate waste from students who don't finish`,
      `Monitor ${input.weatherCondition.toLowerCase()} day patterns — weather is amplifying waste`,
    ];
  } else {
    interventions = [
      `Maintain current ${short} levels — this menu performs well on ${day}s`,
      `Consider a seasonal fruit side to further improve meal acceptance`,
      `Track ${day} waste weekly — this low-waste profile is the benchmark for other days`,
    ];
  }

  return {
    predictedWasteKg,
    actionableInterventions: interventions,
    riskWarning: 'Predictions are based on generalized food service patterns — actual waste may vary by ±35% depending on local student preferences. Validate against manual measurements before making procurement changes.',
    humanInTheLoopAction: 'Run a 2-week test: apply the first intervention manually, measure waste daily, compare against prediction. Only automate after calibration shows consistent results.',
    metadata: {
      modelUsed: 'EcoOS Local Predictor v1.0',
      latencyMs: 0,
      processedAt: new Date().toISOString(),
      inputSnapshot: { ...input },
    },
  };
}

export function triageFallback(input: string): TriageResult {
  const text = input.toLowerCase();
  const hasNumbers = /\d+/.test(text);
  const hasLocation = /kitchen|cafeteria|dining|hall|classroom/.test(text);
  let category: EnvironmentalIntent['category'] = 'waste';
  if (/energy|electricity|power|gas/.test(text)) category = 'energy';
  else if (/water|tap|faucet/.test(text)) category = 'water';
  else if (/emission|carbon|co2|greenhouse/.test(text)) category = 'emission';
  let scale: GeoLocation['estimatedScale'] = 'medium';
  if (/whole school|district|all|entire/.test(text)) scale = 'large';
  else if (/classroom|office|single/.test(text)) scale = 'small';

  return {
    rawInput: input,
    processedAt: new Date().toISOString(),
    environmentalIntent: {
      category,
      confidence: 0.85,
      subcategory: hasNumbers ? 'Measurable waste with quantities reported' : 'Qualitative description — recommend quantifying with a 1-week audit',
    },
    locations: [{ name: hasLocation ? 'School cafeteria / kitchen' : 'Unspecified school location', type: 'school', estimatedScale: scale }],
    actions: [
      {
        id: 'f-all-1',
        description: hasNumbers
          ? 'Set up a daily weigh station to track waste consistently — you already have initial numbers, make it systematic'
          : 'Start a 1-week manual waste audit — weigh and categorize all post-meal discard by food type',
        priority: 'high',
        environmentalImpact: 'Establishes measurable baseline for targeted waste reduction',
        estimatedSavings: 'Typically identifies 15-25% reduction opportunities',
        effort: 'moderate',
      },
      {
        id: 'f-all-2',
        description: 'Create a share table for unopened packaged items (milk, fruit, wrapped sandwiches)',
        priority: 'high',
        environmentalImpact: 'Captures 30-50% of recoverable packaged waste before the bin',
        estimatedSavings: '$200-500/month in recovered food value',
        effort: 'quick',
      },
      {
        id: 'f-all-3',
        description: 'Conduct a student preference survey to identify least-liked menu items driving waste',
        priority: 'medium',
        environmentalImpact: 'Targeted menu changes have 3x the impact of generic cuts',
        estimatedSavings: 'High-impact, low-cost intervention',
        effort: 'quick',
      },
    ],
    recommendation: {
      summary: hasNumbers
        ? 'You have initial data—good. Next: systematic tracking with a feedback loop to kitchen planning.'
        : 'Start with a structured waste audit to quantify the problem, then target highest-impact streams.',
      reasoning: [
        hasNumbers ? 'Existing numbers show awareness exists but systematic tracking is missing' : 'Without baseline data, intervention effectiveness cannot be measured',
        'Share tables and pre-order systems are the highest-ROI first steps for any school cafeteria',
        'Student preference data ensures menu changes target actual dislikes, not assumptions',
      ],
      nextSteps: [
        hasNumbers ? 'Set up daily weigh station and track for 2 consecutive weeks' : 'Conduct a 1-week manual waste sort measuring each food category separately',
        'Launch a share table pilot alongside the audit',
        'Administer a 5-question student lunch preference survey',
      ],
      impactProjection: {
        wasteReduction: '20-35% reduction achievable within 60 days',
        costSavings: '$300-800/month in reduced food costs and disposal fees',
        co2Reduction: '1-3 tonnes CO₂e annually from landfill diversion',
      },
    },
    modelUsed: 'EcoOS Local Triager v1.0',
    latencyMs: 0,
  };
}

function parsePredictionResponse(text: string): {
  predictedWasteKg: number;
  actionableInterventions: string[];
  riskWarning: string;
  humanInTheLoopAction: string;
} {
  const stripped = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '');
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse AI response. Expected JSON object.');
  }

  const cleaned = jsonMatch[0]
    .replace(/\/\/.*$/gm, '')
    .replace(/,\s*}/g, '}')
    .replace(/,\s*\]/g, ']');

  try {
    const parsed = JSON.parse(cleaned);

    return {
      predictedWasteKg: typeof parsed.predictedWasteKg === 'number' ? parsed.predictedWasteKg : 25,
      actionableInterventions: Array.isArray(parsed.actionableInterventions)
        ? parsed.actionableInterventions
        : ['Conduct a manual waste audit to gather baseline data'],
      riskWarning: typeof parsed.riskWarning === 'string'
        ? parsed.riskWarning
        : 'This prediction uses generalized patterns. Actual results will vary.',
      humanInTheLoopAction: typeof parsed.humanInTheLoopAction === 'string'
        ? parsed.humanInTheLoopAction
        : 'Verify this prediction against 2 weeks of manual waste measurements before making any menu changes.',
    };
  } catch {
    return {
      predictedWasteKg: 25,
      actionableInterventions: [
        'Run a 1-week manual waste audit to establish baseline measurements',
        'Cross-reference attendance records with weather data to identify patterns',
      ],
      riskWarning: 'The AI response could not be parsed. This fallback prediction uses generalized defaults — do not use for procurement decisions without manual verification.',
      humanInTheLoopAction: 'Manually weigh and record post-lunch food waste for 5 consecutive service days. Compare against this prediction and report findings before any menu changes are authorized.',
    };
  }
}
