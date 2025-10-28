import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

async function createRouteClient(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? ""

  // parse cookies into [{ name, value }]
  const parsed = cookieHeader
    .split(";")
    .filter(Boolean)
    .map((cookie) => {
      const [name, ...rest] = cookie.trim().split("=")
      return { name, value: rest.join("=") }
    })

  // adapter object using the modern getAll / setAll API expected by createServerClient
  const cookieAdapter = {
    getAll() {
      // return array of { name, value } (same shape auth expects)
      return parsed
    },
    // setAll may be called by the client for token refresh — noop here
    // If you need to persist cookies from Supabase, collect these and set
    // `Set-Cookie` headers on the Response returned from the route.
    setAll(_cookies: { name: string; value: string }[]) {
      /* intentionally noop for now */
    },
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieAdapter,
    }
  )
}

export async function DELETE(request: Request, context: any) {
  try {
    // params in app route handlers can be a Promise — await it
    const params = await context.params
    const { id } = params

    const supabase = await createRouteClient(request)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Unauthorized delete:", userError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("generations")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Supabase delete error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete generation" }, { status: 500 })
  }
}