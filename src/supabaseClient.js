import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://osyfpkwepzhonzfmzhre.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zeWZwa3dlcHpob256Zm16aHJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzMDQ2NTUsImV4cCI6MjA1NDg4MDY1NX0.MKTLpTP_TPUicy_vCdHjxq7IpIWc9nvbkFsoahnv4iE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
