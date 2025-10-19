import { createServiceSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { memberId, communityId, adminId } = await request.json()

    const supabase = createServiceSupabaseClient()

    // Verify admin
    const { data: isAdmin } = await supabase
      .from("communities")
      .select("id")
      .eq("id", communityId)
      .eq("admin_id", adminId)

    if (!isAdmin || isAdmin.length === 0) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Approve member
    const { error } = await supabase
      .from("community_members")
      .update({
        status: "approved",
        joined_at: new Date().toISOString(),
      })
      .eq("id", memberId)

    if (error) throw error

    return Response.json({ success: true })
  } catch (error) {
    console.error("Approve Member Error:", error)
    return Response.json({ error: "Failed to approve member" }, { status: 500 })
  }
}
