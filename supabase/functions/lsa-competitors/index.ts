const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName, industry, websiteMarkdown, location } = await req.json();

    if (!companyName) {
      return new Response(JSON.stringify({ success: false, error: 'companyName is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'LOVABLE_API_KEY is not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You generate realistic mock data for a Google Local Services Ads (LSA) results page.
Rules:
- "query" is the short search term a customer would type (e.g. "plumbing", "dentist", "window replacement"). Lowercase, 1-3 words.
- "location" is a plausible US city/ZIP the business serves, format "City, ST ZIP".
- Return exactly 8 businesses. The FIRST must be the given company itself.
- The other 7 must be REAL, well-known competitors in the same industry and region when possible, otherwise realistic local business names. Never repeat the given company.
- ratings between 4.6 and 5.0 with one decimal; reviewCount like "3.3K", "318", "1.2K".
- yearsInBusiness between 8 and 75.
- attribute is one of: "Family owned", "Local business", "Woman owned business", "Free in-home estimate", "Veteran owned".
- hours is "Open 24 hours" or "Open now".
- phone is a plausible formatted US number.
- Keep the category short and plural (e.g. "Plumbers", "Dentists", "Window contractors").
- Return 4 short customer-facing services that this specific company offers. Derive them from its website content when available; never return generic unrelated services.`;

    const userPrompt = `Company: ${companyName}
Industry: ${industry || 'Home Services'}
${location ? `Preferred market: ${location}` : ''}
${websiteMarkdown ? `Website content:\n${String(websiteMarkdown).slice(0, 2000)}` : ''}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'return_lsa',
              description: 'Return the mock LSA results',
              parameters: {
                type: 'object',
                properties: {
                  query: { type: 'string' },
                  location: { type: 'string' },
                  category: { type: 'string' },
                  services: {
                    type: 'array',
                    minItems: 4,
                    maxItems: 4,
                    items: { type: 'string' },
                  },
                  businesses: {
                    type: 'array',
                    minItems: 8,
                    maxItems: 8,
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        rating: { type: 'number' },
                        reviewCount: { type: 'string' },
                        yearsInBusiness: { type: 'number' },
                        attribute: { type: 'string' },
                        hours: { type: 'string' },
                        phone: { type: 'string' },
                        website: { type: 'string', description: 'bare domain, e.g. example.com' },
                      },
                      required: ['name', 'rating', 'reviewCount', 'yearsInBusiness', 'attribute', 'hours', 'phone', 'website'],
                      additionalProperties: false,
                    },
                  },
                },
                required: ['query', 'location', 'category', 'services', 'businesses'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'return_lsa' } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      console.error('AI gateway error:', status, await response.text());
      return new Response(
        JSON.stringify({
          success: false,
          error: status === 429 ? 'Rate limited' : status === 402 ? 'AI credits exhausted' : 'AI gateway error',
        }),
        { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ success: false, error: 'Failed to parse AI response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ success: true, ...parsed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating LSA data:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
