-- Enable pgvector and pg_cron
create extension if not exists vector;
create extension if not exists pg_cron;

-- 1. Knowledge Base Table (For RAG)
create table if not exists public.knowledge_base (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    content text not null,
    category text not null, -- e.g., 'crop_disease', 'weather_pattern', 'market_info'
    region text, -- Optional geographic targeting
    embedding vector(1536), -- Assuming OpenAI text-embedding-3-small or similar
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Index for fast vector similarity search (IVFFlat or HNSW)
create index if not exists knowledge_base_embedding_idx 
on public.knowledge_base 
using hnsw (embedding vector_cosine_ops);

-- RAG Search Function
create or replace function match_knowledge(query_embedding vector(1536), match_threshold float, match_count int)
returns table (
    id uuid,
    title text,
    content text,
    category text,
    similarity float
)
language sql stable
as $$
  select
    knowledge_base.id,
    knowledge_base.title,
    knowledge_base.content,
    knowledge_base.category,
    1 - (knowledge_base.embedding <=> query_embedding) as similarity
  from knowledge_base
  where 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  order by knowledge_base.embedding <=> query_embedding
  limit match_count;
$$;

-- 2. Notification Preferences
create table if not exists public.user_notification_preferences (
    user_id uuid primary key references auth.users(id) on delete cascade,
    push_token text, -- Expo Push Token
    allow_push boolean default true,
    allow_sms boolean default false,
    quiet_hours_start time default '22:00',
    quiet_hours_end time default '06:00',
    weather_alerts boolean default true,
    market_alerts boolean default true,
    daily_insights boolean default true,
    last_insight_sent_at timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_notification_preferences enable row level security;
create policy "Users can view their own preferences" on public.user_notification_preferences for select using (auth.uid() = user_id);
create policy "Users can update their own preferences" on public.user_notification_preferences for update using (auth.uid() = user_id);

-- 3. Notification History (To prevent spam)
create table if not exists public.user_notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    title text not null,
    body text not null,
    type text not null, -- 'insight', 'weather_alert', 'task_reminder', 'market_alert'
    status text default 'sent', -- 'sent', 'failed', 'delivered', 'read'
    delivery_method text not null, -- 'push', 'sms'
    created_at timestamp with time zone default now()
);

alter table public.user_notifications enable row level security;
create policy "Users can view their own notifications" on public.user_notifications for select using (auth.uid() = user_id);

-- 4. Setup Cron Job to trigger edge function every 4 hours
-- This assumes the pg_net extension is available to call edge functions from postgres,
-- or Supabase cron triggers the function via an HTTP POST.
-- We use a pg_cron job to call the Supabase Edge Function 'process-notifications'.

-- create extension if not exists pg_net;
-- select cron.schedule(
--   'invoke-process-notifications',
--   '0 */4 * * *', -- Every 4 hours
--   $$
--   select net.http_post(
--       url:='https://your-project-ref.supabase.co/functions/v1/process-notifications',
--       headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
--   )
--   $$
-- );
