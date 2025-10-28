"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Eye, Trash2, Download, Calendar } from "lucide-react"
import Link from "next/link"

interface Generation {
  id: string
  idea_input: string
  startup_name: string
  tagline: string
  description: string
  target_audience: string
  key_features: string[]
  color_scheme: {
    primary: string
    secondary: string
    accent: string
  }
  landing_page_html: string
  created_at: string
}

export function DashboardContent({ initialGenerations }: { initialGenerations: Generation[] }) {
  const [generations, setGenerations] = useState<Generation[]>(initialGenerations)
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleView = (generation: Generation) => {
    setSelectedGeneration(generation)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this generation?")) return

    try {
      const response = await fetch(`/api/generations/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete generation")
      }

      setGenerations(generations.filter((g) => g.id !== id))
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete generation")
    }
  }

  const handleExportPDF = async (generation: Generation) => {
    try {
      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId: generation.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to export PDF")
      }

      const html = await response.text()
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(html)
        printWindow.document.close()
        // Wait for content to load before triggering print
        printWindow.onload = () => {
          printWindow.print()
        }
      }
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export PDF")
    }
  }

  const handleExportHTML = (generation: Generation) => {
    const blob = new Blob([generation.landing_page_html], { type: "text/html" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${generation.startup_name.replace(/\s+/g, "-")}-landing-page.html`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Your Startups</h1>
          <p className="text-muted-foreground">Manage and export your AI-generated startup ideas</p>
        </div>
        <Link href="/generate">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Generate New
          </Button>
        </Link>
      </div>

      {generations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No startups yet</h3>
            <p className="mb-6 text-muted-foreground">Get started by generating your first startup idea</p>
            <Link href="/generate">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Generate Your First Startup
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {generations.map((generation) => (
            <Card key={generation.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-1">{generation.startup_name}</CardTitle>
                <CardDescription className="line-clamp-2">{generation.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">{generation.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(generation.created_at)}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2 bg-transparent"
                    onClick={() => handleView(generation)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(generation.id)}
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          {selectedGeneration && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedGeneration.startup_name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => handleExportPDF(selectedGeneration)}
                  >
                    <Download className="h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => handleExportHTML(selectedGeneration)}
                  >
                    <Download className="h-4 w-4" />
                    Export HTML
                  </Button>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="preview">Landing Page</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 pt-4">
                    <div>
                      <p className="text-lg italic text-muted-foreground">{selectedGeneration.tagline}</p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold">Description</h4>
                      <p className="leading-relaxed text-muted-foreground">{selectedGeneration.description}</p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold">Target Audience</h4>
                      <p className="leading-relaxed text-muted-foreground">{selectedGeneration.target_audience}</p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold">Key Features</h4>
                      <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                        {selectedGeneration.key_features.map((feature, index) => (
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
                            style={{ backgroundColor: selectedGeneration.color_scheme.primary }}
                          />
                          <span className="text-xs text-muted-foreground">Primary</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="h-16 w-16 rounded-lg border"
                            style={{ backgroundColor: selectedGeneration.color_scheme.secondary }}
                          />
                          <span className="text-xs text-muted-foreground">Secondary</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="h-16 w-16 rounded-lg border"
                            style={{ backgroundColor: selectedGeneration.color_scheme.accent }}
                          />
                          <span className="text-xs text-muted-foreground">Accent</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="pt-4">
                    <div className="overflow-hidden rounded-lg border">
                      <iframe
                        srcDoc={selectedGeneration.landing_page_html}
                        className="h-[500px] w-full"
                        title="Landing Page Preview"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="pt-4">
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                        <code>{selectedGeneration.landing_page_html}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute right-4 top-4 bg-transparent"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedGeneration.landing_page_html)
                        }}
                      >
                        Copy Code
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
