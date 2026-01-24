"use client"

import { useState, useEffect, useRef } from "react"

const projects = [
  {
    id: 1,
    company: "Slack",
    logo: "/clients/slack.png",
    flavor: "Vanilla Flavor",
    description: "Vanilla flavor video for presenting the essential package. Perfect for startups and growing brands ready to make their mark. Includes concept development, storyboard, and HD delivery.",
    video: "https://cdn.pixabay.com/video/2020/07/03/43781-436252322_large.mp4",
  },
  {
    id: 2,
    company: "Notion",
    logo: "/clients/notion.png",
    flavor: "Rasberry Flavor",
    description: "Rasberry flavor video for presenting our most popular choice. Built for marketing campaigns and product launches that demand attention. Includes advanced motion graphics, original music, and multi-format deliverables.",
    video: "https://cdn.pixabay.com/video/2021/05/18/74457-552236120_large.mp4",
  },
  {
    id: 3,
    company: "ClickUp",
    logo: "/clients/clickup.png",
    flavor: "Vanilla Flavor",
    description: "Vanilla flavor video for presenting the essential package. Perfect for startups and growing brands ready to make their mark. Includes concept development, storyboard, and HD delivery.",
    video: "https://cdn.pixabay.com/video/2020/03/14/33698-398277503_large.mp4",
  },
  {
    id: 4,
    company: "Prosperian",
    logo: "/clients/prosperian.png",
    flavor: "Caramel Flavor",
    description: "Caramel flavor video for presenting the complete premium experience. For brands that refuse to compromise. Includes 3D animation, full creative direction, and strategic partnership.",
    video: "https://cdn.pixabay.com/video/2019/03/30/22464-328008656_large.mp4",
  },
]

export function WorkSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    // Autoplay all videos on mount
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch(() => {
          // Autoplay was prevented, ignore
        })
      }
    })
  }, [])

  return (
    <section id="work" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="text-sm text-accent uppercase tracking-widest mb-4 block">
              Example work
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground text-balance">
              Crafted with passion,
              <br />
              delivered with impact
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <video
                ref={(el) => { videoRefs.current[project.id - 1] = el }}
                src={project.video}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />

              {/* Project info overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent">
                {/* Bottom section that slides up on hover */}
                <div
                  className={`transition-all duration-300 ease-out ${
                    hoveredId === project.id
                      ? "translate-y-0"
                      : "translate-y-24"
                  }`}
                >
                  {/* Logo and Flavor label */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={project.logo}
                      alt={project.company}
                      className="h-8 w-auto brightness-0 invert"
                    />
                    <span className="text-xs text-primary-foreground/90 uppercase tracking-widest font-medium">
                      {project.flavor}
                    </span>
                  </div>

                  {/* Description that appears on hover */}
                  <p
                    className={`text-sm text-primary-foreground/90 transition-all duration-300 ${
                      hoveredId === project.id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
