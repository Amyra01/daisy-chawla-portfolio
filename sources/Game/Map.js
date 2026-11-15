import { clamp } from 'three/src/math/MathUtils.js'
import { Game } from './Game.js'
import gsap from 'gsap'

export class Map
{
    constructor()
    {
        this.game = Game.getInstance()

        this.initiated = false
        this.modal = this.game.modals.items.get('map')
        this.element = this.modal.element.querySelector('.js-map-container')
        this.orbit360Active = false
        this.lastBubbleZone = null
        this.lastBubbleTime = 0

        this.setTrigger()
        this.setInputs()
        this.setDaisyRoadmapAndHUD()

        this.modal.events.on('open', () =>
        {
            if(!this.initiated)
                this.init()

            this.texture.update()
        })
    }

    setDaisyRoadmapAndHUD()
    {
        const roadmap = document.getElementById('daisy-roadmap')
        const toggleBtn = document.getElementById('daisy-roadmap-toggle')
        const bubbleEl = document.getElementById('daisy-prop-bubble')

        if(toggleBtn && roadmap)
        {
            toggleBtn.addEventListener('click', () =>
            {
                const collapsed = roadmap.classList.toggle('is-collapsed')
                toggleBtn.textContent = collapsed ? 'Tour Guide 🗺️' : 'Hide'
                this.game.audio?.groups?.get('click')?.play(!collapsed)
            })
        }

        // Roadmap teleport & auto-open buttons
        const items = document.querySelectorAll('.daisy-roadmap-item[data-respawn]')
        items.forEach((btn) =>
        {
            btn.addEventListener('click', () =>
            {
                const respawnName = btn.getAttribute('data-respawn')
                const openTarget = btn.getAttribute('data-open')

                this.game.audio?.groups?.get('click')?.play(true)

                if(this.modal?.isOpen)
                    this.game.modals.close()
                if(this.game.menu?.isOpen)
                    this.game.menu.close()

                // Close open cinematic boards before teleporting
                if(this.game.world?.areas?.projects?.state === 3)
                    this.game.world.areas.projects.close()
                if(this.game.world?.areas?.lab?.state === 3)
                    this.game.world.areas.lab.close()

                // Reset to Drive camera if in Aerial
                this.setCameraPreset('drive')

                if(this.game.player && respawnName)
                {
                    this.game.world?.motherboardCircuit?.setNextTourStopAfter(respawnName)
                    this.game.player.respawn(respawnName, () =>
                    {
                        this.game.view.focusPoint.isTracking = true

                        if(openTarget === 'projects' && this.game.world?.areas?.projects)
                        {
                            gsap.delayedCall(0.85, () =>
                            {
                                this.game.world.areas.projects.open()
                            })
                        }
                        else if(openTarget === 'lab' && this.game.world?.areas?.lab)
                        {
                            gsap.delayedCall(0.85, () =>
                            {
                                this.game.world.areas.lab.open()
                            })
                        }
                    })
                }
            })
        })

        // Camera preset buttons (Drive / Aerial / 360° View)
        const camBtns = document.querySelectorAll('.daisy-cam-btn[data-cam]')
        camBtns.forEach((btn) =>
        {
            btn.addEventListener('click', () =>
            {
                const mode = btn.getAttribute('data-cam')
                this.game.audio?.groups?.get('click')?.play(true)
                this.setCameraPreset(mode)
            })
        })

        // Theme Mode buttons (Hybrid PCB / Cyber Motherboard / Classic Nature)
        const themeBtns = document.querySelectorAll('.daisy-theme-btn[data-theme]')
        themeBtns.forEach((btn) =>
        {
            btn.addEventListener('click', () =>
            {
                const theme = btn.getAttribute('data-theme')
                themeBtns.forEach(b => b.classList.toggle('is-active', b.getAttribute('data-theme') === theme))
                this.game.audio?.groups?.get('click')?.play(true)
                this.game.world?.motherboardCircuit?.setThemeMode(theme)

                if(theme === 'motherboard')
                    this.showPropBubble('💻 Full Cyber Motherboard Mode! Emerald PCB traces, 3D CPU Core, GPU Fans & DDR5 RAM active!')
                else if(theme === 'nature')
                    this.showPropBubble('🌿 Classic Nature Mode active! Switch back to ⚡ Hybrid PCB anytime!')
                else
                    this.showPropBubble('⚡ Hybrid Mode! Motherboard 3D CPU/GPU/RAM + Glowing PCB Circuit Traces + Nature World!')
            })
        })

        // Show initial welcome prop bubble after reveal
        if(bubbleEl)
        {
            gsap.delayedCall(3.5, () =>
            {
                this.showPropBubble('🍋 Welcome to Daisy Chawla’s 3D World! Use WASD / Arrows or the left Tour Guide!')
            })
        }

        // Initialize the second column: Animated About Me & Photo Showcase
        this.setDaisyAboutCarousel()

        // Tick for 360° camera orbit & proximity prop speech bubbles
        this.game.ticker.events.on('tick', () =>
        {
            if(this.orbit360Active && this.game.view)
            {
                this.game.view.spherical.theta += this.game.ticker.delta * 0.45
            }

            this.updatePropBubbles()
        }, 14)
    }

