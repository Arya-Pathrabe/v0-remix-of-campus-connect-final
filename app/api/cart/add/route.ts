import { createServiceSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { userId, noteId } = await request.json()

    const supabase = createServiceSupabaseClient()

    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        user_id: userId,
        note_id: noteId,
        quantity: 1,
      })
      .select()

    if (error && error.code !== "23505") throw error

    return Response.json({ success: true, cartItemId: data?.[0]?.id })
  } catch (error) {
    console.error("Add to Cart Error:", error)
    return Response.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
