import { createServiceSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { userId, noteId } = await request.json()

    const supabase = createServiceSupabaseClient()

    await supabase.from("cart_items").delete().eq("user_id", userId).eq("note_id", noteId)

    return Response.json({ success: true })
  } catch (error) {
    console.error("Remove from Cart Error:", error)
    return Response.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}
