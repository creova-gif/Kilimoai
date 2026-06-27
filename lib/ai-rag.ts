import { supabase } from './supabase';

const openaiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY!;

async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small',
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${await res.text()}`);
  const data = await res.json();
  return data.data[0].embedding;
}

export async function fetchRAGContext(query: string): Promise<string> {
  if (!openaiKey) return ''; // Skip RAG if no key

  try {
    const queryEmbedding = await generateEmbedding(query);

    // Call the match_knowledge RPC
    const { data, error } = await supabase.rpc('match_knowledge', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 3,
    });

    if (error || !data || data.length === 0) return '';

    return data.map((doc: any) => `[${doc.title}]: ${doc.content}`).join('\n\n');
  } catch (e) {
    console.error('RAG Error:', e);
    return '';
  }
}
