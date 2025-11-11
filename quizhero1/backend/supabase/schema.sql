-- Supabase schema for QuizHero
-- Run this in Supabase SQL editor.

-- App profiles (auth.users exists already)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Quizzes
create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  thumbnail_url text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Questions (supports 4 options + image)
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id) on delete cascade,
  text text,
  image_url text,
  option1 text,
  option2 text,
  option3 text,
  option4 text,
  correct_index int check (correct_index between 1 and 4),
  points int default 1,
  created_at timestamptz default now()
);

-- Attempts per play
create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  quiz_id uuid references quizzes(id),
  score int not null,
  total int not null,
  duration_seconds int,
  created_at timestamptz default now()
);

-- Leaderboard materialized view
drop materialized view if exists leaderboard;
create materialized view leaderboard as
select quiz_id, user_id, max(score) as best_score, min(created_at) as first_achieved
from attempts
group by quiz_id, user_id
order by best_score desc;
