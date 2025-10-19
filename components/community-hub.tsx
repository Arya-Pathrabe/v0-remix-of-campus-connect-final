"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Users, Plus, MessageSquare, ImageIcon, Video, FileText, Clock } from "lucide-react"

interface Community {
  id: string
  name: string
  description: string
  members: number
  isAnonymous: boolean
  status: "joined" | "pending" | "not-joined"
  adminId: string
}

interface Message {
  id: string
  author: string
  content: string
  timestamp: string
  type: "text" | "image" | "video" | "file"
  fileUrl?: string
}

export default function CommunityHub() {
  const [showCreateCommunity, setShowCreateCommunity] = useState(false)
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)
  const [communities, setCommunities] = useState<Community[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [newCommunityName, setNewCommunityName] = useState("")
  const [newCommunityDesc, setNewCommunityDesc] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)

  const handleCreateCommunity = () => {
    if (!newCommunityName.trim()) return

    const newCommunity: Community = {
      id: Date.now().toString(),
      name: newCommunityName,
      description: newCommunityDesc,
      members: 1,
      isAnonymous,
      status: "joined",
      adminId: "current-user",
    }

    setCommunities((prev) => [newCommunity, ...prev])
    setNewCommunityName("")
    setNewCommunityDesc("")
    setIsAnonymous(false)
    setShowCreateCommunity(false)
  }

  const handleJoinCommunity = (communityId: string) => {
    setCommunities((prev) => prev.map((c) => (c.id === communityId ? { ...c, status: "pending" as const } : c)))
  }

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedCommunity) return

    const newMessage: Message = {
      id: Date.now().toString(),
      author: "You",
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    }

    setMessages((prev) => [...prev, newMessage])
    setMessageInput("")
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Community Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Join study groups, share knowledge, and collaborate with peers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Communities List */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Communities</h2>
              <Button
                onClick={() => setShowCreateCommunity(!showCreateCommunity)}
                size="sm"
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                <Plus className="w-4 h-4" />
                Create
              </Button>
            </div>

            {showCreateCommunity && (
              <Card className="bg-card/50 border-border/50 p-4 mb-4">
                <Input
                  placeholder="Community name"
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                  className="bg-input border-border mb-3"
                />
                <Textarea
                  placeholder="Description"
                  value={newCommunityDesc}
                  onChange={(e) => setNewCommunityDesc(e.target.value)}
                  className="bg-input border-border mb-3 resize-none"
                  rows={3}
                />
                <label className="flex items-center gap-2 mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Anonymous Community</span>
                </label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-border bg-transparent"
                    onClick={() => setShowCreateCommunity(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" onClick={handleCreateCommunity}>
                    Create
                  </Button>
                </div>
              </Card>
            )}

            <div className="space-y-3">
              {communities.length > 0 ? (
                communities.map((community) => (
                  <Card
                    key={community.id}
                    onClick={() => setSelectedCommunity(community.id)}
                    className={`bg-card/50 border-border/50 p-4 cursor-pointer transition-all hover:border-primary/50 ${
                      selectedCommunity === community.id ? "border-primary bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{community.name}</h3>
                      {community.isAnonymous && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Anonymous</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{community.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {community.members} members
                      </span>
                      {community.status === "joined" && <span className="text-xs text-green-500">✓ Joined</span>}
                      {community.status === "pending" && (
                        <span className="text-xs text-yellow-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      {community.status === "not-joined" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border bg-transparent h-6 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleJoinCommunity(community.id)
                          }}
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="bg-card/50 border-border/50 p-4 text-center">
                  <p className="text-sm text-muted-foreground">No communities yet. Create one to get started!</p>
                </Card>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedCommunity ? (
              <Card className="bg-card/50 border-border/50 h-[600px] flex flex-col">
                {/* Community Header */}
                <div className="border-b border-border p-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold">{communities.find((c) => c.id === selectedCommunity)?.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {communities.find((c) => c.id === selectedCommunity)?.members} members
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div key={msg.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{msg.author}</span>
                            <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                          </div>
                          <p className="text-sm text-foreground">{msg.content}</p>
                          {msg.fileUrl && (
                            <a
                              href={msg.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline mt-1"
                            >
                              View {msg.type}
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-2 mb-3">
                    <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="bg-input border-border flex-1"
                    />
                    <Button onClick={handleSendMessage} className="bg-primary hover:bg-primary/90">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-card/50 border-border/50 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Select a community to start chatting</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
