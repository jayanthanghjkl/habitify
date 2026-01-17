import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Brain, Layers, Layout, Zap } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Dashboard from "./dashboard/page";

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Glossy Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Habitify
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Abstract Glossy Shapes (Background) */}
          <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 opacity-50 blur-3xl filter" />

          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-3xl space-y-6">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Your Sanctuary for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-600">
                  Deep Focus
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                Organize your life, track your mood, and find clarity.
                A personalized all-in-one workspace manager designed for professionals.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/sign-up">
                  <Button size="lg" className="h-12 px-8 text-lg">
                    Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto py-16 px-4 md:py-24">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-shadow hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Daily Inspiration</h3>
              <p className="text-muted-foreground">
                Start every day with a curated motivational quote to set the right tone for your work.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-shadow hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Deep Focus Mode</h3>
              <p className="text-muted-foreground">
                A distraction-free interface with a calming "Deep Focus" color palette designed to reduce eye strain.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-shadow hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layout className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Mood Tracker</h3>
              <p className="text-muted-foreground">
                Reflect on your mental state with our built-in mood selector. Track your energy levels over time.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Zenith Workspace. Built for professionals.
        </div>
      </footer>
    </div>
  );
}


export default async function Home() {
  let user = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (!error) {
      user = data?.user ?? null;
    } else {
      console.warn("Supabase auth.getUser error on /:", error);
    }
  } catch (error) {
    // This suppresses errors during build if env vars are missing or auth fails
    console.warn("Auth check failed during build for /:", error);
  }

  if (user) {
    return <Dashboard />;
  }

  return <LandingPage />;
}
