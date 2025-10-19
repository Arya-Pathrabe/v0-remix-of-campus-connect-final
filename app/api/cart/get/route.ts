import { createServiceSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const supabase = createServiceSupabaseClient()

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        id,
        note_id,
        notes(id, title, price, file_url)
      `,
      )
      .eq("user_id", userId)

    if (error) throw error

    return Response.json({
      items: data?.map((item: any) => ({
        id: item.id,
        note_id: item.note_id,
        title: item.notes?.title,
        price: item.notes?.price,
        file_url: item.notes?.file_url,
      })),
    })
  } catch (error) {
    console.error("Get Cart Error:", error)
    return Response.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}
