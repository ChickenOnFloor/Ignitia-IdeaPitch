import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { idea } = await request.json()

    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Invalid idea input" }, { status: 400 })
    }

    const model = process.env.AI_MODEL || "meta-llama/llama-4-maverick:free"

    console.log("[v0] Making OpenRouter API request for idea:", idea.substring(0, 100))
    console.log("[v0] Using AI model:", model)
    console.log("[v0] API Key present:", !!process.env.OPENROUTER_API_KEY)

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  model,
  messages: [
    {
      role: "user",
      content: `Create a professional startup landing page for: "${idea}"

Return ONLY valid JSON (no markdown, no code blocks):
{
  "startupName": "Name",
  "tagline": "Tagline",
  "description": "Description",
  "targetAudience": "Audience",
  "keyFeatures": ["feature1", "feature2", "feature3", "feature4", "feature5"],
  "colorScheme": {
    "primary": "#hex",
    "secondary": "#hex", 
    "accent": "#hex",
    "background": "#hex",
    "text": "#hex"
  },
  "designStyle": "modern|minimal|corporate|creative|tech|gradient|dark",
  "landingPageHtml": "Complete HTML"
}

IMPORTANT: Generate DIFFERENT, CREATIVE designs each time. Vary these elements:

DESIGN VARIATIONS:
- Layout: Choose from hero-centered, split-screen, asymmetric, card-based, or full-screen video/background
- Navigation: Top fixed, transparent on scroll, sidebar, or minimalist
- Color schemes: Use complementary, analogous, or triadic color schemes. Consider dark mode variants
- Typography: Combine different font families (sans-serif + serif, monospace accents)
- Components: Glass morphism, gradient backgrounds, subtle animations, hover effects
- Section ordering: Mix up standard flow with creative arrangements

For landingPageHtml, generate complete, valid HTML5 with:

REQUIRED SECTIONS (arrange creatively):
1. Navigation with smooth scroll and mobile hamburger
2. Hero section with engaging headline and CTA
3. Features/benefits (4-6 items in creative layout)
4. How it works/process (3-4 steps with visual elements)
5. Social proof/testimonials (2-3 testimonials)
6. Pricing (2-3 tiers with clear differentiation) 
7. Final CTA/contact section
8. Footer with links and social

DESIGN REQUIREMENTS:
- Fully responsive (mobile-first approach)
- Modern CSS: Flexbox/Grid, custom properties, transitions
- Interactive elements: Hover states, smooth scrolling, mobile menu
- Accessibility: Proper contrast, semantic HTML, alt texts
- Performance: Optimized CSS, efficient JavaScript
- Visual hierarchy: Clear typography scale, spacing system

CSS FRAMEWORK: Use modern CSS features:
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming
- CSS transitions and transforms
- Responsive units (rem, %, vw/vh)
- Clamp() for fluid typography

JAVASCRIPT: Include for:
- Mobile navigation toggle
- Smooth scroll to sections
- Optional: Interactive elements if relevant

Generate COMPLETE, SELF-CONTAINED HTML with:
- Full HTML5 structure with proper meta tags
- Embedded CSS in <style> with creative, unique styling
- Embedded JavaScript for interactivity
- Font imports from Google Fonts (choose complementary pairs)
- Icons from Font Awesome or similar CDN

COLOR SCHEME GUIDELINES:
- Primary: Main brand color
- Secondary: Supporting color  
- Accent: Call-to-action highlights
- Background: Page background
- Text: Primary text color

Return ONLY the JSON object with valid, complete HTML that works when rendered.`
    }
  ],
  temperature: 0.8,
  max_tokens: 10000,
}),
    })

    
    console.log("[v0] API Response status:", response.status)
    console.log("[v0] API Response ok:", response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] API Error response:", errorText)
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const responseText = await response.text()
    console.log("[v0] Raw response text length:", responseText.length)
    console.log("[v0] Raw response text (first 500 chars):", responseText.substring(0, 500))

    if (!responseText || responseText.trim().length === 0) {
      throw new Error("OpenRouter API returned empty or whitespace-only response")
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (jsonError) {
      console.error("[v0] Failed to parse response as JSON:", jsonError)
      console.error("[v0] Response text:", responseText)
      throw new Error(
        `Invalid JSON response from OpenRouter: ${jsonError instanceof Error ? jsonError.message : "Unknown error"}`,
      )
    }

    const content = data.choices?.[0]?.message?.content

    if (!content || content.trim().length === 0) {
      console.error("[v0] No content in response. Full data:", JSON.stringify(data, null, 2))
      throw new Error("AI model returned empty content. The model may be unavailable or rate-limited.")
    }

    console.log("[v0] Raw AI response length:", content.length)
    console.log("[v0] Raw AI response (first 500 chars):", content.substring(0, 500))

    // Parse the JSON response
    let result
    try {
      // Try to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/)
      let jsonString = jsonMatch ? jsonMatch[1] : content

      // Clean up the JSON string
      jsonString = jsonString
        .replace(/<s>/g, "")
        .replace(/<\/s>/g, "")
        .replace(/\[INST\]/g, "")
        .replace(/\[\/INST\]/g, "")
        .trim()

      result = JSON.parse(jsonString)
      console.log("[v0] Successfully parsed JSON")
    } catch (parseError) {
      console.error("[v0] Parse error details:", parseError)
      console.error("[v0] Failed content (first 1000 chars):", content.substring(0, 1000))
      throw new Error(
        `Failed to parse AI response: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate startup details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
