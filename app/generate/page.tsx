"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { GeneratorForm } from "@/components/generator-form"

export default function GeneratePage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)
    }

    checkUser()
  }, [])

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Ignitia</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </a>
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                router.push("/auth/login")
              }}
              className="text-sm font-medium hover:text-primary"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8 px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <div className="mb-8 w-full text-center">
            <h1 className="mb-2 text-3xl font-bold">Generate Your Startup</h1>
            <p className="text-muted-foreground">
              Describe your startup idea and let AI create comprehensive details and a landing page for you.
            </p>
          </div>
          <div className="w-full">
            <GeneratorForm userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
