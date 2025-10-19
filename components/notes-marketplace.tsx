"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Upload, Star, Filter, Download } from "lucide-react"
import UploadModal from "./upload-modal"
import CartPage from "./cart-page"

interface Note {
  id: string
  title: string
  description: string
  author: string
  category: string
  price: number
  rating: number
  downloads: number
  image: string
  file_url: string
}

export default function NotesMarketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<string[]>([])
  const [notes] = useState<Note[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCartPage, setShowCartPage] = useState(false)
  const [downloadingNoteId, setDownloadingNoteId] = useState<string | null>(null)

  const categories = ["all", "Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature"]

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleCart = (noteId: string) => {
    if (cart.includes(noteId)) {
      setCart((prev) => prev.filter((id) => id !== noteId))
    } else {
      setCart((prev) => [...prev, noteId])
    }
  }

  const handleDownload = (note: Note) => {
    setDownloadingNoteId(note.id)
    setTimeout(() => {
      alert(`Downloaded: ${note.title}`)
      setDownloadingNoteId(null)
    }, 1000)
  }

  if (showCartPage) {
    return <CartPage onClose={() => setShowCartPage(false)} />
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Notes Marketplace
          </h1>
          <p className="text-muted-foreground text-lg">Discover and purchase study notes from top contributors</p>
        </div>

        {/* Upload Section */}
        <Card className="bg-card/50 border-border/50 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Share Your Notes</h3>
              <p className="text-muted-foreground">Upload your study materials and earn money</p>
            </div>
            <Button onClick={() => setShowUploadModal(true)} className="bg-primary hover:bg-primary/90 gap-2">
              <Upload className="w-4 h-4" />
              Upload Notes
            </Button>
          </div>
        </Card>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            <Input
              placeholder="Search notes or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border-border flex-1"
            />
            <Button variant="outline" className="gap-2 border-border bg-transparent">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <Card
                key={note.id}
                className="bg-card/50 border-border/50 overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group"
              >
                <div className="relative overflow-hidden h-40 bg-gradient-to-br from-primary/20 to-secondary/20">
                  <img
                    src={note.image || "/placeholder.svg"}
                    alt={note.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-2">{note.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">by {note.author}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium">{note.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({note.downloads} downloads)</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-primary">₹{note.price}</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleDownload(note)}
                        disabled={downloadingNoteId === note.id}
                        variant="outline"
                        className="border-border gap-1 bg-transparent"
                      >
                        {downloadingNoteId === note.id ? (
                          <span className="w-4 h-4 animate-spin">⟳</span>
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => toggleCart(note.id)}
                        className={`gap-1 ${cart.includes(note.id) ? "bg-primary" : "bg-muted hover:bg-muted/80"}`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No notes available. Start by uploading your first notes!</p>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-8 right-8 bg-card border border-primary/50 rounded-lg p-6 shadow-lg shadow-primary/20 max-w-sm">
            <h3 className="font-semibold mb-2">Cart Summary</h3>
            <p className="text-muted-foreground mb-4">{cart.length} items in cart</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent">
                View Cart
              </Button>
              <Button onClick={() => setShowCartPage(true)} className="flex-1 bg-primary hover:bg-primary/90">
                Checkout
              </Button>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        <UploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onSuccess={() => {}} />
      </div>
    </div>
  )
}
