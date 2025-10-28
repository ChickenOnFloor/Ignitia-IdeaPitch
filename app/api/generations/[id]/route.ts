import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete generation (RLS will ensure user can only delete their own)
    const { error } = await supabase.from("generations").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to delete generation" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete generation" }, { status: 500 })
  }
}
