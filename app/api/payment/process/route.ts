import { createServiceSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { userId, cartItems, paymentMethod, transactionId } = await request.json()

    const supabase = createServiceSupabaseClient()

    // Calculate total
    let totalAmount = 0
    for (const item of cartItems) {
      totalAmount += item.price
    }

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        payment_status: "completed",
        transaction_id: transactionId,
      })
      .select()

    if (orderError) throw orderError

    const orderId = orderData[0].id

    // Add order items and record downloads
    for (const item of cartItems) {
      await supabase.from("order_items").insert({
        order_id: orderId,
        note_id: item.note_id,
        price: item.price,
      })

      await supabase.from("user_downloads").insert({
        user_id: userId,
        note_id: item.note_id,
      })
    }

    // Clear cart
    await supabase.from("cart_items").delete().eq("user_id", userId)

    // Generate payment link for UPI/WhatsApp
    const paymentLink = generatePaymentLink(paymentMethod, totalAmount, transactionId)

    return Response.json({
      success: true,
      orderId,
      paymentLink,
      message: `Payment of ₹${totalAmount} to pathrabearya@okicici via ${paymentMethod}`,
    })
  } catch (error) {
    console.error("Payment Error:", error)
    return Response.json({ error: "Payment processing failed" }, { status: 500 })
  }
}

function generatePaymentLink(method: string, amount: number, transactionId: string): string {
  const upiId = "pathrabearya@okicici"

  if (method === "upi") {
    return `upi://pay?pa=${upiId}&pn=Campus%20Connect&am=${amount}&tn=Notes%20Purchase%20${transactionId}`
  } else if (method === "whatsapp") {
    const message = `Hi, I want to pay ₹${amount} for notes purchase. Transaction ID: ${transactionId}`
    return `https://wa.me/?text=${encodeURIComponent(message)}`
  } else if (method === "telegram") {
    const message = `Payment of ₹${amount} for Campus Connect notes. Transaction ID: ${transactionId}`
    return `https://t.me/share/url?url=${encodeURIComponent(message)}`
  }

  return ""
}
