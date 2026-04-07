import AnimeForm from '@/components/admin/anime-form';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Create Anime - Admin Dashboard',
  description: 'Create a new anime entry',
};

export default async function CreateAnimePage() {
  const supabase = await createClient();

  // Fetch genres for the form
  const { data: genres } = await supabase
    .from('genres')
    .select('id, name, slug')
    .order('name');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Anime</h1>
        <p className="text-muted-foreground mt-1">Add a new anime to the database</p>
      </div>

      <AnimeForm genres={genres || []} />
    </div>
  );
}
