import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DocsPage() {
  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Button>
        </Link>
        <div className="space-y-8">
          <h1 className="text-4xl sm:text-5xl font-bold">Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Documentation is coming soon. Check back later for guides, API
            references, and more.
          </p>
        </div>
      </div>
    </main>
  );
}
