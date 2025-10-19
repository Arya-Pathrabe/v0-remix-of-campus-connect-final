import { createServiceSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const supabase = createServiceSupabaseClient()

    const { data } = await supabase
      .from("premium_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .gt("end_date", new Date().toISOString())

    const isPremium = data && data.length > 0
    const subscription = data?.[0] || null

    const daysRemaining = isPremium
      ? Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 60

    return Response.json({
      isPremium,
      subscription,
      daysRemaining,
    })
  } catch (error) {
    console.error("Subscription Check Error:", error)
    return Response.json({ isPremium: false, daysRemaining: 60 })
  }
}
