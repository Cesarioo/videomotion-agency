"use client"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10 text-center">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground leading-tight mb-8 text-balance">
          Motion design that
          <br />
          <span className="text-accent">moves markets</span>
        </h1>

        <div className="max-w-4xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto"
          >
            <source src="https://cdn.pixabay.com/video/2016/08/18/4572-179384394_large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 text-pretty">
          We craft irresistibly smooth animations that captivate audiences, 
          elevate brands, and deliver results that taste like success.
        </p>
      </div>
    </section>
  )
}