    setDaisyAboutCarousel()
    {
        const aboutCol = document.getElementById('daisy-about-col')
        const toggleBtn = document.getElementById('daisy-about-toggle')
        const stage = document.getElementById('daisy-photo-stage')
        const slides = document.querySelectorAll('#daisy-photo-stage .daisy-photo-slide')
        const dots = document.querySelectorAll('#daisy-photo-dots .daisy-photo-dot')
        const prevBtn = document.getElementById('daisy-photo-prev')
        const nextBtn = document.getElementById('daisy-photo-next')
        const badgeEl = document.getElementById('daisy-photo-badge')
        const storyBox = document.getElementById('daisy-about-story')
        const headlineEl = document.getElementById('daisy-about-headline')
        const descEl = document.getElementById('daisy-about-desc')
        const progressEl = document.getElementById('daisy-photo-progress')

        if(!aboutCol || slides.length === 0)
            return

        if(toggleBtn)
        {
            toggleBtn.addEventListener('click', () =>
            {
                const collapsed = aboutCol.classList.toggle('is-collapsed')
                toggleBtn.textContent = collapsed ? '📸 About Me' : 'Hide'
                this.game.audio?.groups?.get('click')?.play(!collapsed)
            })
        }

        const stories = [
            {
                badge: '🎙️ Speaker & Debater',
                headline: 'Hi, I’m Daisy Chawla!',
                desc: 'AI & Full-Stack Developer pursuing B.Tech in CSE at PCTE Group of Institutes (2023–2027) with an 8.39 / 10 CGPA.'
            },
            {
                badge: '🧠 AI & Full-Stack Builder',
                headline: 'Engineering Smart Solutions',
                desc: 'Passionate about building scalable web & AI systems using Python, React, TypeScript, Java, Node.js, and Machine Learning.'
            },
            {
                badge: '⚖️ Creator of JusticeFlow AI',
                headline: 'Legal-Tech & 3D Web Innovator',
                desc: 'Lead developer of JusticeFlow AI — an AI-powered legal intelligence & workflow platform deployed live on Vercel.'
            },
            {
                badge: '🚀 3x Internship Alumna',
                headline: 'IIT Roorkee • Digimantra • Acmegrade',
                desc: 'Hands-on industry training in AI/ML with IIT Roorkee, Java Software Development at Digimantra Labs, and Web Dev at Acmegrade.'
            },
            {
                badge: '🏆 4x Hackathon Finalist',
                headline: 'Competing Across India',
                desc: 'National finalist & builder at Thapar Hackathon, NIT Delhi Code Slayer 2K25, Code for Bharat Season 2, and Zomatothon.'
            },
            {
                badge: '🌍 Leadership & Recognition',
                headline: 'Debate LOR & Campus Leader',
                desc: 'Honored with Letters of Recommendation & Appreciation for British Parliamentary Debate and organizing major university events.'
            }
        ]

        let currentSlide = 0
        let isPaused = false
        let elapsedMs = 0
        const durationMs = 4500

        const goToSlide = (index) =>
        {
            currentSlide = (index + slides.length) % slides.length
            elapsedMs = 0

            slides.forEach((img, idx) =>
            {
                img.classList.toggle('is-active', idx === currentSlide)
            })

            dots.forEach((dot, idx) =>
            {
                dot.classList.toggle('is-active', idx === currentSlide)
            })

            const story = stories[currentSlide] || stories[0]
            if(storyBox)
            {
                storyBox.classList.add('is-animating')
                setTimeout(() =>
                {
                    if(badgeEl) badgeEl.textContent = story.badge
                    if(headlineEl) headlineEl.textContent = story.headline
                    if(descEl) descEl.textContent = story.desc
                    storyBox.classList.remove('is-animating')
                }, 160)
            }
        }

        if(prevBtn)
        {
            prevBtn.addEventListener('click', (e) =>
            {
                e.stopPropagation()
                this.game.audio?.groups?.get('click')?.play(true)
                goToSlide(currentSlide - 1)
            })
        }

        if(nextBtn)
        {
            nextBtn.addEventListener('click', (e) =>
            {
                e.stopPropagation()
                this.game.audio?.groups?.get('click')?.play(true)
                goToSlide(currentSlide + 1)
            })
        }

        dots.forEach((dot) =>
        {
            dot.addEventListener('click', () =>
            {
                const idx = parseInt(dot.getAttribute('data-slide') || '0', 10)
                this.game.audio?.groups?.get('click')?.play(true)
                goToSlide(idx)
            })
        })

        if(stage)
        {
            stage.addEventListener('mouseenter', () => { isPaused = true })
            stage.addEventListener('mouseleave', () => { isPaused = false })
        }

        setInterval(() =>
        {
            if(isPaused || aboutCol.classList.contains('is-collapsed'))
                return

            elapsedMs += 100
            if(progressEl)
            {
                progressEl.style.width = `${Math.min(100, (elapsedMs / durationMs) * 100)}%`
            }

            if(elapsedMs >= durationMs)
            {
                goToSlide(currentSlide + 1)
            }
        }, 100)
    }

