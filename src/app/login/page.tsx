import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-card p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to continue to SUBFLIX
          </p>
        </div>
        <div className="space-y-4 text-center text-sm text-muted">
          <p>Full authentication will be implemented in the next phase.</p>
          <Button asChild className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
