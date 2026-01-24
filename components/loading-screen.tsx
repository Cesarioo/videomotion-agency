"use client"

import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [logoScaled, setLogoScaled] = useState(false)
  const [popComplete, setPopComplete] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [splitExit, setSplitExit] = useState(false)
  const fullText = "chocomotion"

  useEffect(() => {
    // Logo appears at -30deg, then pops forward and rotates to 0deg
    const logoScaleTimer = setTimeout(() => {
      setLogoScaled(true) // Start pop-rotate animation
    }, 300) // Show logo at -30deg for 300ms, then start pop

    return () => {
      clearTimeout(logoScaleTimer)
    }
  }, [])

  useEffect(() => {
    if (!logoScaled) return

    // Mark pop animation as complete after 0.6s (matches animation duration)
    const popCompleteTimer = setTimeout(() => {
      setPopComplete(true)
    }, 600)

    return () => {
      clearTimeout(popCompleteTimer)
    }
  }, [logoScaled])

  useEffect(() => {
    if (!popComplete) return

    let typeInterval: NodeJS.Timeout | null = null
    let fadeTimer: NodeJS.Timeout | null = null
    let removeTimer: NodeJS.Timeout | null = null

    // Text starts after logo pop-rotate animation completes
    // Typewriter effect starts immediately after pop completes
    let currentIndex = 0
    typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        if (typeInterval) clearInterval(typeInterval)
      }
    }, 150) // Speed of typing

    // Start split exit animation after text is fully written + 0.8 second pause
    fadeTimer = setTimeout(() => {
      setSplitExit(true)
    }, fullText.length * 150 + 800)

    // Remove from DOM after split animation completes
    removeTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => setIsLoading(false), 100)
    }, fullText.length * 150 + 800 + 500) // 500ms for split animation

    return () => {
      if (typeInterval) clearInterval(typeInterval)
      if (fadeTimer) clearTimeout(fadeTimer)
      if (removeTimer) clearTimeout(removeTimer)
    }
  }, [popComplete])

  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Left half - background behind logo */}
      <div 
        className={`absolute inset-y-0 left-0 w-1/2 bg-background transition-transform duration-500 ease-out ${
          splitExit ? "-translate-x-full" : ""
        }`}
      />
      {/* Right half - background behind text */}
      <div 
        className={`absolute inset-y-0 right-0 w-1/2 bg-background transition-transform duration-500 ease-out ${
          splitExit ? "translate-x-full" : ""
        }`}
      />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative">
          <img
            src="/logo.png"
            alt="Chocomotion"
            className={`h-24 w-24 ${
              splitExit
                ? "animate-slide-left"
                : logoScaled 
                  ? "animate-pop-rotate"
                  : "initial-state"
            }`}
          />
        </div>
        {logoScaled && (
          <div className={`flex items-center min-h-[4rem] ${
            splitExit ? "animate-slide-right" : ""
          }`}>
            <span className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground tracking-tight">
              {displayedText.slice(0, 5)}
              <span className="text-accent">{displayedText.slice(5)}</span>
              {!splitExit && displayedText.length < fullText.length && (
                <span className="animate-pulse">|</span>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

