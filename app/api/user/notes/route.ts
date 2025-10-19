import { createServiceSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const supabase = createServiceSupabaseClient()

    const { data, error } = await supabase
      .from("notes")
      .select("id, title, price, downloads")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Calculate earnings for each note
    const notesWithEarnings = await Promise.all(
      data.map(async (note) => {
        const { data: orderItems } = await supabase.from("order_items").select("price").eq("note_id", note.id)

        const earnings = orderItems?.reduce((sum, item) => sum + (item.price || 0), 0) || 0

        return { ...note, earnings }
      }),
    )

    return Response.json({ notes: notesWithEarnings })
  } catch (error) {
    console.error("Get User Notes Error:", error)
    return Response.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}
