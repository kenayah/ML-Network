(function () {
  'use strict'

  // ---- Scroll Reveal ----
  const revealEls = document.querySelectorAll('.scroll-reveal')
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target
            const delay = el.dataset.delay || 0
            el.style.transitionDelay = delay + 's'
            el.classList.add('revealed')
            revealObserver.unobserve(el)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    revealEls.forEach((el) => revealObserver.observe(el))
  }

  // ---- Hero Parallax ----
  const hero = document.querySelector('.parallax-hero')
  if (hero) {
    const heroBg = hero.querySelector('.hero-bg')
    const heroOverlay = hero.querySelector('.hero-overlay')
    const heroContent = hero.querySelector('.hero-content')
    const heroLogo = hero.querySelector('.hero-logo')
    const heroTitle = hero.querySelector('h1')
    const heroSub = hero.querySelector('p')
    const heroBtn = hero.querySelector('.btn')
    let ticking = false

    const onHeroScroll = () => {
      const rect = hero.getBoundingClientRect()
      const heroTop = rect.top
      const heroH = rect.height
      const viewH = window.innerHeight

      const scrolled = -heroTop
      const progress = Math.min(Math.max(scrolled / heroH, 0), 1)

      if (heroBg) heroBg.style.transform = 'translateY(' + scrolled * -0.35 + 'px)'
      if (heroOverlay) heroOverlay.style.transform = 'translateY(' + scrolled * -0.35 + 'px)'

      if (progress > 0) {
        if (heroContent) {
          heroContent.style.opacity = Math.max(1 - progress * 1.5, 0)
          heroContent.style.transform = 'translateY(' + -progress * 30 + 'px)'
        }
        if (heroLogo) heroLogo.style.transform = 'scale(' + Math.max(1 - progress * 0.15, 0.85) + ')'
        if (heroTitle) heroTitle.style.transform = 'translateY(' + progress * 20 + 'px)'
        if (heroSub) heroSub.style.transform = 'translateY(' + progress * 30 + 'px)'
        if (heroBtn) heroBtn.style.transform = 'translateY(' + progress * 40 + 'px)'
      } else {
        if (heroContent) {
          heroContent.style.opacity = 1
          heroContent.style.transform = ''
        }
        if (heroLogo) heroLogo.style.transform = ''
        if (heroTitle) heroTitle.style.transform = ''
        if (heroSub) heroSub.style.transform = ''
        if (heroBtn) heroBtn.style.transform = ''
      }

      ticking = false
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onHeroScroll)
        ticking = true
      }
    })
    onHeroScroll()
  }

  // ---- Active Nav Link Tracking ----
  const navLinks = document.querySelectorAll('.sticky-nav-inner a')
  if (navLinks.length) {
    const sections = []
    navLinks.forEach((link) => {
      const id = link.getAttribute('href')
      if (id && id.startsWith('#')) sections.push(document.getElementById(id.slice(1)))
    })

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id')
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id)
            })
          }
        })
      },
      { threshold: 0.3, rootMargin: '-64px 0px 0px 0px' }
    )

    sections.forEach((s) => {
      if (s) navObserver.observe(s)
    })
  }

  // ---- Stats Counter ----
  const statValues = document.querySelectorAll('.stat-value')
  if (statValues.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target
            const text = el.textContent.trim()
            const match = text.match(/^(\d+)(.*)$/)
            if (match) {
              const target = parseInt(match[1], 10)
              const suffix = match[2]
              el.textContent = '0' + suffix
              const duration = 2000
              const start = performance.now()
              function update(now) {
                const elapsed = now - start
                const p = Math.min(elapsed / duration, 1)
                const eased = 1 - (1 - p) * (1 - p)
                el.textContent = Math.round(eased * target) + suffix
                if (p < 1) requestAnimationFrame(update)
              }
              requestAnimationFrame(update)
            }
            counterObserver.unobserve(el)
          }
        })
      },
      { threshold: 0.5 }
    )
    statValues.forEach((v) => counterObserver.observe(v))
  }

  // ---- Section-Divider Parallax ----
  const dividers = document.querySelectorAll('.section-divider')
  if (dividers.length) {
    let ticking = false
    function onDividerScroll() {
      dividers.forEach((div) => {
        const img = div.querySelector('.section-divider-bg img')
        if (!img) return
        const rect = div.getBoundingClientRect()
        const viewH = window.innerHeight
        const offset = (rect.top + rect.height / 2 - viewH / 2) / viewH
        img.style.transform = 'translateY(' + offset * -15 + 'px)'
      })
      ticking = false
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(onDividerScroll)
        ticking = true
      }
    })
    onDividerScroll()
  }
})()
