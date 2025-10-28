import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { ideaInput, startupName, tagline, description, targetAudience, keyFeatures, colorScheme, landingPageHtml } =
      body

    // Insert generation into database
    const { data, error } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        idea_input: ideaInput,
        startup_name: startupName,
        tagline,
        description,
        target_audience: targetAudience,
        key_features: keyFeatures,
        color_scheme: colorScheme,
        landing_page_html: landingPageHtml,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save generation" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json({ error: "Failed to save generation" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's generations
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch generations" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch generations" }, { status: 500 })
  }
}
