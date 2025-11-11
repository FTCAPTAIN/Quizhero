# Supabase Setup (QuizHero)

1) Create a Supabase project → get URL and anon/service keys.
2) In the SQL editor, paste `schema.sql` and run.
3) Create a Storage bucket named `questions` (public) for images.
4) Frontend usage (install client):
   npm i @supabase/supabase-js

Example (JS):
```
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON)

const { data: qs } = await supabase.from('questions').select('*').eq('quiz_id', '<QUIZ_ID>')

await supabase.from('attempts').insert({ user_id: user.id, quiz_id, score, total, duration_seconds })
```