    setCameraPreset(mode)
    {
        const camBtns = document.querySelectorAll('.daisy-cam-btn[data-cam]')
        camBtns.forEach(b => b.classList.toggle('is-active', b.getAttribute('data-cam') === mode))

        if(!this.game.view)
            return

        if(mode === 'aerial')
        {
            this.orbit360Active = false
            // Full Top-Down 3D Bird's-Eye View showing the entire 3D world from above
            this.game.view.spherical.phi = Math.PI * 0.11
            this.game.view.spherical.theta = Math.PI * 0.25
            this.game.view.spherical.radius.edges.min = 36
            this.game.view.spherical.radius.edges.max = 185
            this.game.view.zoom.baseRatio = 0.08
            this.game.view.zoom.ratio = 0.08
            this.game.view.focusPoint.isTracking = false
            this.game.view.focusPoint.magnet.active = false
            this.game.view.focusPoint.position.set(0, 0, -4)
            if(this.game.rendering?.cheapDOFPass)
                this.game.rendering.cheapDOFPass.amount.value = 0
            this.game.view.optimalArea?.update?.()
            this.showPropBubble('🦅 Full 3D View From Above! Scroll to zoom, drag to pan, or click 🚗 Drive to return!')
        }
        else if(mode === 'orbit360')
        {
            this.orbit360Active = true
            this.game.view.spherical.phi = Math.PI * 0.22
            this.game.view.spherical.radius.edges.min = 20
            this.game.view.spherical.radius.edges.max = 88
            this.game.view.zoom.baseRatio = 0.22
            this.game.view.zoom.ratio = 0.22
            this.game.view.focusPoint.isTracking = true
            this.game.view.focusPoint.magnet.active = true
            if(this.game.rendering?.cheapDOFPass)
                this.game.rendering.cheapDOFPass.amount.value = 0
            this.game.view.optimalArea?.update?.()
            this.showPropBubble('🔄 360° Panoramic 3D Orbit active! Enjoy the full view around Daisy’s world!')
        }
        else
        {
            this.orbit360Active = false
            this.game.view.spherical.phi = Math.PI * (this.game.quality?.level === 0 ? 0.31 : 0.27)
            this.game.view.spherical.theta = Math.PI * 0.25
            this.game.view.spherical.radius.edges.min = 15
            this.game.view.spherical.radius.edges.max = 30
            this.game.view.zoom.baseRatio = 0.6
            this.game.view.zoom.ratio = 0.6
            this.game.view.focusPoint.isTracking = true
            this.game.view.focusPoint.magnet.active = true
            if(this.game.rendering?.cheapDOFPass)
                this.game.rendering.cheapDOFPass.amount.value = 0.003
            this.game.view.optimalArea?.update?.()
        }
    }

