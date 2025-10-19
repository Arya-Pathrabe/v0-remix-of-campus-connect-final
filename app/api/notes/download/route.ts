import { createServiceSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { noteId, userId } = await request.json()

    const supabase = createServiceSupabaseClient()

    // Record download
    await supabase.from("user_downloads").insert({
      user_id: userId,
      note_id: noteId,
    })

    // Increment download count
    const { data: note } = await supabase.from("notes").select("downloads").eq("id", noteId).single()

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 })
    }

    await supabase
      .from("notes")
      .update({ downloads: (note.downloads || 0) + 1 })
      .eq("id", noteId)

    // Get file URL
    const { data } = await supabase.from("notes").select("file_url, file_name").eq("id", noteId).single()

    return Response.json({
      success: true,
      fileUrl: data?.file_url,
      fileName: data?.file_name,
    })
  } catch (error) {
    console.error("Download Error:", error)
    return Response.json({ error: "Download failed" }, { status: 500 })
  }
}
