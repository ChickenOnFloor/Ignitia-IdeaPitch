"use client"

import { useEffect } from "react"

export function ScrollAnimations() {
  useEffect(() => {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Observe all elements with scroll-animation class
    const elements = document.querySelectorAll("[data-scroll-animate]")
    elements.forEach((el) => observer.observe(el))

    // Parallax effect on scroll
    const handleParallax = () => {
      const parallaxElements = document.querySelectorAll("[data-parallax]")
      parallaxElements.forEach((el) => {
        const speed = Number.parseFloat(el.getAttribute("data-parallax") || "0.5")
        const yPos = window.scrollY * speed
        ;(el as HTMLElement).style.transform = `translateY(${yPos}px)`
      })
    }

    window.addEventListener("scroll", handleParallax, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleParallax)
      observer.disconnect()
    }
  }, [])

  return null
}
