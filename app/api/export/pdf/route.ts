import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

async function createRouteClient(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? ""

  // parse "name=value; name2=value2" to [{ name, value }]
  const parsed = cookieHeader
    .split(";")
    .filter(Boolean)
    .map((cookie) => {
      const [name, ...rest] = cookie.trim().split("=")
      return { name, value: rest.join("=") }
    })

  // capture cookies Supabase may want to set (token refresh)
  let setCookies: { name: string; value: string }[] = []

  const cookieAdapter = {
    // expected by createServerClient in modern APIs
    getAll() {
      return parsed
    },
    // Supabase may call setAll during refresh; capture them to send back to client
    setAll(cookies: { name: string; value: string }[]) {
      setCookies = cookies
    },
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieAdapter,
    }
  )

  return { supabase, getSetCookies: () => setCookies }
}

export async function POST(request: Request) {
  try {
    const { supabase, getSetCookies } = await createRouteClient(request)

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const generationId = body?.generationId
    if (!generationId) {
      return NextResponse.json({ error: "generationId required" }, { status: 400 })
    }

    // Fetch the generation
    const { data: generation, error } = await supabase
      .from("generations")
      .select("*")
      .eq("id", generationId)
      .eq("user_id", user.id)
      .single()

    if (error || !generation) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 })
    }

    // Build HTML for PDF
    const pdfHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${generation.startup_name} - Startup Pitch</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;line-height:1.6;color:#1a1a1a;padding:60px;max-width:800px;margin:0 auto}
    .header{text-align:center;margin-bottom:60px;padding-bottom:30px;border-bottom:3px solid ${generation.color_scheme?.primary ?? "#000"}}
    .logo{font-size:48px;font-weight:bold;color:${generation.color_scheme?.primary ?? "#000"};margin-bottom:10px}
    .tagline{font-size:20px;font-style:italic;color:#666;margin-top:10px}
    .section{margin-bottom:40px}
    .section-title{font-size:24px;font-weight:bold;color:${generation.color_scheme?.primary ?? "#000"};margin-bottom:15px;padding-bottom:10px;border-bottom:2px solid #e0e0e0}
    .section-content{font-size:16px;color:#333;line-height:1.8}
    .features-list{list-style:none;padding-left:0}
    .features-list li{padding:12px 0;padding-left:30px;position:relative}
    .features-list li:before{content:"✓";position:absolute;left:0;color:${generation.color_scheme?.primary ?? "#000"};font-weight:bold;font-size:20px}
    .color-scheme{display:flex;gap:30px;margin-top:20px}
    .color-box{text-align:center}
    .color-swatch{width:100px;height:100px;border-radius:8px;margin-bottom:10px;border:2px solid #e0e0e0}
    .color-label{font-size:14px;color:#666;font-weight:500}
    .footer{margin-top:60px;padding-top:30px;border-top:2px solid #e0e0e0;text-align:center;color:#999;font-size:14px}
    @media print{body{padding:40px}}
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">${generation.startup_name}</div>
    <div class="tagline">${generation.tagline ?? ""}</div>
  </div>

  <div class="section">
    <h2 class="section-title">Executive Summary</h2>
    <p class="section-content">${generation.description ?? ""}</p>
  </div>

  <div class="section">
    <h2 class="section-title">Target Audience</h2>
    <p class="section-content">${generation.target_audience ?? ""}</p>
  </div>

  <div class="section">
    <h2 class="section-title">Key Features</h2>
    <ul class="features-list">
      ${(Array.isArray(generation.key_features) ? generation.key_features : []).map((f: string) => `<li>${f}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <h2 class="section-title">Brand Colors</h2>
    <div class="color-scheme">
      <div class="color-box">
        <div class="color-swatch" style="background-color: ${generation.color_scheme?.primary ?? "#fff"};"></div>
        <div class="color-label">Primary<br>${generation.color_scheme?.primary ?? ""}</div>
      </div>
      <div class="color-box">
        <div class="color-swatch" style="background-color: ${generation.color_scheme?.secondary ?? "#fff"};"></div>
        <div class="color-label">Secondary<br>${generation.color_scheme?.secondary ?? ""}</div>
      </div>
      <div class="color-box">
        <div class="color-swatch" style="background-color: ${generation.color_scheme?.accent ?? "#fff"};"></div>
        <div class="color-label">Accent<br>${generation.color_scheme?.accent ?? ""}</div>
      </div>
    </div>
  </div>

  <div class="footer">
    Generated by Ignitia - AI-Powered Startup Builder<br>
    ${new Date(generation.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
  </div>
</body>
</html>
`

    // Build response and attach any Set-Cookie headers captured from Supabase
    const res = new NextResponse(pdfHtml, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `inline; filename="${String(generation.startup_name).replace(/\s+/g, "-")}-pitch.html"`,
      },
    })

    const setCookies = getSetCookies()
    for (const c of setCookies) {
      // Only add Secure in production to avoid blocking on localhost
      const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
      // Append common attributes - adjust SameSite/HttpOnly as required by your app
      res.headers.append(
        "Set-Cookie",
        `${c.name}=${c.value}; Path=/; HttpOnly; SameSite=Lax${secure}`
      )
    }

    return res
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export PDF" }, { status: 500 })
  }
}