    showPropBubble(text)
    {
        const bubbleEl = document.getElementById('daisy-prop-bubble')
        if(!bubbleEl)
            return

        bubbleEl.textContent = text
        bubbleEl.classList.add('is-visible')

        if(this.bubbleHideTimer)
            clearTimeout(this.bubbleHideTimer)

        this.bubbleHideTimer = setTimeout(() =>
        {
            bubbleEl.classList.remove('is-visible')
        }, 4800)
    }

    updatePropBubbles()
    {
        if(!this.game.player || !this.game.respawns)
            return

        const now = this.game.ticker.elapsed
        if(now - this.lastBubbleTime < 6.5)
            return

        const pos = this.game.player.position
        const zoneMessages = [
            { name: 'projects', radius: 13, msg: '⚖️ JusticeFlow AI & GPU Cluster! Spin the fans & press ENTER to open Projects!' },
            { name: 'career', radius: 14, msg: '🎓 DDR5 RAM Towers • B.Tech CSE @ PCTE (CGPA 8.39) • IIT Roorkee • Digimantra • Acmegrade!' },
            { name: 'lab', radius: 13, msg: '🧪 VRM Capacitors & Verified Certificates Lab! Press ENTER to inspect credentials!' },
            { name: 'social', radius: 12, msg: '💻 Connect with Daisy: GitHub @Amyra01, LinkedIn & Official Resume PDF!' },
            { name: 'bowling', radius: 13, msg: '🎳 Yay bowling time! Hold SHIFT to boost into the pins for a strike!' },
            { name: 'cookie', radius: 12, msg: '🍪 Yum! Giant cookies fresh from the oven — grab them with your car!' },
            { name: 'circuit', radius: 14, msg: '🏎️ Race Circuit! Drive across the starting line to trigger the lap timer!' },
            { name: 'timeMachine', radius: 11, msg: '⚡ Motherboard Overclock & JusticeFlow AI Core! Press ENTER to overclock!' },
            { name: 'landing', radius: 10, msg: '✨ Daisy’s AI CPU Core Hub! Knock over the 3D DAISY CHAWLA letters or press H to honk!' }
        ]

        for(const z of zoneMessages)
        {
            const respawn = this.game.respawns.getByName(z.name)
            if(respawn)
            {
                const d = Math.hypot(pos.x - respawn.position.x, pos.z - respawn.position.z)
                if(d < z.radius && this.lastBubbleZone !== z.name)
                {
                    this.lastBubbleZone = z.name
                    this.lastBubbleTime = now
                    this.showPropBubble(z.msg)
                    return
                }
            }
        }

        // Fun random prop messages while driving fast
        const speed = Math.abs(this.game.physicalVehicle?.forwardSpeed || 0)
        if(speed > 9 && now - this.lastBubbleTime > 11)
        {
            const funQuips = [
                '🍋 Yay I love lemons! Keep cruising through Daisy’s 3D portfolio!',
                '💥 Smash those crates & bricks — press Reset anytime to restore them!',
                '🎵 Kounine’s soundtrack is playing! Press L to mute/unmute or H to honk!',
                '🚀 Turbo mode! Press SPACE to jump and SHIFT to boost!',
                '🌟 Tip: Click any stop on the left Tour Guide to teleport there instantly!'
            ]
            const quip = funQuips[Math.floor(Math.random() * funQuips.length)]
            this.lastBubbleTime = now
            this.showPropBubble(quip)
        }
    }

