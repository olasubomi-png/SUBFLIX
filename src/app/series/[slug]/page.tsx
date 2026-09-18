import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Calendar, Globe, Star, Clock } from "lucide-react";
import { getSeriesBySlug } from "@/lib/catalog";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const item = await getSeriesBySlug(slug);
    if (!item) return { title: "Series Not Found | SUBFLIX" };
    return {
      title: `${item.title} | SUBFLIX`,
      description: item.description ?? `Watch ${item.title} on SUBFLIX`,
    };
  } catch {
    return { title: "Series | SUBFLIX" };
  }
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params;

  let item;
  try {
    item = await getSeriesBySlug(slug);
  } catch (e) {
    console.error("[series detail]", e);
    notFound();
  }

  if (!item) notFound();

  const backdrop =
    item.backdropUrl ||
    item.posterUrl ||
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop";
  const poster =
    item.posterUrl ||
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop";

  return (
    <div className="flex flex-col">
      <div className="relative h-[50vh] min-h-[320px] w-full sm:h-[60vh]">
        <Image
          src={backdrop}
          alt={item.title}
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
          <div className="relative mx-auto h-64 w-44 flex-shrink-0 overflow-hidden rounded-xl shadow-2xl shadow-black/50 sm:h-80 sm:w-56 md:mx-0">
            <Image
              src={poster}
              alt={item.title}
              fill
              className="object-cover"
              sizes="224px"
            />
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted md:justify-start">
              {item.releaseYear && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {item.releaseYear}
                </span>
              )}
              {item.ageRating && (
                <span className="rounded border border-white/20 px-2 py-0.5 text-xs">
                  {item.ageRating}
                </span>
              )}
              {item.language && (
                <span className="flex items-center gap-1 uppercase">
                  <Globe className="h-4 w-4" />
                  {item.language}
                </span>
              )}
              {item.rating != null && item.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {Number(item.rating).toFixed(1)}
                </span>
              )}
              {item.seasons.length > 0 && (
                <span>
                  {item.seasons.length} season
                  {item.seasons.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {item.genres && item.genres.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                {item.genres.map((g) => (
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

            {item.description && (
              <p className="max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
                {item.description}
              </p>
            )}

            {item.trailerUrl && (
              <div className="flex justify-center pt-2 md:justify-start">
                <Button asChild variant="secondary" size="lg">
                  <a
                    href={item.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch Trailer
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Seasons & Episodes */}
        {item.seasons.length > 0 ? (
          <section className="mt-16 space-y-10">
            {item.seasons.map((season) => (
              <div key={season.id} className="space-y-4">
                <h2 className="text-xl font-bold text-white">
                  {season.title || `Season ${season.seasonNumber}`}
                </h2>
                {season.description && (
                  <p className="text-sm text-muted">{season.description}</p>
                )}

                {season.episodes && season.episodes.length > 0 ? (
                  <div className="space-y-2">
                    {season.episodes.map((ep) => (
                      <div
                        key={ep.id}
                        className="flex items-center gap-4 rounded-xl border border-white/5 bg-card p-3 transition-colors hover:bg-card-hover sm:p-4"
                      >
                        <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-card-hover sm:h-20 sm:w-36">
                          {ep.thumbnailUrl ? (
                            <Image
                              src={ep.thumbnailUrl}
                              alt={ep.title}
                              fill
                              className="object-cover"
                              sizes="144px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted">
                              <Play className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-violet-400">
                              E{ep.episodeNumber}
                            </span>
                            <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                              {ep.title}
                            </h3>
                          </div>
                          {ep.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-muted sm:text-sm">
                              {ep.description}
                            </p>
                          )}
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted">
                            {ep.runtime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {ep.runtime} min
                              </span>
                            )}
                            {ep.releaseDate && (
                              <span>
                                {new Date(ep.releaseDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {ep.videoUrl && (
                          <Button size="sm" variant="secondary" className="flex-shrink-0 gap-1">
                            <Play className="h-3.5 w-3.5 fill-current" />
                            Play
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">
                    No published episodes in this season yet.
                  </p>
                )}
              </div>
            ))}
          </section>
        ) : (
          <p className="mt-12 text-center text-muted">
            Seasons and episodes will appear here once published.
          </p>
        )}
      </div>
    </div>
  );
}
