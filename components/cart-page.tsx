"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Loader, ShoppingCart } from "lucide-react"

interface CartItem {
  id: string
  note_id: string
  title: string
  price: number
  file_url: string
}

interface CartPageProps {
  onClose: () => void
}

export default function CartPage({ onClose }: CartPageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [upiId, setUpiId] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  const currentUserId = "current-user-id" // Replace with actual user ID

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch(`/api/cart/get?userId=${currentUserId}`)
      const data = await response.json()
      setCartItems(data.items || [])
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (noteId: string) => {
    try {
      await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, noteId }),
      })
      setCartItems((prev) => prev.filter((item) => item.note_id !== noteId))
    } catch (error) {
      console.error("Error removing from cart:", error)
    }
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0)

  const handleCheckout = async () => {
    if (!upiId && !phoneNumber) {
      alert("Please enter payment details")
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("/api/payment/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          cartItems,
          paymentMethod,
          transactionId: `TXN-${Date.now()}`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Payment successful! Your notes are ready to download.")
        setCartItems([])
        onClose()
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Shopping Cart
          </h1>
          <Button onClick={onClose} variant="ghost" size="icon">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="bg-card/50 border-border/50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">File: {item.file_url.split("/").pop()}</p>
                      </div>
                      <div className="text-right mr-4">
                        <div className="text-lg font-bold text-primary">₹{item.price}</div>
                      </div>
                      <Button
                        onClick={() => removeFromCart(item.note_id)}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card/50 border-border/50 p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </Card>
            )}
          </div>

          {/* Payment Section */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <Card className="bg-card/50 border-border/50 p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                {/* Items Count */}
                <div className="flex justify-between mb-4 pb-4 border-b border-border">
                  <span className="text-muted-foreground">Items ({cartItems.length})</span>
                  <span className="font-semibold">₹{totalAmount}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="text-sm font-semibold mb-3 block">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">UPI (Google Pay, PhonePe)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="whatsapp"
                        checked={paymentMethod === "whatsapp"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">WhatsApp Pay</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="telegram"
                        checked={paymentMethod === "telegram"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Telegram Pay</span>
                    </label>
                  </div>
                </div>

                {/* Payment Details */}
                {paymentMethod === "upi" && (
                  <div className="mb-6">
                    <label className="text-sm font-semibold mb-2 block">UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Payment will be sent to: pathrabearya@okicici</p>
                  </div>
                )}

                {(paymentMethod === "whatsapp" || paymentMethod === "telegram") && (
                  <div className="mb-6">
                    <label className="text-sm font-semibold mb-2 block">Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                    />
                  </div>
                )}

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Complete Purchase"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By purchasing, you agree to our terms and conditions
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
