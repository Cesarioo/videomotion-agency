"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <section id="contact" className="py-24 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <span className="text-sm text-primary-foreground/70 uppercase tracking-widest mb-4 block">
              Contact
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Pret a creer quelque
              <br />
              chose de delicieux ?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md">
              Que vous ayez un projet en tete ou que vous souhaitiez simplement explorer 
              les possibilites, nous serions ravis d'echanger avec vous. Lancons la conversation.
            </p>

            <div className="space-y-4">
              <div>
                <span className="text-sm text-primary-foreground/60 uppercase tracking-widest">Email</span>
                <p className="text-lg">bonjour@chocomotion.studio</p>
              </div>
              <div>
                <span className="text-sm text-primary-foreground/60 uppercase tracking-widest">Telephone</span>
                <p className="text-lg">+33 1 42 68 53 00</p>
              </div>
              <div>
                <span className="text-sm text-primary-foreground/60 uppercase tracking-widest">Adresse</span>
                <p className="text-lg">Paris, France</p>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-sm text-primary-foreground/80 mb-2 block">
                    Nom
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom"
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm text-primary-foreground/80 mb-2 block">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="text-sm text-primary-foreground/80 mb-2 block">
                  Entreprise (optionnel)
                </label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Votre entreprise"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-sm text-primary-foreground/80 mb-2 block">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Parlez-nous de votre projet..."
                  rows={5}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 resize-none"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2"
              >
                Envoyer le message
                <ArrowRight size={18} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
