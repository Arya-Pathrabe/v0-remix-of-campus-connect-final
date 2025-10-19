"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, BookOpen, Users, Zap, Volume2 } from "lucide-react"

interface HeroSectionProps {
  setCurrentPage: (page: string) => void
}

export default function HeroSection({ setCurrentPage }: HeroSectionProps) {
  const features = [
    {
      icon: BookOpen,
      title: "Share Notes",
      description: "Upload and sell your study notes to help others learn",
    },
    {
      icon: Zap,
      title: "AI Assistant",
      description: "Get instant answers and explanations powered by AI",
    },
    {
      icon: Users,
      title: "Communities",
      description: "Join study groups and collaborate with peers",
    },
    {
      icon: Volume2,
      title: "Study Sounds",
      description: "Focus with white and brown noise while studying",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card/30 to-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Main Hero */}
        <div className="text-center mb-20 animate-slide-in-up">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Your Ultimate Study Companion
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Share knowledge, earn money, and study smarter with AI-powered assistance and a thriving community of
            learners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setCurrentPage("marketplace")}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground group"
            >
              Explore Notes
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => setCurrentPage("ai-assistant")}
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Try AI Assistant
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all p-6 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
          <div className="p-6 rounded-lg bg-card/30 border border-border/50">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
            <p className="text-muted-foreground">Notes Shared</p>
          </div>
          <div className="p-6 rounded-lg bg-card/30 border border-border/50">
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">5K+</div>
            <p className="text-muted-foreground">Active Users</p>
          </div>
          <div className="p-6 rounded-lg bg-card/30 border border-border/50">
            <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">₹50L+</div>
            <p className="text-muted-foreground">Earnings</p>
          </div>
        </div>
      </div>
    </div>
  )
}
