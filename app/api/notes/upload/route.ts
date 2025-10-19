import { put } from "@vercel/blob"
import { createServiceSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string
    const category = formData.get("category") as string
    const userId = formData.get("userId") as string

    if (!file || !title || !userId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const blob = await put(file.name, file, {
      access: "public",
    })

    const supabase = createServiceSupabaseClient()

    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: userId,
        title,
        description,
        file_url: blob.url,
        file_name: file.name,
        file_size: file.size,
        category: category || "General",
        price: Number.parseFloat(price) || 0,
      })
      .select()

    if (error) throw error

    return Response.json({
      success: true,
      noteId: data[0].id,
      fileUrl: blob.url,
    })
  } catch (error) {
    console.error("Upload Error:", error)
    return Response.json({ error: "Upload failed" }, { status: 500 })
  }
}
