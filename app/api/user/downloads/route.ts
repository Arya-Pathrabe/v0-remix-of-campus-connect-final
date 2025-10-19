import { createServiceSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const supabase = createServiceSupabaseClient()

    const { data, error } = await supabase
      .from("user_downloads")
      .select(
        `
        id,
        note_id,
        downloaded_at,
        notes(id, title, file_url)
      `,
      )
      .eq("user_id", userId)
      .order("downloaded_at", { ascending: false })

    if (error) throw error

    const downloads = data?.map((item: any) => ({
      id: item.id,
      note_id: item.note_id,
      title: item.notes?.title,
      file_url: item.notes?.file_url,
      downloaded_at: item.downloaded_at,
    }))

    return Response.json({ downloads })
  } catch (error) {
    console.error("Get Downloads Error:", error)
    return Response.json({ error: "Failed to fetch downloads" }, { status: 500 })
  }
}
