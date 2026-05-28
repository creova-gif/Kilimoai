import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables from .env
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Sample raw data to seed the knowledge base
const sampleKnowledge = [
  {
    title: 'Mahindi Planting Guidelines',
    category: 'crop_planning',
    region: 'Tanzania',
    content: 'For optimal yield, plant Maize (Mahindi) at the onset of the long rains (Mvua za Masika) typically in mid-March. Apply NPK 23:23:0 basal fertilizer at a rate of 50kg per acre during planting. Space rows 75cm apart and seeds 30cm apart.'
  },
  {
    title: 'Fall Armyworm Treatment',
    category: 'crop_disease',
    region: 'East Africa',
    content: 'Fall Armyworm (Viwavi Jeshi) primarily attacks maize. Early detection is key. Treatment involves applying registered insecticides such as Emamectin benzoate or Spinetoram into the funnel of the plant. Spray early morning or late evening.'
  },
  {
    title: 'Market Trends Q3',
    category: 'market_info',
    region: 'Arusha',
    content: 'Due to reduced rainfall in the northern circuit, tomato prices in Arusha wholesale markets are expected to spike in October. Farmers are advised to harvest and transport early to capture premium prices before the central market gets flooded.'
  }
];

async function generateEmbeddingsAndInsert() {
  console.log('Generating embeddings and inserting into pgvector...');
  
  for (const item of sampleKnowledge) {
    try {
      // 1. Generate Embedding
      console.log(`Processing: ${item.title}`);
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: item.content,
      });
      const embedding = embeddingResponse.data[0].embedding;

      // 2. Insert into Supabase
      const { error } = await supabase.from('knowledge_base').insert({
        title: item.title,
        content: item.content,
        category: item.category,
        region: item.region,
        embedding: embedding,
      });

      if (error) {
        console.error(`Failed to insert ${item.title}:`, error.message);
      } else {
        console.log(`Successfully added: ${item.title}`);
      }
    } catch (err) {
      console.error(`Error processing ${item.title}:`, err);
    }
  }
  console.log('Done!');
}

generateEmbeddingsAndInsert();
