-- ============================================================
-- MEDIREAD AI / MEDMATCH RESCUE - SUPABASE DATABASE MIGRATION
-- Table: public.medicines (Medicine Knowledge Base Catalog)
-- ============================================================

-- Step 4: Create public.medicines table
create table if not exists public.medicines (
  id uuid primary key default gen_random_uuid(),

  generic_name text not null,
  brand_name text,

  strength text,
  dosage_form text,

  manufacturer text,

  aliases text[] default '{}',

  normalized_name text,
  normalized_manufacturer text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Step 5: Enable Row Level Security (RLS)
alter table public.medicines enable row level security;

-- Create read-only select policy for anonymous users
create policy "Public can read medicine catalog"
on public.medicines
for select
to anon
using (true);

-- Step 6: Add Initial Realistic Seed Data (17 Medicines)
insert into public.medicines (
  generic_name, 
  brand_name, 
  strength, 
  dosage_form, 
  manufacturer, 
  aliases, 
  normalized_name, 
  normalized_manufacturer
)
values
  ('Paracetamol', 'Calpol 500', '500 mg', 'Tablet', 'GlaxoSmithKline', ARRAY['acetaminophen', 'paracetamol 500', 'calpol', 'crocin'], 'paracetamol', 'glaxosmithkline'),
  ('Paracetamol', 'Crocin 650', '650 mg', 'Tablet', 'GlaxoSmithKline', ARRAY['paracetamol 650', 'crocin 650', 'crocin'], 'paracetamol', 'glaxosmithkline'),
  ('Paracetamol', 'Dolo 650', '650 mg', 'Tablet', 'Micro Labs Ltd', ARRAY['dolo', 'dolo650', 'paracetamol', 'micro dolo'], 'paracetamol', 'micro labs ltd'),
  ('Cetirizine Hydrochloride', 'Zyrtec', '10 mg', 'Tablet', 'UCB Pharma', ARRAY['cetirizine', 'cetzine', 'okacet', 'zyrtec 10'], 'cetirizine hydrochloride', 'ucb pharma'),
  ('Cetirizine Hydrochloride', 'Cetzine 10', '10 mg', 'Tablet', 'Dr. Reddys Laboratories', ARRAY['cetirizine', 'cetzine', 'dr reddy cetirizine'], 'cetirizine hydrochloride', 'dr reddys laboratories'),
  ('Azithromycin', 'Azithral 500', '500 mg', 'Tablet', 'Alembic Pharmaceuticals', ARRAY['azithromycin 500', 'azithral', 'azithromycin'], 'azithromycin', 'alembic pharmaceuticals'),
  ('Azithromycin', 'Zithromax', '250 mg', 'Capsule', 'Pfizer', ARRAY['azithromycin', 'zithromax 250', 'pfizer azithro'], 'azithromycin', 'pfizer'),
  ('Amoxicillin', 'Mox 500', '500 mg', 'Capsule', 'Sun Pharmaceutical Industries', ARRAY['amoxicillin 500', 'mox', 'mox 500 cap'], 'amoxicillin', 'sun pharmaceutical industries'),
  ('Amoxicillin', 'Amoxil', '250 mg', 'Tablet', 'GlaxoSmithKline', ARRAY['amoxicillin', 'amoxil 250', 'gsk amoxil'], 'amoxicillin', 'glaxosmithkline'),
  ('Amoxicillin and Potassium Clavulanate', 'Augmentin 625 DUO', '625 mg', 'Tablet', 'GlaxoSmithKline', ARRAY['augmentin', 'amoxyclav', 'clavam 625'], 'amoxicillin and potassium clavulanate', 'glaxosmithkline'),
  ('Ibuprofen', 'Brufen 400', '400 mg', 'Tablet', 'Abbott Healthcare', ARRAY['ibuprofen 400', 'brufen', 'advil'], 'ibuprofen', 'abbott healthcare'),
  ('Ibuprofen and Paracetamol', 'Combiflam', '400 mg', 'Tablet', 'Sanofi India', ARRAY['combiflam', 'ibuprofen paracetamol', 'sanofi combi'], 'ibuprofen and paracetamol', 'sanofi india'),
  ('Metformin Hydrochloride', 'Glycomet 500', '500 mg', 'Tablet', 'USV Private Limited', ARRAY['metformin', 'glycomet', 'glucophage'], 'metformin hydrochloride', 'usv private limited'),
  ('Pantoprazole Sodium', 'Pan 40', '40 mg', 'Tablet', 'Alkem Laboratories', ARRAY['pantoprazole', 'pan40', 'pantocid'], 'pantoprazole sodium', 'alkem laboratories'),
  ('Omeprazole', 'Omez 20', '20 mg', 'Capsule', 'Dr. Reddys Laboratories', ARRAY['omeprazole', 'omez 20', 'prilosec'], 'omeprazole', 'dr reddys laboratories'),
  ('Atorvastatin Calcium', 'Atorva 10', '10 mg', 'Tablet', 'Zydus Cadila', ARRAY['atorvastatin', 'lipitor', 'atorva'], 'atorvastatin calcium', 'zydus cadila'),
  ('Telmisartan', 'Telma 40', '40 mg', 'Tablet', 'Glenmark Pharmaceuticals', ARRAY['telmisartan', 'telma', 'micardis'], 'telmisartan', 'glenmark pharmaceuticals')
on conflict do nothing;
