import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.0.0'

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') })

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const { query, userId } = await req.json()

    // 1. Initialize Supabase Client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Fetch User Profile/Digital Twin Context
    // Example: get user's active crops and location
    const { data: userContext } = await supabase
      .from('user_profiles')
      .select('location, farm_size, active_crops')
      .eq('id', userId)
      .single()

    // 3. Create Embedding for RAG Similarity Search
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    })
    const queryEmbedding = embeddingResponse.data[0].embedding

    // 4. Retrieve highly relevant local agricultural data from pgvector
    const { data: ragKnowledge } = await supabase
      .rpc('match_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 3,
      })

    const knowledgeContext = ragKnowledge?.map((k: any) => k.content).join('\n\n') || "No specific local knowledge found."

    // 5. Construct highly constrained prompt
    const systemPrompt = `
      You are Sankofa AI, a professional agronomist for East African farmers.
      You MUST base your advice on the provided Local Knowledge. Do not hallucinate treatments.
      
      User Profile:
      - Location: ${userContext?.location || 'Unknown'}
      - Active Crops: ${userContext?.active_crops?.join(', ') || 'None'}
      
      Local Verified Knowledge:
      ${knowledgeContext}
      
      Respond in Swahili or English based on the user's language. Keep it concise, professional, and actionable.
    `

    // 6. Generate Response via LLM
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast, capable model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      temperature: 0.2, // Low temp for factual accuracy
    })

    return new Response(
      JSON.stringify({ response: completion.choices[0].message.content }),
      { headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } }
    )

  } catch (error) {
    console.error("Error in RAG execution:", error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
