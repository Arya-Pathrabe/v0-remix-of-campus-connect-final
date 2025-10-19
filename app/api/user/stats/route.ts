import { createServiceSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const supabase = createServiceSupabaseClient()

    // Get notes uploaded
    const { count: notesCount } = await supabase
      .from("notes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    // Get total downloads
    const { data: notesData } = await supabase.from("notes").select("downloads").eq("user_id", userId)

    const totalDownloads = notesData?.reduce((sum, n) => sum + (n.downloads || 0), 0) || 0

    // Get communities joined
    const { count: communitiesCount } = await supabase
      .from("community_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "approved")

    // Get total earnings
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("price, notes(user_id)")
      .eq("notes.user_id", userId)

    const totalEarnings = orderItems?.reduce((sum, item) => sum + (item.price || 0), 0) || 0

    return Response.json({
      notesUploaded: notesCount || 0,
      earnings: totalEarnings,
      downloads: totalDownloads,
      communitiesJoined: communitiesCount || 0,
    })
  } catch (error) {
    console.error("Get Stats Error:", error)
    return Response.json({
      notesUploaded: 0,
      earnings: 0,
      downloads: 0,
      communitiesJoined: 0,
    })
  }
}
