"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Check, ExternalLink, Mail, Volume2 } from "lucide-react"
import Image from "next/image"

interface Company {
  id: string
  name: string
  websiteUrl: string
  employees: number
  industry: string
  campaignId: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  logoUrl: string
  valueProp: string
  features: string[]
  targetAudience: string
  voiceTone: string
  videoStatus: "none" | "demo_scheduled" | "demo_started" | "demo_finished" | "final_progress" | "final"
  createdAt: string
  updatedAt: string
}

interface DemoVideo {
  id: string
  companyId: string
  videoLink: string
  createdAt: string
  updatedAt: string
}

interface ProspectLandingProps {
  company: Company
  demoVideo: DemoVideo | null
}

export function ProspectLanding({ company, demoVideo }: ProspectLandingProps) {
  const [showPlayButton, setShowPlayButton] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      setTimeout(() => {
        if (videoRef.current && videoRef.current.paused) {
          setShowPlayButton(true)
        }
      }, 500)
    }
  }, [])

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
      setShowPlayButton(false)
    }
  }

  const handleVideoError = () => {
    setShowPlayButton(true)
  }

  const handleVideoCanPlay = () => {
    if (videoRef.current && !videoRef.current.paused) {
      setShowPlayButton(false)
      setIsPlaying(true)
    }
  }

  const handleVideoPlaying = () => {
    setShowPlayButton(false)
    setIsPlaying(true)
  }

  const handleVideoPause = () => {
    setIsPlaying(false)
    setShowPlayButton(true)
  }

  const hasVideo = demoVideo && company.videoStatus !== "none"
  const isVideoReady = company.videoStatus === "demo_finished" || company.videoStatus === "final"

  return (
    <main
      className="min-h-screen"
      style={{
        "--company-primary": company.primaryColor,
        "--company-secondary": company.secondaryColor,
      } as React.CSSProperties}
    >
      {/* Hero Section with Video */}
      <section className="relative min-h-screen flex items-center justify-center pt-8 pb-16 overflow-hidden">
        {/* Decorative background elements using company colors */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: company.primaryColor }}
          />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: company.secondaryColor }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-10">
          {/* Hero Heading with Logo */}
          <div className="text-center mb-10">
            <h1 className="font-serif gap-5 text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-2 h-12 md:h-16 lg:h-20 flex items-center justify-center">
              <span>Hello </span>
              {company.logoUrl && (
                <Image
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  width={200}
                  height={200}
                  className="inline-block align-middle h-[0.7em] w-auto mx-1"
                  unoptimized
                />
              )}
              <span>!</span>
            </h1>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
              <span>We made a video </span>
              <span style={{ color: company.secondaryColor }}>just for you</span>
            </h2>
          </div>

          {/* Video Player */}
          {hasVideo && isVideoReady && demoVideo ? (
            <div className="max-w-4xl mx-auto mb-12 relative">
              {/* Sound on indicator */}
              <div className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 translate-x-full hidden lg:flex items-center gap-2 ml-4 pl-4">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg animate-pulse"
                  style={{ backgroundColor: company.primaryColor }}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Sound on!</span>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-auto"
                  onError={handleVideoError}
                  onCanPlay={handleVideoCanPlay}
                  onPlaying={handleVideoPlaying}
                  onPause={handleVideoPause}
                >
                  <source src={demoVideo.videoLink} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {showPlayButton && (
                  <button
                    onClick={handlePlayClick}
                    className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity hover:bg-background/90 group"
                    aria-label="Play video"
                  >
                    <div
                      className="flex items-center justify-center w-24 h-24 rounded-full text-white shadow-lg transition-transform hover:scale-110 group-hover:scale-110"
                      style={{ backgroundColor: company.primaryColor }}
                    >
                      <Play className="w-12 h-12 ml-1" fill="currentColor" />
                    </div>
                  </button>
                )}
              </div>

              {/* Sound on indicator for mobile - below video */}
              <div className="flex lg:hidden justify-center mt-4">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg animate-pulse"
                  style={{ backgroundColor: company.primaryColor }}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Sound on!</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl relative bg-muted aspect-video flex items-center justify-center">
              <div className="text-center p-8">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: company.primaryColor + "20" }}
                >
                  <Play
                    className="w-10 h-10"
                    style={{ color: company.primaryColor }}
                  />
                </div>
                <p className="text-muted-foreground text-lg">
                  {company.videoStatus === "none" && "Your personalized video is being prepared..."}
                  {company.videoStatus === "demo_scheduled" && "Your demo video is scheduled for creation..."}
                  {company.videoStatus === "demo_started" && "Your demo video is being created..."}
                  {company.videoStatus === "final_progress" && "Your final video is in progress..."}
                </p>
              </div>
            </div>
          )}

          {/* Description below video */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground text-pretty text-center mb-12">
            Watch how Chocomotion can help {company.name} captivate your audience
            with motion design that moves markets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="mailto:hello@chocomotion.studio?subject=I%20want%20to%20work%20with%20Chocomotion"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{ backgroundColor: company.primaryColor }}
            >
              <Mail className="w-5 h-5" />
              Let&apos;s Talk
            </a>
            <a
              href={company.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-lg border-2 hover:bg-muted transition-all"
              style={{ borderColor: company.primaryColor, color: company.primaryColor }}
            >
              <ExternalLink className="w-5 h-5" />
              Visit {company.name}
            </a>
          </div>
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
            Why work with us?
          </h3>
          <p className="text-lg md:text-xl text-foreground leading-relaxed text-pretty mb-2">
            We already know your business and your audience.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty mb-8">
            {company.valueProp}
          </p>
          <div
            className="inline-block px-6 py-3 rounded-xl text-sm md:text-base"
            style={{ backgroundColor: company.primaryColor + "15", color: company.primaryColor }}
          >
            <span className="font-medium">Your audience:</span> {company.targetAudience}
          </div>
        </div>
      </section>

      {/* What We Know Section */}
      {company.features && company.features.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-serif text-3xl md:text-4xl text-foreground text-center mb-4">
              We understand what you do
            </h3>
            <p className="text-center text-muted-foreground mb-12">
              Your key offerings that we can bring to life through motion:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {company.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-xl bg-background border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: company.primaryColor + "20" }}
                  >
                    <Check
                      className="w-5 h-5"
                      style={{ color: company.primaryColor }}
                    />
                  </div>
                  <p className="text-foreground font-medium pt-2">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
            Ready to bring your brand to life?
          </h3>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Let&apos;s create motion design that captures the essence of {company.name}
            and connects with your audience.
          </p>
          <a
            href="mailto:hello@chocomotion.studio?subject=I%20want%20to%20work%20with%20Chocomotion"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full text-white font-medium text-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            style={{ backgroundColor: company.primaryColor }}
          >
            <Mail className="w-6 h-6" />
            Get Started
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            Made with care by{" "}
            <a
              href="https://chocomotion.agency"
              className="hover:text-foreground transition-colors"
              style={{ color: company.primaryColor }}
            >
              Chocomotion
            </a>
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
