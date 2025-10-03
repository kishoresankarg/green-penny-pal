import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { activities } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Prepare activity summary for AI
    const activitySummary = activities
      .map(
        (a: any) =>
          `${a.category}: ${a.activity_type} (${a.amount} units, ${a.co2_impact}kg CO2, ₹${a.financial_impact})`
      )
      .join(", ");

    const systemPrompt = `You are an eco-friendly lifestyle coach. Analyze the user's activities and provide 3 personalized, actionable suggestions to reduce carbon footprint and save money. Each suggestion should be specific, practical, and tailored to their activity patterns. Format as JSON array with: title, description, ecoImpact (e.g., "10kg CO₂/month"), financialSaving (e.g., "₹500/month"), category (high/medium/low).`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Recent activities: ${activitySummary}. Provide 3 personalized suggestions.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "suggest_eco_actions",
                description: "Return 3 personalized eco-friendly suggestions.",
                parameters: {
                  type: "object",
                  properties: {
                    suggestions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          description: { type: "string" },
                          ecoImpact: { type: "string" },
                          financialSaving: { type: "string" },
                          category: {
                            type: "string",
                            enum: ["high", "medium", "low"],
                          },
                        },
                        required: [
                          "title",
                          "description",
                          "ecoImpact",
                          "financialSaving",
                          "category",
                        ],
                      },
                    },
                  },
                  required: ["suggestions"],
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "suggest_eco_actions" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again later.",
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "AI credits exhausted. Please add credits to continue.",
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const suggestions = toolCall
      ? JSON.parse(toolCall.function.arguments).suggestions
      : [];

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
