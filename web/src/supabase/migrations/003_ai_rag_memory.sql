-- ============================================================================
-- KILIMO AGRI-AI SUITE - AI RAG Memory (pgvector)
-- ============================================================================
-- Migration: 003_ai_rag_memory
-- Purpose: Store farm events, diagnosis, and chat history as vectors for session continuity
-- ============================================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. AI MEMORY TABLE
CREATE TABLE IF NOT EXISTS ai_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding vector(1536), -- Designed for OpenAI (1536) or Claude-adjacent embeddings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for semantic similarity search
CREATE INDEX IF NOT EXISTS ai_memory_embedding_idx ON ai_memory 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

COMMENT ON TABLE ai_memory IS 'Stores user-specific farm context and history as vector embeddings for RAG retrieval';

-- 2. HELPER FUNCTION: SEARCH MEMORY
CREATE OR REPLACE FUNCTION search_ai_memory(
  p_user_id TEXT,
  p_query_embedding vector(1536),
  p_match_threshold FLOAT,
  p_match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ai_memory.id,
    ai_memory.content,
    ai_memory.metadata,
    1 - (ai_memory.embedding <=> p_query_embedding) AS similarity
  FROM ai_memory
  WHERE ai_memory.user_id = p_user_id
    AND 1 - (ai_memory.embedding <=> p_query_embedding) > p_match_threshold
  ORDER BY ai_memory.embedding <=> p_query_embedding
  LIMIT p_match_count;
END;
$$;

-- 3. HELPER FUNCTION: ADD MEMORY
CREATE OR REPLACE FUNCTION add_ai_memory(
  p_user_id TEXT,
  p_content TEXT,
  p_metadata JSONB,
  p_embedding vector(1536)
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO ai_memory (user_id, content, metadata, embedding)
  VALUES (p_user_id, p_content, p_metadata, p_embedding)
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$;

-- END OF MIGRATION
