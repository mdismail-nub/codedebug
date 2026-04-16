const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const elements = {
  apiKey: document.getElementById('apiKey'),
  model: document.getElementById('model'),
  taskType: document.getElementById('taskType'),
  stack: document.getElementById('stack'),
  errorContext: document.getElementById('errorContext'),
  codeInput: document.getElementById('codeInput'),
  runBtn: document.getElementById('runBtn'),
  output: document.getElementById('output'),
};

bootstrap();

elements.runBtn.addEventListener('click', handleAnalyze);

function bootstrap() {
  elements.apiKey.value = localStorage.getItem('debugdeck_api_key') || '';
  elements.model.value = localStorage.getItem('debugdeck_model') || elements.model.value;
  elements.stack.value = localStorage.getItem('debugdeck_stack') || '';
}

async function handleAnalyze() {
  const apiKey = elements.apiKey.value.trim();
  const model = elements.model.value.trim();
  const stack = elements.stack.value.trim();
  const errorContext = elements.errorContext.value.trim();
  const code = elements.codeInput.value.trim();
  const taskType = elements.taskType.value;

  if (!apiKey || !model || !code) {
    elements.output.textContent = 'Please provide API key, model, and code snippet.';
    return;
  }

  persistLocal({ apiKey, model, stack });

  const systemPrompt = [
    'You are a senior software engineer and debugger.',
    'Return practical, accurate responses with corrected code and clear explanations.',
    'Use markdown with sections: Root Cause, Fix, Improved Code, and Why It Works.',
  ].join(' ');

  const userPrompt = [
    `Task: ${taskType}`,
    `Stack: ${stack || 'Not specified'}`,
    `Error Context: ${errorContext || 'No additional error context provided.'}`,
    'Code:',
    '```',
    code,
    '```',
  ].join('\n');

  elements.runBtn.disabled = true;
  elements.runBtn.textContent = 'Analyzing...';
  elements.output.textContent = 'Running AI analysis...';

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'DebugDeck',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter request failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const answer =
      data?.choices?.[0]?.message?.content ||
      'No response text returned by model. Inspect the API result in dev tools.';
    elements.output.textContent = answer;
  } catch (error) {
    elements.output.textContent = `Error: ${error.message}`;
  } finally {
    elements.runBtn.disabled = false;
    elements.runBtn.textContent = 'Analyze with AI';
  }
}

function persistLocal({ apiKey, model, stack }) {
  localStorage.setItem('debugdeck_api_key', apiKey);
  localStorage.setItem('debugdeck_model', model);
  localStorage.setItem('debugdeck_stack', stack);
}
