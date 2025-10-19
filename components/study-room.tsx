"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, RotateCcw } from "lucide-react"

interface NoiseType {
  id: string
  name: string
  description: string
  icon: string
  color: string
  type: "white" | "brown"
}

export default function StudyRoom() {
  const [selectedNoise, setSelectedNoise] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [isPremium, setIsPremium] = useState(false)
  const [daysRemaining, setDaysRemaining] = useState(60)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const noises: NoiseType[] = [
    {
      id: "white",
      name: "White Noise",
      description: "Consistent, soothing background sound",
      icon: "🌊",
      color: "from-blue-500 to-cyan-500",
      type: "white",
    },
    {
      id: "brown",
      name: "Brown Noise",
      description: "Deep, calming low-frequency sound",
      icon: "🌲",
      color: "from-amber-600 to-yellow-500",
      type: "brown",
    },
  ]

  const premiumPlans = [
    { id: "1month", duration: "1 Month", price: 299, value: "₹299" },
    { id: "6months", duration: "6 Months", price: 599, value: "₹599" },
    { id: "1year", duration: "1 Year", price: 999, value: "₹999" },
  ]

  useEffect(() => {
    audioRef.current = new Audio()
  }, [])

  const handlePlayPause = () => {
    if (!selectedNoise) return

    if (isPlaying) {
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
  }

  const handleStop = () => {
    setIsPlaying(false)
  }

  const handleUpgradePremium = (planId: string) => {
    setIsProcessingPayment(true)
    setTimeout(() => {
      setIsPremium(true)
      setDaysRemaining(planId === "1month" ? 30 : planId === "6months" ? 180 : 365)
      setIsProcessingPayment(false)
      alert("Premium subscription activated!")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Study Room
          </h1>
          <p className="text-muted-foreground text-lg">Focus better with ambient sounds and white/brown noise</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Player */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 border-border/50 p-8 mb-8">
              <div className="text-center mb-8">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-6xl animate-pulse">
                  {selectedNoise ? noises.find((n) => n.id === selectedNoise)?.icon : "🎵"}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {selectedNoise ? noises.find((n) => n.id === selectedNoise)?.name : "Select a Sound"}
                </h2>
                <p className="text-muted-foreground">
                  {selectedNoise
                    ? noises.find((n) => n.id === selectedNoise)?.description
                    : "Choose your preferred ambient sound"}
                </p>
              </div>

              {/* Player Controls */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Volume</span>
                    <span className="text-sm font-semibold">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleStop}
                    variant="outline"
                    size="lg"
                    className="gap-2 border-border bg-transparent"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Stop
                  </Button>
                  <Button
                    onClick={handlePlayPause}
                    disabled={!selectedNoise}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 gap-2 px-8"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Play
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Free Trial Info */}
              {!isPremium && (
                <div className="mt-8 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold text-primary">Free Trial:</span> {daysRemaining} days remaining
                  </p>
                </div>
              )}
            </Card>

            {/* Sound Selection Grid */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Available Sounds</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {noises.map((noise) => (
                  <Card
                    key={noise.id}
                    onClick={() => setSelectedNoise(noise.id)}
                    className={`bg-card/50 border-border/50 p-4 cursor-pointer transition-all hover:border-primary/50 ${
                      selectedNoise === noise.id ? "border-primary bg-primary/10" : ""
                    }`}
                  >
                    <div className="text-3xl mb-2">{noise.icon}</div>
                    <h4 className="font-semibold text-sm">{noise.name}</h4>
                    <p className="text-xs text-muted-foreground">{noise.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Premium Section */}
          <div>
            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50 p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-2">Unlock Premium</h3>
              <p className="text-sm text-muted-foreground mb-6">Get unlimited access to all sounds and features</p>

              <div className="space-y-3 mb-6">
                {premiumPlans.map((plan) => (
                  <Button
                    key={plan.id}
                    onClick={() => handleUpgradePremium(plan.id)}
                    disabled={isProcessingPayment || isPremium}
                    variant="outline"
                    className="w-full justify-between border-border hover:border-primary/50 bg-transparent"
                  >
                    <span>{plan.duration}</span>
                    <span className="font-bold text-primary">{plan.value}</span>
                  </Button>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Unlimited sounds</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Ad-free experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Custom timers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Offline access</span>
                </div>
              </div>

              {isPremium && (
                <div className="mt-6 p-3 bg-green-500/20 border border-green-500/50 rounded text-sm text-green-400">
                  Premium active for {daysRemaining} days
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
