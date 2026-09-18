import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Clock, Calendar, Globe, Star } from "lucide-react";
import {
  getMovieBySlug,
  getRelatedMovies,
} from "@/lib/catalog";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const movie = await getMovieBySlug(slug);
    if (!movie) return { title: "Movie Not Found | SUBFLIX" };
    return {
      title: `${movie.title} | SUBFLIX`,
      description: movie.description ?? `Watch ${movie.title} on SUBFLIX`,
    };
  } catch {
    return { title: "Movie | SUBFLIX" };
  }
}

export default async function MovieDetailPage({ params }: Props) {
  const { slug } = await params;

  let movie;
  try {
    movie = await getMovieBySlug(slug);
  } catch (e) {
    console.error("[movie detail]", e);
    notFound();
  }

  if (!movie) notFound();

  const genreIds = movie.genres?.map((g) => g.id) ?? [];
  let related: Awaited<ReturnType<typeof getRelatedMovies>> = [];
  try {
    related = await getRelatedMovies(movie.id, genreIds, 6);
  } catch {
    // non-critical
  }

  const backdrop =
    movie.backdropUrl ||
    movie.posterUrl ||
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop";
  const poster =
    movie.posterUrl ||
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop";

  return (
    <div className="flex flex-col">
      {/* Hero backdrop */}
      <div className="relative h-[50vh] min-h-[320px] w-full sm:h-[60vh]">
        <Image
          src={backdrop}
          alt={movie.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto -mt-40 w-full max-w-7xl px-4 pb-16 sm:-mt-48 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end">
          {/* Poster */}
          <div className="relative mx-auto h-64 w-44 flex-shrink-0 overflow-hidden rounded-xl shadow-2xl shadow-black/50 sm:h-80 sm:w-56 md:mx-0">
            <Image
              src={poster}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="224px"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted md:justify-start">
              {movie.releaseYear && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {movie.releaseYear}
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {movie.runtime} min
                </span>
              )}
              {movie.ageRating && (
                <span className="rounded border border-white/20 px-2 py-0.5 text-xs">
                  {movie.ageRating}
                </span>
              )}
              {movie.language && (
                <span className="flex items-center gap-1 uppercase">
                  <Globe className="h-4 w-4" />
                  {movie.language}
                </span>
              )}
              {movie.rating != null && movie.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {Number(movie.rating).toFixed(1)}
                </span>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                {movie.genres.map((g) => (
                  <Link
                    key={g.id}
                    href={`/genres/${g.slug}`}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-600/30"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {movie.description && (
              <p className="max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
                {movie.description}
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-3 pt-2 md:justify-start">
              {movie.videoUrl ? (
                <Button size="lg" className="gap-2">
                  <Play className="h-5 w-5 fill-current" />
                  Play
                </Button>
              ) : (
                <Button size="lg" className="gap-2" disabled>
                  <Play className="h-5 w-5 fill-current" />
                  Coming Soon
                </Button>
              )}
              {movie.trailerUrl && (
                <Button asChild variant="secondary" size="lg">
                  <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
                    Watch Trailer
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 space-y-6">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              More like this
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {related.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
