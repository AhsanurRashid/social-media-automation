import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex flex-col items-center gap-8 text-center px-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Next.js + shadcn/ui
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Your new app is ready. Start building with Next.js App Router and
          shadcn/ui components.
        </p>
        <div className="flex gap-4">
          {/* link to dashboard page */}
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
          <Button variant="outline">Learn More</Button>
        </div>
      </main>
    </div>
  );
}
