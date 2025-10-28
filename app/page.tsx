import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Zap, Rocket, Code, FileText, Palette, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { ScrollAnimations } from "@/components/scroll-animations"
import { SplineScene } from "@/components/ui/spline-scene"
import { Spotlight } from "@/components/ui/spotlight"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollAnimations />
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between p-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Ignitia</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20"
          data-parallax="0.5"
        />
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <div className="relative p-8">
          <div className="grid gap-8 py-24 md:py-32 lg:py-40 lg:grid-cols-2 lg:items-center">
            {/* Left content */}
            <div className="flex flex-col gap-8">
              <div className="animate-slideDown inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">AI-Powered Startup Builder</span>
              </div>
              <h1 className="animate-slideUp max-w-2xl text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Transform Your Ideas Into{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Complete Brands
                </span>
              </h1>
              <p className="animate-slideUp delay-100 max-w-xl text-pretty text-lg text-muted-foreground md:text-lg">
                Ignitia uses advanced AI to generate comprehensive startup details, professional landing pages, and
                complete branding - all from a single idea.
              </p>
              <div className="animate-slideUp delay-200 flex flex-col gap-4 sm:flex-row">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 transition-all hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-lg"
                  >
                    <Rocket className="h-5 w-5" />
                    Start Building Free
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="transition-all hover:scale-105 bg-transparent">
                    See How It Works
                  </Button>
                </a>
              </div>
              <div className="animate-slideUp delay-300 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Instant results</span>
                </div>
              </div>
            </div>

            {/* Right content - Spline 3D Scene */}
            <div className="relative hidden h-[500px] lg:block">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 px-8">
        <div className="mb-16 text-center">
          <div className="animate-fadeIn inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Powerful Features</span>
          </div>
          <h2 className="animate-slideUp mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Everything You Need to Launch
          </h2>
          <p className="animate-slideUp delay-100 mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            From concept to complete brand identity in minutes, not months
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            className="animate-scaleIn delay-100 border-2 transition-all hover:border-blue-200 hover:shadow-lg dark:hover:border-blue-800"
            data-scroll-animate="scale"
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">AI-Generated Details</h3>
              <p className="text-muted-foreground">
                Get comprehensive startup details including name, tagline, description, target audience, and key
                features instantly.
              </p>
            </CardContent>
          </Card>
          <Card
            className="animate-scaleIn delay-200 border-2 transition-all hover:border-purple-200 hover:shadow-lg dark:hover:border-purple-800"
            data-scroll-animate="scale"
            style={{ animationDelay: "100ms" }}
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Landing Page Code</h3>
              <p className="text-muted-foreground">
                Receive production-ready HTML landing pages with modern design and responsive layouts you can deploy
                immediately.
              </p>
            </CardContent>
          </Card>
          <Card
            className="animate-scaleIn delay-300 border-2 transition-all hover:border-pink-200 hover:shadow-lg dark:hover:border-pink-800"
            data-scroll-animate="scale"
            style={{ animationDelay: "200ms" }}
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-pink-600">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Custom Branding</h3>
              <p className="text-muted-foreground">
                AI-selected color schemes and design elements that match your startup's personality and target market.
              </p>
            </CardContent>
          </Card>
          <Card
            className="animate-scaleIn delay-400 border-2 transition-all hover:border-green-200 hover:shadow-lg dark:hover:border-green-800"
            data-scroll-animate="scale"
            style={{ animationDelay: "300ms" }}
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Export Options</h3>
              <p className="text-muted-foreground">
                Download your pitch as a PDF or export your landing page as HTML to use anywhere you need.
              </p>
            </CardContent>
          </Card>
          <Card
            className="animate-scaleIn delay-500 border-2 transition-all hover:border-orange-200 hover:shadow-lg dark:hover:border-orange-800"
            data-scroll-animate="scale"
            style={{ animationDelay: "400ms" }}
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Save & Iterate</h3>
              <p className="text-muted-foreground">
                Store all your generations in your dashboard and refine your ideas over time with unlimited iterations.
              </p>
            </CardContent>
          </Card>
          <Card
            className="animate-scaleIn delay-600 border-2 transition-all hover:border-blue-200 hover:shadow-lg dark:hover:border-blue-800"
            data-scroll-animate="scale"
            style={{ animationDelay: "500ms" }}
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Launch Ready</h3>
              <p className="text-muted-foreground">
                Get everything you need to validate your idea and start building your MVP with confidence.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="how-it-works" className="relative overflow-hidden bg-muted/50 py-24 md:py-32">
        <div className="px-8">
          <div className="mb-16 text-center">
            <div className="animate-fadeIn inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm">
              <Rocket className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Simple Process</span>
            </div>
            <h2 className="animate-slideUp mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
              How It Works
            </h2>
            <p className="animate-slideUp delay-100 mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
              Launch your startup in three simple steps
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div
              className="animate-slideUp delay-100 relative flex flex-col items-center text-center"
              data-scroll-animate="left"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-bold text-white shadow-lg transition-all hover:scale-110">
                1
              </div>
              <h3 className="mb-3 text-xl font-semibold">Describe Your Idea</h3>
              <p className="text-muted-foreground">
                Simply enter your startup idea or business concept. Be as detailed or brief as you like.
              </p>
            </div>
            <div
              className="animate-slideUp delay-200 relative flex flex-col items-center text-center"
              data-scroll-animate
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-2xl font-bold text-white shadow-lg transition-all hover:scale-110">
                2
              </div>
              <h3 className="mb-3 text-xl font-semibold">AI Generates Everything</h3>
              <p className="text-muted-foreground">
                Our AI creates your startup name, branding, landing page, and complete business details in seconds.
              </p>
            </div>
            <div
              className="animate-slideUp delay-300 relative flex flex-col items-center text-center"
              data-scroll-animate="right"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-2xl font-bold text-white shadow-lg transition-all hover:scale-110">
                3
              </div>
              <h3 className="mb-3 text-xl font-semibold">Export & Launch</h3>
              <p className="text-muted-foreground">
                Download your materials, refine as needed, and launch your startup with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 md:py-32 px-8">
        <Card
          className="animate-slideUp border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 dark:border-blue-800 dark:from-blue-950/20 dark:to-purple-950/20"
          data-scroll-animate="scale"
        >
          <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Free to Start
            </div>
            <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Ready to Build Your Startup?</h2>
            <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
              Join entrepreneurs who are using AI to turn their ideas into reality. Start for free today - no credit
              card required.
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 transition-all hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-lg"
              >
                <Sparkles className="h-5 w-5" />
                Get Started Now
              </Button>
            </Link>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Unlimited generations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Export to PDF & HTML</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Save to dashboard</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-auto border-t border-border/40 bg-muted/50 py-12">
        <div className="px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col items-center gap-4 md:items-start">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Ignitia</span>
              </Link>
              <p className="text-sm text-muted-foreground">Built with AI for entrepreneurs</p>
            </div>
            <div className="flex flex-col items-center gap-4 md:items-end">
              <nav className="flex gap-6">
                <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  How It Works
                </a>
                <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Pricing
                </a>
              </nav>
              <p className="text-sm text-muted-foreground">© 2025 Ignitia. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
