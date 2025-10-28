"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { DashboardContent } from "@/components/dashboard-content"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [generations, setGenerations] = useState<any[]>([])
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      const { data } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setGenerations(data || [])
    }

    getUserData()
  }, [])

  if (!user) return <p className="text-center mt-20">Loading...</p>

  return (
    <div className="flex min-h-screen flex-col justify-center">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-8">
          <span className="text-xl font-bold">Ignitia</span>
          <nav className="flex items-center gap-4">
            <a href="/generate" className="text-sm font-medium hover:text-primary">
              Generate New
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
        <DashboardContent initialGenerations={generations} />
      </main>
    </div>
  )
}