    init()
    {
        this.initiated = true
        
        this.setLocations()
        this.setPlayer()
        this.setTexture()

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 14)
    }

    setLocations()
    {
        this.locations = {}
        this.locations.items = [
            { name: 'Achievements', respawnName: 'achievements', offset: { x: 0, y: -0.01 } },
            { name: 'Altar', respawnName: 'altar', offset: { x: 0, y: -0.05 } },
            { name: 'Credentials<br /> & Stack', respawnName: 'behindTheScene', offset: { x: 0.01, y: 0 } },
            { name: 'Bowling', respawnName: 'bowling', offset: { x: -0.08, y: 0.03 } },
            { name: 'Career (8.39)', respawnName: 'career', offset: { x: 0, y: -0.06 } },
            { name: 'Circuit', respawnName: 'circuit', offset: { x: -0.08, y: -0.05 } },
            { name: 'Cookie', respawnName: 'cookie', offset: { x: -0.02, y: -0.01 } },
            { name: 'Certs Lab', respawnName: 'lab', offset: { x: -0.03, y: 0 } },
            { name: 'Daisy Home', respawnName: 'landing', offset: { x: 0.02, y: 0 } },
            { name: 'Projects', respawnName: 'projects', offset: { x: 0, y: -0.02 } },
            { name: 'Social & Links', respawnName: 'social', offset: { x: -0.01, y: -0.04 } },
            { name: 'Overclock<br />AI Core', respawnName: 'timeMachine', offset: { x: 0, y: 0 } },
        ]

        for(const item of this.locations.items)
        {
            const respawn = this.game.respawns.getByName(item.respawnName)
            const mapPosition = this.worldToMap(respawn.position)

            // HTML
            const html = /* html */`
                <div class="pin"></div>
                <div class="name-container">
                    <div class="name">${item.name}</div>
                </div>
            `

            const element = document.createElement('div')
            element.classList.add('location')
            element.innerHTML = html
            element.style.left = `${(mapPosition.x + item.offset.x)* 100}%`
            element.style.top = `${(mapPosition.y + item.offset.y)* 100}%`
            element.style.zIndex = Math.round(mapPosition.y * 1000)
            
            this.element.append(element)

            element.addEventListener('click', () =>
            {
                this.game.player.respawn(item.respawnName, () =>
                {
                    this.game.view.focusPoint.isTracking = true
                })
                this.game.modals.close()
            })
        }
    }
    
    setPlayer()
    {
        this.player = {}
        this.player.element = this.element.querySelector('.js-player')
        this.player.roundedPosition = { x: 0, y: 0 }
    }
    
    setTexture()
    {
        this.texture = {}
        this.texture.element = this.element.querySelector('.js-texture')
        this.texture.previousUrl = null

        this.texture.element.addEventListener('load', () =>
        {
            this.texture.element.classList.add('is-visible')
        })
        
        this.texture.update = () =>
        {
            const url = this.game.dayCycles.intervalEvents.get('night').inInterval ? 'ui/map/map-night.webp' : 'ui/map/map-day.webp'

            if(url !== this.texture.previousUrl)
            {
                this.texture.element.classList.remove('is-visible')
                this.texture.previousUrl = url
                this.texture.element.src = url
            }
        }
    }

    setTrigger()
    {
        const element = this.game.domElement.querySelector('.js-map-trigger')
        
        element.addEventListener('click', (event) =>
        {
            this.game.modals.open('map')
        })
        element.addEventListener('keydown', (event) =>
        {
            event.preventDefault()
        })
    }

    setInputs()
    {
        // Inputs keyboard
        this.game.inputs.addActions([
            { name: 'map', categories: [ 'modal', 'menu', 'wandering' ], keys: [ 'Keyboard.m', 'Keyboard.KeyM' ] },
        ])
        this.game.inputs.events.on('map', (action) =>
        {
            if(action.active)
            {
                if(!this.modal.isOpen)
                    this.game.modals.open('map')
                else
                    this.game.modals.close()
            }
        })
    }

    worldToMap(coordinates)
    {
        let x = coordinates.x
        let y = typeof coordinates.z !== 'undefined' ? coordinates.z : coordinates.y

        x /= this.game.terrain.size
        y /= this.game.terrain.size

        x += 0.5
        y += 0.5

        x = clamp(x, 0, 1)
        y = clamp(y, 0, 1)

        return { x, y }
    }

    update()
    {
        if(!this.modal.isOpen)
            return

        const playerRoundedX = Math.round(this.game.player.position.x)
        const playerRoundedY = Math.round(this.game.player.position.z)

        if(playerRoundedX !== this.player.roundedPosition.x || playerRoundedY !== this.player.roundedPosition.y)
        {
            this.player.roundedPosition.x = playerRoundedX
            this.player.roundedPosition.y = playerRoundedY

            const playerCoordinates = this.worldToMap(this.player.roundedPosition)
            const x = Math.round(playerCoordinates.x * 1000) / 10
            const y = Math.round(playerCoordinates.y * 1000) / 10

            this.player.element.style.left = `${x}%`
            this.player.element.style.top = `${y}%`
            this.player.element.style.transform = `rotate(${-this.game.physicalVehicle.yRotation}rad)`
        }
    }
}
