import { createServiceSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { communityId, userId } = await request.json()

    const supabase = createServiceSupabaseClient()

    // Check if already a member
    const { data: existing } = await supabase
      .from("community_members")
      .select("id")
      .eq("community_id", communityId)
      .eq("user_id", userId)

    if (existing && existing.length > 0) {
      return Response.json({ error: "Already a member or pending" }, { status: 400 })
    }

    // Create pending request
    const { data, error } = await supabase
      .from("community_members")
      .insert({
        community_id: communityId,
        user_id: userId,
        status: "pending",
      })
      .select()

    if (error) throw error

    return Response.json({ success: true, requestId: data[0].id })
  } catch (error) {
    console.error("Join Community Error:", error)
    return Response.json({ error: "Failed to join community" }, { status: 500 })
  }
}
