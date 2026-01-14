import React, { useRef, useEffect } from 'react'
import './Particles.css'

export default function Particles({ count = 150 }){
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if(!canvas) return
    const ctx = canvas.getContext('2d')

    let width = window.innerWidth
    let height = window.innerHeight
    const DPR = Math.max(window.devicePixelRatio || 1, 1)

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      canvas.width = Math.floor(width * DPR)
      canvas.height = Math.floor(height * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Particle class
    class Particle {
      constructor(){ this.reset() }
      reset(){
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 2 + 0.6
        this.speedX = Math.random() * 1.6 - 0.8
        this.speedY = Math.random() * 1.6 - 0.8
        this.opacity = Math.random() * 0.5 + 0.15
      }
      update(){
        this.x += this.speedX
        this.y += this.speedY
        if (this.x < -10) this.x = width + 10
        if (this.x > width + 10) this.x = -10
        if (this.y < -10) this.y = height + 10
        if (this.y > height + 10) this.y = -10
      }
      draw(){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 230, 255, ${this.opacity})`
        ctx.fill()
      }
    }

    let particles = Array.from({ length: count }, () => new Particle())

    // mouse interaction
    let mouseX = -9999
    let mouseY = -9999
    function onMove(e){ mouseX = e.clientX; mouseY = e.clientY }
    document.addEventListener('mousemove', onMove)

    let rafId = null
    function animate(){
      ctx.clearRect(0,0,width,height)

      // draw particles
      particles.forEach(p => { p.update(); p.draw() })

      // draw lines between close particles
      for(let i=0;i<particles.length;i++){
        const p1 = particles[i]
        for(let j=i+1;j<particles.length;j++){
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if(dist < 100){
            ctx.beginPath()
            ctx.strokeStyle = `rgba(170,220,255, ${0.08 * (1 - dist/100)})`
            ctx.lineWidth = 0.6
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }

        // mouse repulse
        const dx = p1.x - mouseX
        const dy = p1.y - mouseY
        const dist = Math.sqrt(dx*dx + dy*dy)
        if(dist < 150){
          const angle = Math.atan2(dy, dx)
          const force = (150 - dist) / 150
          p1.x += Math.cos(angle) * force * 2
          p1.y += Math.sin(angle) * force * 2
        }
      }

      rafId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('mousemove', onMove)
    }
  }, [count])

  return <canvas id="particles" ref={canvasRef} className="particles-canvas" />
}
