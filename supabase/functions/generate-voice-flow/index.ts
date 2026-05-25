const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { companyName, websiteUrl, websiteMarkdown } = await req.json();
    if (!companyName) {
      return json({ success: false, error: 'companyName required' }, 400);
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) return json({ success: false, error: 'LOVABLE_API_KEY missing' }, 500);

    const systemPrompt = `You design realistic AI voice-agent call scripts for e-commerce / service brands.
Given a company's website content, return a JSON object describing:
- agentName: a friendly first name for the AI voice agent (e.g. "Ava", "Marcus")
- openingLine: what the agent says when the call connects. Must reference the company by name and mention the cart/items the caller left behind. 1-2 sentences.
- presenceSummary: 2-3 short bullet-style sentences summarizing what the agent has been trained on (products, policies, tone).
- cart: 2-4 plausible items pulled from the actual site (name + realistic price + qty). Use REAL product names found on the site if possible.
- branches: 4-6 conversational steps. Each step has { id, agent, options:[{label, nextId, intent?:'buy'|'transfer'|'decline'|'question'}] }. The first step id must be "greet". Terminal steps have empty options and a "terminal":true field. Include an upsell branch and a "transfer to human" branch.

Tone: warm, confident, concise. Sound like Invoca's AI Voice Agent — natural, sales-aware, helpful.`;

    const userPrompt = `Company: ${companyName}
Website: ${websiteUrl || 'n/a'}

Scraped site content (truncated):
${(websiteMarkdown || '').slice(0, 4000)}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'return_voice_flow',
            parameters: {
              type: 'object',
              properties: {
                agentName: { type: 'string' },
                openingLine: { type: 'string' },
                presenceSummary: { type: 'string' },
                cart: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      price: { type: 'number' },
                      qty: { type: 'number' },
                    },
                    required: ['name', 'price', 'qty'],
                  },
                },
                branches: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      agent: { type: 'string' },
                      terminal: { type: 'boolean' },
                      options: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            label: { type: 'string' },
                            nextId: { type: 'string' },
                            intent: { type: 'string' },
                          },
                          required: ['label', 'nextId'],
                        },
                      },
                    },
                    required: ['id', 'agent', 'options'],
                  },
                },
              },
              required: ['agentName', 'openingLine', 'presenceSummary', 'cart', 'branches'],
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'return_voice_flow' } },
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error('AI error', response.status, txt);
      return json({ success: false, error: `AI error ${response.status}` }, 500);
    }
    const data = await response.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) return json({ success: false, error: 'No tool call' }, 500);
    const parsed = JSON.parse(args);
    return json({ success: true, flow: parsed });
  } catch (e) {
    console.error(e);
    return json({ success: false, error: e instanceof Error ? e.message : 'unknown' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
