import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-black text-violet-500">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-white">Page not found</h2>
      <p className="mt-2 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/movies">Browse Movies</Link>
        </Button>
      </div>
    </div>
  );
}
