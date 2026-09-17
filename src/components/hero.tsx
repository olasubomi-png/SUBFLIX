import Link from "next/link";
import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden sm:min-h-[75vh] lg:min-h-[85vh]">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop)",
          }}
        />
        {/* Multi-layer gradients for cinematic feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-transparent to-purple-900/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full min-h-[70vh] items-end pb-16 sm:min-h-[75vh] sm:pb-20 lg:min-h-[85vh] lg:pb-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-5 sm:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              Now Streaming
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Stream. Download.
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Watch Anywhere.
              </span>
            </h1>

            <p className="max-w-lg text-base text-gray-300 sm:text-lg">
              Discover the best movies and series. Stream in stunning quality or
              download for offline viewing — anytime, anywhere.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="gap-2 shadow-lg shadow-violet-900/40">
                <Link href="/browse">
                  <Play className="h-5 w-5 fill-current" />
                  Start Watching
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="gap-2">
                <Link href="/movies">
                  <Info className="h-5 w-5" />
                  Explore Movies
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
