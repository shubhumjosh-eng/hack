import { PredictionInput, PredictionResult } from './types';

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
  'Output: {"predictedWasteKg": 26.4, "actionableInterventions": ["Reduce pizza preparation by 18% on Fridays — historical data shows 22% lower Friday attendance than forecast", "Launch a Friday Flex program offering half-portions with a side salad option to reduce plate waste", "Create a pre-order system closing Thursday 3 PM to get accurate Friday counts"], "riskWarning": "IMPORTANT: This prediction is generated from synthetic training data and generalized food service patterns. Actual waste may vary by +/-35% depending on student food preferences, portion size variations, and unplanned schedule changes. Always verify against your local 4-week rolling average before making procurement decisions.", "humanInTheLoopAction": "Do NOT modify the weekly produce order based solely on this prediction. Instead, run a 2-week controlled trial: reduce pizza by 15% on Fridays and manually measure actual waste vs. prediction. Use those measured results to calibrate future AI predictions before automating any supply chain changes."}',
  '',
  'Example 2:',
  'Input: {"dayOfWeek": "Monday", "scheduledMenu": "Fresh salad bar with grilled chicken", "expectedAttendance": 300, "weatherCondition": "Rainy", "temperature": 58}',
  'Reasoning: Monday attendance is typically higher as students return from weekend. However, rainy weather and cold temperature (58F) significantly reduces hot food demand and overall cafeteria participation. Salad bar on a cold rainy day is particularly unpopular. Expect 25-30% of salad bar to go uneaten.',
  'Output: {"predictedWasteKg": 38.2, "actionableInterventions": ["Swap salad bar for hot soup and sandwich combo when forecast shows below 65F with precipitation", "Reduce total preparation by 12% on rainy days — attendance typically drops 10-15% in bad weather", "Offer a warm bowl alternative (rice + protein) alongside the salad bar to give cold-weather options"], "riskWarning": "IMPORTANT: This prediction is generated from synthetic training data and generalized food service patterns. Actual waste may vary by +/-35% depending on student food preferences, portion size variations, and unplanned schedule changes. Always verify against your local 4-week rolling average before making procurement decisions.", "humanInTheLoopAction": "Do NOT permanently remove salad bar from Monday menu. Instead, create a weather-based menu override playbook: when forecast shows rain + temp below 62F, shift 30% of salad prep budget to a hot soup station. Track adoption and waste for 4 weeks before making this a permanent automated rule."}',
  '',
  'Example 3:',
  'Input: {"dayOfWeek": "Wednesday", "scheduledMenu": "Pasta with marinara and garlic bread", "expectedAttendance": 350, "weatherCondition": "Cloudy", "temperature": 70}',
  'Reasoning: Wednesday mid-week has the most reliable attendance patterns. Pasta is a high-acceptance menu item across all grade levels. Cloudy with mild temperature has minimal impact on participation. Waste is typically limited to portion completion rather than full-tray rejection. Expect 8-12% waste ratio.',
  'Output: {"predictedWasteKg": 12.1, "actionableInterventions": ["Maintain current preparation levels — this menu/weather combination shows the lowest waste profile", "Introduce a taste-test portion option (half-size) for students unsure about pasta to reduce tray waste", "Collect student feedback on pasta sauce preference (marinara vs. alfredo vs. pesto) to further optimize"], "riskWarning": "IMPORTANT: This prediction is generated from synthetic training data and generalized food service patterns. Actual waste may vary by +/-35% depending on student food preferences, portion size variations, and unplanned schedule changes. Always verify against your local 4-week rolling average before making procurement decisions.", "humanInTheLoopAction": "Use this low-waste prediction as a benchmark. Document the current waste measurement (manual weigh-in of post-lunch discard) and compare against this prediction. If actual waste is within 20% of predicted, this combination can be flagged as low risk for future automated procurement adjustments."}',
].join('\n');

export async function predictWasteWithLLM(
  input: PredictionInput,
  apiKey: string,
  signal?: AbortSignal
): Promise<PredictionResult> {
  const startTime = performance.now();

  const userContent = [
    'Now analyze this new input and return ONLY valid JSON (no markdown, no code fences, no preamble, no extra text before or after the JSON):',
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
): Promise<any> {
  const payload = {
    model: 'meta-llama/Llama-3.1-8B-Instruct:fastest',
    messages: [
      { role: 'system', content: 'You analyze food waste descriptions and extract structured environmental intelligence. Return JSON with environmentalIntent (category, confidence, subcategory), locations (name, type, estimatedScale), actions (id, description, priority, environmentalImpact, estimatedSavings, effort), recommendation (summary, reasoning, nextSteps, impactProjection).' },
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

  return { rawInput: input, generatedText };
}

function parsePredictionResponse(text: string): {
  predictedWasteKg: number;
  actionableInterventions: string[];
  riskWarning: string;
  humanInTheLoopAction: string;
} {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
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
