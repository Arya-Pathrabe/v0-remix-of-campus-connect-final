import { put } from "@vercel/blob"
import { createServiceSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const communityId = formData.get("communityId") as string
    const userId = formData.get("userId") as string
    const message = formData.get("message") as string
    const file = formData.get("file") as File | null

    const supabase = createServiceSupabaseClient()

    let fileUrl = null
    let fileType = null

    if (file) {
      const blob = await put(file.name, file, { access: "public" })
      fileUrl = blob.url
      fileType = file.type.split("/")[0]
    }

    const { data, error } = await supabase
      .from("community_messages")
      .insert({
        community_id: communityId,
        user_id: userId,
        message,
        file_url: fileUrl,
        file_type: fileType,
      })
      .select()

    if (error) throw error

    return Response.json({ success: true, messageId: data[0].id })
  } catch (error) {
    console.error("Message Error:", error)
    return Response.json({ error: "Failed to send message" }, { status: 500 })
  }
}
