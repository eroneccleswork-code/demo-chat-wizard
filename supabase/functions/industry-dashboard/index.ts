// Generates industry-specific labels for the Invoca dashboard clone.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { companyName, industry, websiteContext } = await req.json();
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY missing' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const system = `You generate realistic industry-specific labels for a call analytics dashboard.
Return ONLY JSON conforming to the schema. Numbers must be realistic and varied.
Search terms must reflect actual customer queries for the given industry. Divisions are US regions.`;

    const user = `Company: ${companyName || 'Acme'}
Industry: ${industry || 'General Services'}
Website context: ${(websiteContext || '').slice(0, 1500)}

Produce industry-specific labels for this company.`;

    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'industry_dashboard',
            description: 'Industry labels',
            parameters: {
              type: 'object',
              properties: {
                networkName: { type: 'string', description: 'e.g. "Invoca for Healthcare 2.0"' },
                inquiryKpiLabel: { type: 'string', description: 'e.g. "Inquiry Type: Billing and Payments (Percent)"' },
                inquiryKpiPercent: { type: 'number' },
                inquiryTypes: {
                  type: 'array', minItems: 3, maxItems: 3,
                  items: { type: 'string' },
                  description: '3 call inquiry categories for the trending chart',
                },
                searchTerms: {
                  type: 'array', minItems: 5, maxItems: 5,
                  items: {
                    type: 'object',
                    properties: {
                      term: { type: 'string' },
                      calls: { type: 'number' },
                      apptPct: { type: 'number' },
                    },
                    required: ['term', 'calls', 'apptPct'],
                  },
                },
                campaigns: {
                  type: 'array', minItems: 3, maxItems: 3,
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      calls: { type: 'number' },
                      apptPct: { type: 'number' },
                    },
                    required: ['name', 'calls', 'apptPct'],
                  },
                },
                linesOfBusiness: {
                  type: 'array', minItems: 3, maxItems: 3,
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      calls: { type: 'number' },
                      newPct: { type: 'number' },
                      existingPct: { type: 'number' },
                      apptPct: { type: 'number' },
                    },
                    required: ['name', 'calls', 'newPct', 'existingPct', 'apptPct'],
                  },
                },
                divisions: {
                  type: 'array', minItems: 5, maxItems: 5,
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      calls: { type: 'number' },
                      newPct: { type: 'number' },
                      existingPct: { type: 'number' },
                      apptPct: { type: 'number' },
                    },
                    required: ['name', 'calls', 'newPct', 'existingPct', 'apptPct'],
                  },
                },
              },
              required: ['networkName', 'inquiryKpiLabel', 'inquiryKpiPercent', 'inquiryTypes', 'searchTerms', 'campaigns', 'linesOfBusiness', 'divisions'],
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'industry_dashboard' } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      return new Response(JSON.stringify({ error: t }), { status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = args ? JSON.parse(args) : {};
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'unknown' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
