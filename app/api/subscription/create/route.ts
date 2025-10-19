import { createServiceSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { userId, planType, paymentId } = await request.json()

    const supabase = createServiceSupabaseClient()

    const endDate = new Date()
    if (planType === "1month") {
      endDate.setMonth(endDate.getMonth() + 1)
    } else if (planType === "6months") {
      endDate.setMonth(endDate.getMonth() + 6)
    } else if (planType === "1year") {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }

    // Delete existing subscription
    await supabase.from("premium_subscriptions").delete().eq("user_id", userId)

    // Create new subscription
    const { data, error } = await supabase
      .from("premium_subscriptions")
      .insert({
        user_id: userId,
        plan_type: planType,
        end_date: endDate.toISOString(),
        payment_id: paymentId,
        status: "active",
      })
      .select()

    if (error) throw error

    return Response.json({ success: true, subscriptionId: data[0].id })
  } catch (error) {
    console.error("Create Subscription Error:", error)
    return Response.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}
