import { generateText } from "ai"
import { createServiceSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { messages, userId } = await request.json()

    const supabase = createServiceSupabaseClient()

    // Get user's notes context from database
    const { data: userNotes } = await supabase.from("notes").select("title, description").eq("user_id", userId).limit(5)

    const contextPrompt =
      userNotes && userNotes.length > 0 ? `User's notes: ${userNotes.map((n: any) => n.title).join(", ")}` : ""

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      system: `You are Campus Connect's AI Study Assistant. You help students understand concepts, solve problems, and study effectively. ${contextPrompt}. Be concise, clear, and educational.`,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    return Response.json({ content: text })
  } catch (error) {
    console.error("AI Chat Error:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
