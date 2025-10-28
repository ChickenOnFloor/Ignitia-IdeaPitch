"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import beautify from "js-beautify"

interface GenerationResult {
  startupName: string
  tagline: string
  description: string
  targetAudience: string
  keyFeatures: string[]
  colorScheme: {
    primary: string
    secondary: string
    accent: string
  }
  landingPageHtml: string
}

export function GeneratorForm({ userId }: { userId: string }) {
  const [idea, setIdea] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate startup details")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!result) return

    setIsSaving(true)
    setError(null)

    try {
      // 1. Get the user’s session
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error("You must be logged in to save.")
      }

      // 2. Include the token in Authorization header
      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId,
          ideaInput: idea,
          ...result,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save generation")
      }

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idea">Your Startup Idea</Label>
              <Textarea
                id="idea"
                placeholder="Example: A mobile app that helps people find and book local fitness classes in their area..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={6}
                required
                disabled={isGenerating}
              />
              <p className="text-sm text-muted-foreground">
                Be as detailed as possible. Include the problem you're solving, target audience, and key features.
              </p>
            </div>
            <Button type="submit" disabled={isGenerating || !idea.trim()} className="w-full gap-2">
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Startup
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Generated Startup</h2>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save to Dashboard
                  </>
                )}
              </Button>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="preview">Landing Page Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 pt-6">
                <div>
                  <h3 className="mb-2 text-xl font-semibold">{result.startupName}</h3>
                  <p className="text-lg italic text-muted-foreground">{result.tagline}</p>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Description</h4>
                  <p className="leading-relaxed text-muted-foreground">{result.description}</p>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Target Audience</h4>
                  <p className="leading-relaxed text-muted-foreground">{result.targetAudience}</p>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Key Features</h4>
                  <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                    {result.keyFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Color Scheme</h4>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="h-16 w-16 rounded-lg border"
                        style={{ backgroundColor: result.colorScheme.primary }}
                      />
                      <span className="text-xs text-muted-foreground">Primary</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="h-16 w-16 rounded-lg border"
                        style={{ backgroundColor: result.colorScheme.secondary }}
                      />
                      <span className="text-xs text-muted-foreground">Secondary</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="h-16 w-16 rounded-lg border"
                        style={{ backgroundColor: result.colorScheme.accent }}
                      />
                      <span className="text-xs text-muted-foreground">Accent</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="pt-6">
                <div className="overflow-hidden rounded-lg border">
                  <iframe
                    srcDoc={result.landingPageHtml}
                    className="h-[600px] w-full"
                    title="Landing Page Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </TabsContent>

              <TabsContent value="code" className="pt-6">
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm whitespace-pre-wrap">
                    <code>
                      {beautify.html(result.landingPageHtml || "", {
                        indent_size: 2,
                        wrap_line_length: 80,
                        preserve_newlines: true,
                      })}
                    </code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute right-4 top-4 bg-transparent"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        beautify.html(result.landingPageHtml || "", { indent_size: 2 })
                      )
                    }}
                  >
                    Copy Code
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
