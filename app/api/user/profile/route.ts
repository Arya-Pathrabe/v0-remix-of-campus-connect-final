import { createServiceSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const supabase = createServiceSupabaseClient()

    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    return Response.json({ user: data })
  } catch (error) {
    console.error("Get Profile Error:", error)
    return Response.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { userId, fullName, bio, avatarUrl } = await request.json()

    const supabase = createServiceSupabaseClient()

    const { data, error } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()

    if (error) throw error

    return Response.json({ user: data[0] })
  } catch (error) {
    console.error("Update Profile Error:", error)
    return Response.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
