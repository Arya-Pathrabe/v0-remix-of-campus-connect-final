"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit2, Save, X, Download } from "lucide-react"

interface UserProfileProps {
  setCurrentPage: (page: string) => void
}

interface UserProfile {
  id: string
  fullName: string
  email: string
  bio: string
  avatar_url: string
}

interface UserStats {
  notesUploaded: number
  earnings: number
  downloads: number
  communitiesJoined: number
}

interface Note {
  id: string
  title: string
  price: number
  downloads: number
  earnings: number
}

interface DownloadedNote {
  id: string
  note_id: string
  title: string
  file_url: string
  downloaded_at: string
}

export default function UserProfile({ setCurrentPage }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    id: "user-1",
    fullName: "",
    email: "",
    bio: "",
    avatar_url: "",
  })
  const [editedProfile, setEditedProfile] = useState(profile)
  const [stats] = useState<UserStats>({
    notesUploaded: 0,
    earnings: 0,
    downloads: 0,
    communitiesJoined: 0,
  })
  const [uploadedNotes] = useState<Note[]>([])
  const [downloadedNotes] = useState<DownloadedNote[]>([])

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setProfile(editedProfile)
      setIsEditing(false)
      setIsSaving(false)
      alert("Profile updated successfully!")
    }, 800)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleDownload = (note: DownloadedNote) => {
    alert(`Downloaded: ${note.title}`)
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Profile
          </h1>
        </div>

        {/* Profile Card */}
        <Card className="bg-card/50 border-border/50 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <img
                src={profile.avatar_url || "/placeholder.svg"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-primary/50 mb-4 object-cover"
              />
              <Button variant="outline" size="sm" className="border-border bg-transparent">
                Change Avatar
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Full Name</label>
                    <Input
                      value={editedProfile.fullName}
                      onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                      className="bg-input border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Email</label>
                    <Input value={editedProfile.email} disabled className="bg-input border-border opacity-50" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Bio</label>
                    <Textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      className="bg-input border-border resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 gap-2">
                      {isSaving ? (
                        <>
                          <span className="w-4 h-4 animate-spin">⟳</span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="border-border gap-2 bg-transparent">
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{profile.fullName || "No name set"}</h2>
                      <p className="text-muted-foreground">{profile.email || "No email set"}</p>
                    </div>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="border-border gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-foreground">{profile.bio || "No bio added yet"}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50 p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{stats.notesUploaded}</div>
            <p className="text-sm text-muted-foreground">Notes Uploaded</p>
          </Card>
          <Card className="bg-card/50 border-border/50 p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">₹{stats.earnings}</div>
            <p className="text-sm text-muted-foreground">Total Earnings</p>
          </Card>
          <Card className="bg-card/50 border-border/50 p-6 text-center">
            <div className="text-3xl font-bold text-secondary mb-2">{stats.downloads}</div>
            <p className="text-sm text-muted-foreground">Downloads</p>
          </Card>
          <Card className="bg-card/50 border-border/50 p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{stats.communitiesJoined}</div>
            <p className="text-sm text-muted-foreground">Communities</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="notes" className="space-y-6">
          <TabsList className="bg-card border-border">
            <TabsTrigger value="notes">My Notes</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Uploaded Notes</h3>
              <Button onClick={() => setCurrentPage("marketplace")} className="bg-primary hover:bg-primary/90 gap-2">
                Upload New
              </Button>
            </div>
            {uploadedNotes.length > 0 ? (
              uploadedNotes.map((note) => (
                <Card key={note.id} className="bg-card/50 border-border/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{note.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        ₹{note.price} • {note.downloads} downloads
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">₹{note.earnings}</div>
                      <p className="text-xs text-muted-foreground">earnings</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="bg-card/50 border-border/50 p-8 text-center">
                <p className="text-muted-foreground">No notes uploaded yet</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="downloads" className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Downloaded Notes</h3>
            {downloadedNotes.length > 0 ? (
              downloadedNotes.map((note) => (
                <Card key={note.id} className="bg-card/50 border-border/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{note.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Downloaded {new Date(note.downloaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDownload(note)}
                      variant="outline"
                      size="sm"
                      className="border-border gap-2 bg-transparent"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="bg-card/50 border-border/50 p-8 text-center">
                <p className="text-muted-foreground">No downloads yet</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Payment Method</label>
                  <Input placeholder="UPI ID or Phone Number" className="bg-input border-border" />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Notification Preferences</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-sm">Email notifications</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-sm">Community updates</span>
                    </label>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90">Save Settings</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
