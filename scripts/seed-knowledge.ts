import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const openaiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const KNOWLEDGE_ITEMS = [
  {
    title: 'Ugonjwa wa Michirizi ya Kahawia (CBSD)',
    content:
      "Ugonjwa wa michirizi ya kahawia kwenye mihogo (Cassava Brown Streak Disease) unasababishwa na virusi vinavyoenezwa na inzi weupe. Dalili zake ni michirizi ya njano kwenye majani, na kuoza kwa mizizi ya muhogo (necrosis). Dawa hakuna, lakini unaweza kuzuia kwa kutumia mbegu safi zinazostahimili na kung'oa mimea iliyoathirika mapema.",
    category: 'disease',
    tags: ['cassava', 'cbsd', 'disease', 'muhogo'],
  },
  {
    title: 'Upandaji wa Mahindi (Maize Planting)',
    content:
      'Panda mahindi mwanzoni mwa msimu wa mvua. Tumia nafasi ya sentimita 75 kati ya mistari na sentimita 30 kati ya mashina. Tumia mbolea ya DAP wakati wa kupanda (kifuniko kimoja cha soda kwa kila shimo) na Urea wiki 3-4 baada ya kuota. Palilia shamba lako mapema ili kuepuka ushindani wa magugu.',
    category: 'farming_guide',
    tags: ['maize', 'mahindi', 'planting', 'guide'],
  },
  {
    title: 'Kudhibiti Viwavi Jeshi (Fall Armyworm)',
    content:
      'Viwavi jeshi ni tishio kubwa kwa mahindi. Dalili ni matundu kwenye majani na kinyesi kwenye moyo wa mmea. Dhibiti mapema kwa kutumia dawa za wadudu zenye Emamectin benzoate au Spinetoram. Nyunyiza dawa wakati wa asubuhi sana au jioni viwavi wanapokuwa nje ya kujificha.',
    category: 'pest',
    tags: ['maize', 'mahindi', 'pest', 'armyworm'],
  },
  {
    title: 'Soko la Mahindi (Maize Market Insights)',
    content:
      'Bei ya mahindi ina mwelekeo wa kupanda kati ya mwezi Novemba hadi Februari kutokana na uhaba wa chakula. Wakulima wanashauriwa kuhifadhi mahindi vizuri baada ya kuvuna kwa kutumia mifuko inayoondoa hewa (hermetic bags) ili kusubiri bei nzuri ya soko.',
    category: 'market',
    tags: ['market', 'maize', 'mahindi', 'price'],
  },
];

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

async function seed() {
  console.log('Starting knowledge base seeding with OpenAI embeddings...');

  for (const item of KNOWLEDGE_ITEMS) {
    try {
      const embedding = await generateEmbedding(item.title + '\n' + item.content);

      const { error } = await supabase.from('knowledge_base').insert({
        title: item.title,
        content: item.content,
        embedding: embedding,
        metadata: {
          category: item.category,
          tags: item.tags,
          source: 'Kilimo AI Manual',
        },
      });

      if (error) {
        console.error(`Error inserting ${item.title}:`, error);
      } else {
        console.log(`✅ Seeded: ${item.title}`);
      }
    } catch (err) {
      console.error(`Failed to process ${item.title}:`, err);
    }
  }

  console.log('Finished seeding!');
}

seed();
