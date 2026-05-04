(function () {
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  var container = document.getElementById('particles-js')
  if (!container || !ctx) return

  container.appendChild(canvas)
  canvas.style.position = 'absolute'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  var particles = []
  var particleCount = 80
  var connectionDistance = 150
  var mouseDistance = 200
  var speed = 0.5

  var mouse = { x: null, y: null }

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })

  window.addEventListener('mouseleave', function () {
    mouse.x = null
    mouse.y = null
  })

  window.addEventListener('resize', resize)

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resize()

  function Particle() {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.vx = (Math.random() - 0.5) * speed
    this.vy = (Math.random() - 0.5) * speed
    this.size = Math.random() * 2 + 1
  }

  for (var i = 0; i < particleCount; i++) {
    particles.push(new Particle())
  }

  function getComputedStyle(property) {
    return getComputedStyle(document.documentElement).getPropertyValue(property).trim()
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    var isDark = document.documentElement.classList.contains('dark')
    var particleColor = isDark ? 'rgba(255, 255, 255,' : 'rgba(0, 0, 0,'
    var lineColor = isDark ? 'rgba(255, 255, 255,' : 'rgba(0, 0, 0,'

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i]

      p.x += p.vx
      p.y += p.vy

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = particleColor + '0.5)'
      ctx.fill()

      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j]
        var dx = p.x - p2.x
        var dy = p.y - p2.y
        var dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < connectionDistance) {
          ctx.beginPath()
          ctx.strokeStyle = lineColor + (1 - dist / connectionDistance) * 0.2 + ')'
          ctx.lineWidth = 1
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }

      if (mouse.x !== null) {
        var mdx = p.x - mouse.x
        var mdy = p.y - mouse.y
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy)

        if (mDist < mouseDistance) {
          ctx.beginPath()
          ctx.strokeStyle = lineColor + (1 - mDist / mouseDistance) * 0.3 + ')'
          ctx.lineWidth = 1
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }
    }

    requestAnimationFrame(animate)
  }

  animate()
})()
