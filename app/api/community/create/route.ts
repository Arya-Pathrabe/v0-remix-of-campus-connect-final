import { createServiceSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { name, description, isAnonymous, adminId } = await request.json()

    const supabase = createServiceSupabaseClient()

    const { data, error } = await supabase
      .from("communities")
      .insert({
        name,
        description,
        admin_id: adminId,
        is_anonymous: isAnonymous,
      })
      .select()

    if (error) throw error

    // Add admin as member
    await supabase.from("community_members").insert({
      community_id: data[0].id,
      user_id: adminId,
      status: "approved",
      joined_at: new Date().toISOString(),
    })

    return Response.json({ success: true, communityId: data[0].id })
  } catch (error) {
    console.error("Create Community Error:", error)
    return Response.json({ error: "Failed to create community" }, { status: 500 })
  }
}
