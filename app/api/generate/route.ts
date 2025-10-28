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
  "colorScheme": {"primary": "#3b82f6", "secondary": "#1f2937", "accent": "#ef4444"},
  "landingPageHtml": "Complete HTML"
}

For landingPageHtml, generate complete, valid HTML5 with:

1. Full structure: <!DOCTYPE html><html><head>...</head><body>...</body></html>
2. Responsive navbar with mobile hamburger menu that toggles dropdown
3. Hero section with headline, description, and CTA buttons
4. Features section with 6 cards in grid layout
5. How it works section with 4 numbered steps
6. Pricing section with 3 pricing tiers
7. Contact/CTA section
8. Footer with links

Design requirements:
- Use the provided color scheme (primary, secondary, accent)
- Clean, minimal design with proper spacing
- Responsive: works on mobile, tablet, desktop
- Smooth scroll navigation when clicking navbar links
- Mobile menu dropdown with smooth animation
- All sections have proper IDs for linking
- Professional typography and spacing
- Subtle shadows and hover effects
- All content is visible and readable

Include complete CSS in <style> tag and JavaScript in <script> tag for:
- Mobile menu toggle functionality
- Smooth scroll to sections
- Responsive design

Return ONLY the JSON object.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 8000,
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
