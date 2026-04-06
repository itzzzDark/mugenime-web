import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // 1. Create genres
    const genres = [
      { name: 'Action', slug: 'action', description: 'Action packed anime with intense battles' },
      { name: 'Comedy', slug: 'comedy', description: 'Funny and lighthearted anime' },
      { name: 'Drama', slug: 'drama', description: 'Emotional and dramatic stories' },
      { name: 'Fantasy', slug: 'fantasy', description: 'Fantasy worlds and magical adventures' },
      { name: 'Romance', slug: 'romance', description: 'Love and romantic relationships' },
      { name: 'Sci-Fi', slug: 'sci-fi', description: 'Science fiction and futuristic themes' },
    ];

    const { error: genreError } = await supabase
      .from('genres')
      .insert(genres)
      .select();

    if (genreError && !genreError.message.includes('duplicate')) {
      console.error('Error inserting genres:', genreError);
    } else {
      console.log('Genres inserted successfully');
    }

    // 2. Create sample animes
    const animes = [
      {
        title: 'Attack on Titan',
        slug: 'attack-on-titan',
        japanese_title: '進撃の巨人',
        synopsis: 'Humanity fights for survival against giant humanoid creatures called Titans.',
        poster_url: 'https://via.placeholder.com/300x400?text=Attack+on+Titan',
        banner_url: 'https://via.placeholder.com/1200x400?text=Attack+on+Titan',
        status: 'completed',
        type: 'TV',
        episodes_count: 139,
        score: 9.0,
        year: 2013,
        season: 'Spring',
        duration: 24,
        studios: 'WIT Studio, MAPPA',
        producers: 'Kodansha',
        source: 'Manga',
        rating: 'PG-13',
        is_featured: true,
        is_active: true,
      },
      {
        title: 'Demon Slayer',
        slug: 'demon-slayer',
        japanese_title: '鬼滅の刃',
        synopsis: 'A young boy becomes a demon slayer to save his sister who turned into a demon.',
        poster_url: 'https://via.placeholder.com/300x400?text=Demon+Slayer',
        banner_url: 'https://via.placeholder.com/1200x400?text=Demon+Slayer',
        status: 'ongoing',
        type: 'TV',
        episodes_count: 55,
        score: 8.8,
        year: 2019,
        season: 'Spring',
        duration: 24,
        studios: 'ufotable',
        producers: 'Aniplex',
        source: 'Manga',
        rating: 'PG-13',
        is_featured: true,
        is_active: true,
      },
      {
        title: 'Steins;Gate',
        slug: 'steinsgate',
        japanese_title: 'シュタインズ・ゲート',
        synopsis: 'A group of friends discover they can send messages to the past and change history.',
        poster_url: 'https://via.placeholder.com/300x400?text=Steins+Gate',
        banner_url: 'https://via.placeholder.com/1200x400?text=Steins+Gate',
        status: 'completed',
        type: 'TV',
        episodes_count: 24,
        score: 9.1,
        year: 2011,
        season: 'Spring',
        duration: 24,
        studios: 'White Fox',
        producers: 'Bandai',
        source: 'Visual Novel',
        rating: 'PG-13',
        is_featured: true,
        is_active: true,
      },
    ];

    const { data: animeData, error: animeError } = await supabase
      .from('animes')
      .insert(animes)
      .select();

    if (animeError && !animeError.message.includes('duplicate')) {
      console.error('Error inserting animes:', animeError);
    } else {
      console.log('Animes inserted successfully');
    }

    // 3. Link animes to genres
    if (animeData && animeData.length > 0) {
      const animeGenreLinks = [];

      // Get all genres
      const { data: allGenres } = await supabase.from('genres').select('id, slug');

      // Attack on Titan: Action, Drama, Fantasy
      const aot = animeData[0];
      const actionGenre = allGenres?.find(g => g.slug === 'action');
      const dramaGenre = allGenres?.find(g => g.slug === 'drama');
      const fantasyGenre = allGenres?.find(g => g.slug === 'fantasy');

      if (actionGenre) animeGenreLinks.push({ anime_id: aot.id, genre_id: actionGenre.id });
      if (dramaGenre) animeGenreLinks.push({ anime_id: aot.id, genre_id: dramaGenre.id });
      if (fantasyGenre) animeGenreLinks.push({ anime_id: aot.id, genre_id: fantasyGenre.id });

      // Demon Slayer: Action, Fantasy
      const ds = animeData[1];
      if (actionGenre) animeGenreLinks.push({ anime_id: ds.id, genre_id: actionGenre.id });
      if (fantasyGenre) animeGenreLinks.push({ anime_id: ds.id, genre_id: fantasyGenre.id });

      // Steins;Gate: Sci-Fi, Drama
      const sg = animeData[2];
      const scifiGenre = allGenres?.find(g => g.slug === 'sci-fi');
      if (scifiGenre) animeGenreLinks.push({ anime_id: sg.id, genre_id: scifiGenre.id });
      if (dramaGenre) animeGenreLinks.push({ anime_id: sg.id, genre_id: dramaGenre.id });

      const { error: linkError } = await supabase
        .from('anime_genres')
        .insert(animeGenreLinks)
        .select();

      if (linkError && !linkError.message.includes('duplicate')) {
        console.error('Error linking animes to genres:', linkError);
      } else {
        console.log('Anime genres linked successfully');
      }

      // 4. Create sample episodes
      const episodes = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 1; j <= 5; j++) {
          const animeTitle = animeData[i].title;
          episodes.push({
            anime_id: animeData[i].id,
            episode_number: j,
            title: `${animeTitle} Episode ${j}`,
            slug: `${animeData[i].slug}-ep-${j}`,
            description: `This is episode ${j} of ${animeTitle}`,
            duration: 24,
            is_active: true,
          });
        }
      }

      const { data: episodeData, error: episodeError } = await supabase
        .from('episodes')
        .insert(episodes)
        .select();

      if (episodeError && !episodeError.message.includes('duplicate')) {
        console.error('Error inserting episodes:', episodeError);
      } else {
        console.log('Episodes inserted successfully');
      }

      // 5. Create sample download links
      if (episodeData && episodeData.length > 0) {
        const downloadLinks = [];
        const qualities = ['360p', '480p', '720p', '1080p'];

        for (const episode of episodeData.slice(0, 15)) {
          for (const quality of qualities) {
            downloadLinks.push({
              episode_id: episode.id,
              quality: quality,
              size: `${quality === '360p' ? 200 : quality === '480p' ? 350 : quality === '720p' ? 600 : 1200}MB`,
              url: `https://example.com/download/${episode.slug}/${quality}`,
              provider: 'Example Provider',
              is_active: true,
            });
          }
        }

        const { error: downloadError } = await supabase
          .from('download_links')
          .insert(downloadLinks)
          .select();

        if (downloadError && !downloadError.message.includes('duplicate')) {
          console.error('Error inserting download links:', downloadError);
        } else {
          console.log('Download links inserted successfully');
        }
      }
    }

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

seedDatabase();
