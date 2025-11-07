import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();

    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Invalid idea input" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("Making Gemini API request for idea:", idea.substring(0, 100));
    console.log("Using AI model: gemini-2.5-flash"); // Updated log
    console.log("API Key present:", !!process.env.GEMINI_API_KEY);
    const prompt = `Create a professional startup landing page for: "${idea}"
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
    - gradiant colors

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
    - website style follow shadcn style
    - have some gsap animations like scroll trigger
    - have 3d tilt cards

    COLOR SCHEME GUIDELINES:
    - Primary: Main brand color
    - Secondary: Supporting color
    - Accent: Call-to-action highlights
    - Background: Page background
    - Text: Primary text color
    
    Return ONLY the JSON object with valid, complete HTML that works when rendered.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    console.log("[v0] Raw AI response length:", content.length);
    console.log("[v0] Raw AI response (first 500 chars):", content.substring(0, 500));

    let parsedResult;
    try {
      parsedResult = JSON.parse(content);
      console.log("[v0] Successfully parsed JSON directly");
    } catch (directParseError) {
      console.error("[v0] Failed to parse directly, attempting markdown extraction:", directParseError);
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      let jsonString = jsonMatch ? jsonMatch[1] : content;

      jsonString = jsonString
        .replace(/\[INST\]/g, "")
        .replace(/\[\/INST\]/g, "")
        .replace(/<s>/g, "")
        .replace(/<\/s>/g, "")
        .trim();

      try {
        parsedResult = JSON.parse(jsonString);
        console.log("[v0] Successfully parsed JSON after markdown extraction");
      } catch (markdownParseError) {
        console.error("[v0] Parse error details:", markdownParseError);
        console.error("[v0] Failed content (first 1000 chars):", content.substring(0, 1000));
        throw new Error(
          `Failed to parse AI response: ${markdownParseError instanceof Error ? markdownParseError.message : "Unknown error"}`,
        );
      }
    }

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("[v0] Generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate startup details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}