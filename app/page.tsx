"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import NotesMarketplace from "@/components/notes-marketplace"
import AIAssistant from "@/components/ai-assistant"
import StudyRoom from "@/components/study-room"
import CommunityHub from "@/components/community-hub"
import UserProfile from "@/components/user-profile"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="pt-20">
        {currentPage === "home" && <HeroSection setCurrentPage={setCurrentPage} />}
        {currentPage === "marketplace" && <NotesMarketplace />}
        {currentPage === "ai-assistant" && <AIAssistant />}
        {currentPage === "study-room" && <StudyRoom />}
        {currentPage === "community" && <CommunityHub />}
        {currentPage === "profile" && <UserProfile setCurrentPage={setCurrentPage} />}
      </main>
    </div>
  )
}
