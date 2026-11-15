import * as THREE from 'three/webgpu'
import { color, uniform } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { InteractivePoints } from '../InteractivePoints.js'

export class MotherboardCircuit
{
    constructor()
    {
        this.game = Game.getInstance()
        this.group = new THREE.Group()
        this.group.name = 'daisyMotherboardArchitecture'
        this.game.scene.add(this.group)

        this.fans = []
        this.floatingRings = []
        this.dataPackets = []
        this.themeMode = 'hybrid'

        this.setMaterials()
        this.setCpuCoreAtLanding()
        this.setPhotoBillboardAtLanding()
        this.setRamTowersAtCareer()
        this.setGpuUnitAtProjects()
        this.setNvmeAndCapacitorsAtLab()
        this.setOverclockCoreAtTimeMachineSpot()
        this.setPcbBusTraces()
        this.setJeepDirectionArrow()

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 11)
    }

    setMaterials()
    {
        this.materials = {}

        this.materials.pcbDark = new MeshDefaultMaterial({
            colorNode: color('#0b241e'),
            hasWater: false
        })

        this.materials.heatsinkMetal = new MeshDefaultMaterial({
            colorNode: color('#252b37'),
            hasWater: false
        })

        this.materials.siliconDie = new MeshDefaultMaterial({
            colorNode: color('#162032'),
            hasWater: false
        })

        this.materials.copperGold = new THREE.MeshBasicNodeMaterial({
            color: new THREE.Color('#ffb646').multiplyScalar(1.65)
        })

        this.materials.cyanGlow = new THREE.MeshBasicNodeMaterial({
            color: new THREE.Color('#00f2fe').multiplyScalar(2.1)
        })

        this.materials.purpleGlow = new THREE.MeshBasicNodeMaterial({
            color: new THREE.Color('#b65fff').multiplyScalar(2.1)
        })

        this.materials.orangeGlow = new THREE.MeshBasicNodeMaterial({
            color: new THREE.Color('#ff8039').multiplyScalar(2.1)
        })

        this.materials.greenGlow = new THREE.MeshBasicNodeMaterial({
            color: new THREE.Color('#4ade80').multiplyScalar(2.0)
        })
    }

    getPos(name, offsetX = 0, offsetZ = 0)
    {
        const respawn = this.game.respawns?.getByName(name)
        if(respawn)
        {
            return new THREE.Vector3(respawn.position.x + offsetX, 0, respawn.position.z + offsetZ)
        }
        return new THREE.Vector3(offsetX, 0, offsetZ)
    }

    setCpuCoreAtLanding()
    {
        const center = this.getPos('landing', 0, -2.5)
        const cpuGroup = new THREE.Group()
        cpuGroup.position.copy(center)

        // Flat PCB CPU Socket Base on the ground (drive-over friendly)
        const socketFrame = new THREE.Mesh(
            new THREE.BoxGeometry(7.6, 0.05, 7.6),
            this.materials.pcbDark
        )
        socketFrame.position.y = 0.025
        socketFrame.receiveShadow = true
        cpuGroup.add(socketFrame)

        // Inner Silicon Die Plate
        const diePlate = new THREE.Mesh(
            new THREE.BoxGeometry(4.8, 0.07, 4.8),
            this.materials.siliconDie
        )
        diePlate.position.y = 0.035
        diePlate.receiveShadow = true
        cpuGroup.add(diePlate)

        // Glowing Cyan Circuit Border around the Silicon Die
        const borderPositions = [
            [ 0, 0.045, -2.45, 5.0, 0.04, 0.12 ],
            [ 0, 0.045,  2.45, 5.0, 0.04, 0.12 ],
            [ -2.45, 0.045, 0, 0.12, 0.04, 5.0 ],
            [  2.45, 0.045, 0, 0.12, 0.04, 5.0 ]
        ]
        for(const [ x, y, z, w, h, d ] of borderPositions)
        {
            const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), this.materials.cyanGlow)
            bar.position.set(x, y, z)
            cpuGroup.add(bar)
        }

        // Gold LGA Pin Strips along all 4 sides of the CPU socket
        for(let i = -3.0; i <= 3.0; i += 0.5)
        {
            const pinN = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.65), this.materials.copperGold)
            pinN.position.set(i, 0.035, -3.15)
            cpuGroup.add(pinN)

            const pinS = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.65), this.materials.copperGold)
            pinS.position.set(i, 0.035, 3.15)
            cpuGroup.add(pinS)

            const pinW = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.18), this.materials.copperGold)
            pinW.position.set(-3.15, 0.035, i)
            cpuGroup.add(pinW)

            const pinE = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.18), this.materials.copperGold)
            pinE.position.set(3.15, 0.035, i)
            cpuGroup.add(pinE)
        }

        // 4 Corner SMD Capacitor Pillars with Status LEDs
        const corners = [
            [ -3.6, -3.6, this.materials.cyanGlow ],
            [  3.6, -3.6, this.materials.orangeGlow ],
            [ -3.6,  3.6, this.materials.greenGlow ],
            [  3.6,  3.6, this.materials.purpleGlow ]
        ]
        for(const [ cx, cz, glowMat ] of corners)
        {
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.35, 12), this.materials.heatsinkMetal)
            post.position.set(cx, 0.175, cz)
            post.castShadow = true
            cpuGroup.add(post)

            const capLed = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 12), glowMat)
            capLed.position.set(cx, 0.38, cz)
            cpuGroup.add(capLed)
        }

        // Overhead Floating Holographic Cyber Ring (high above so cars drive underneath)
        const holoRing = new THREE.Mesh(
            new THREE.TorusGeometry(3.8, 0.055, 10, 48),
            this.materials.cyanGlow
        )
        holoRing.rotation.x = Math.PI * 0.5
        holoRing.position.y = 5.4
        cpuGroup.add(holoRing)
        this.floatingRings.push({ mesh: holoRing, baseY: 5.4, speed: 0.7 })

        this.group.add(cpuGroup)
    }

    setPhotoBillboardAtLanding()
    {
        const billboardPos = this.getPos('landing', -6.8, -4.8)
        const frameGroup = new THREE.Group()
        frameGroup.position.copy(billboardPos)
        frameGroup.rotation.y = Math.PI * 0.18

        // Pedestal Base
        const pedestal = new THREE.Mesh(
            new THREE.BoxGeometry(3.4, 0.35, 1.2),
            this.materials.pcbDark
        )
        pedestal.position.y = 0.175
        pedestal.castShadow = true
        pedestal.receiveShadow = true
        frameGroup.add(pedestal)

        // Outer Metallic Cyber Frame
        const outerFrame = new THREE.Mesh(
            new THREE.BoxGeometry(3.1, 3.8, 0.22),
            this.materials.heatsinkMetal
        )
        outerFrame.position.y = 2.2
        outerFrame.castShadow = true
        frameGroup.add(outerFrame)

        // Glowing Cyan Neon Border Strips
        const topBar = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.09, 0.26), this.materials.cyanGlow)
        topBar.position.set(0, 4.12, 0)
        frameGroup.add(topBar)

        const bottomBar = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.09, 0.26), this.materials.copperGold)
        bottomBar.position.set(0, 0.28, 0)
        frameGroup.add(bottomBar)

        // Dynamic Canvas Texture for 3D Photo + Caption
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 640
        const ctx = canvas.getContext('2d')

        const photoTex = new THREE.CanvasTexture(canvas)
        photoTex.colorSpace = THREE.SRGBColorSpace

        const screenMat = new THREE.MeshBasicNodeMaterial({
            map: photoTex
        })

        const screenMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2.76, 3.45),
            screenMat
        )
        screenMesh.position.set(0, 2.2, 0.13)
        frameGroup.add(screenMesh)

        const slides = [
            { src: '/daisy-photos/daisy-1.jpg', tag: 'SPEAKER & DEBATER', title: 'Daisy Chawla' },
            { src: '/daisy-photos/daisy-2.jpg', tag: 'AI & FULL-STACK DEV', title: 'B.Tech CSE • 8.39 CGPA' },
            { src: '/daisy-photos/daisy-3.jpg', tag: 'JUSTICEFLOW AI LEAD', title: 'Legal-Tech & 3D Web' },
            { src: '/daisy-photos/daisy-4.jpg', tag: '3X INTERNSHIP ALUMNA', title: 'IIT Roorkee • Digimantra' },
            { src: '/daisy-photos/daisy-5.jpg', tag: '4X HACKATHON FINALIST', title: 'Thapar • NIT Delhi' },
            { src: '/daisy-photos/daisy-6.jpg', tag: 'CAMPUS LEADER', title: 'Global Ed Fair & LORs' }
        ]

        const loadedImages = []
        const drawSlide = (idx) =>
        {
            const slide = slides[idx]
            const img = loadedImages[idx]
            ctx.fillStyle = '#0f172a'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            if(img && img.complete && img.naturalWidth > 0)
            {
                // Center-crop image into 512x510 area
                const targetW = 512
                const targetH = 510
                const imgRatio = img.naturalWidth / img.naturalHeight
                const boxRatio = targetW / targetH
                let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
                if(imgRatio > boxRatio)
                {
                    sw = img.naturalHeight * boxRatio
                    sx = (img.naturalWidth - sw) * 0.5
                }
                else
                {
                    sh = img.naturalWidth / boxRatio
                    sy = (img.naturalHeight - sh) * 0.25
                }
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH)
            }

            // Bottom Caption Banner
            const grad = ctx.createLinearGradient(0, 440, 0, 640)
            grad.addColorStop(0, 'rgba(11, 20, 34, 0)')
            grad.addColorStop(0.35, 'rgba(11, 20, 34, 0.94)')
            grad.addColorStop(1, 'rgba(11, 20, 34, 0.99)')
            ctx.fillStyle = grad
            ctx.fillRect(0, 440, 512, 200)

            ctx.fillStyle = '#00f2fe'
            ctx.font = '800 22px "Nunito", Arial, sans-serif'
            ctx.fillText(slide.tag, 26, 558)

            ctx.fillStyle = '#ffffff'
            ctx.font = '900 34px "Nunito", Arial, sans-serif'
            ctx.fillText(slide.title, 26, 606)

            photoTex.needsUpdate = true
        }

        slides.forEach((s, i) =>
        {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () =>
            {
                if(i === 0)
                    drawSlide(0)
            }
            img.src = s.src
            loadedImages.push(img)
        })

        let currentIdx = 0
        setInterval(() =>
        {
            currentIdx = (currentIdx + 1) % slides.length
            drawSlide(currentIdx)
        }, 4500)

        this.group.add(frameGroup)
    }

    setRamTowersAtCareer()
    {
        const careerBase = this.getPos('career', -7.2, -3.5)
        const ramGroup = new THREE.Group()
        ramGroup.position.copy(careerBase)

        const rgbMaterials = [
            this.materials.cyanGlow,
            this.materials.orangeGlow,
            this.materials.purpleGlow,
            this.materials.greenGlow
        ]

        // 4 Vertical DDR5 RAM DIMM Slots & Sticks parallel to the Career Timeline
        for(let i = 0; i < 4; i++)
        {
            const zOffset = -i * 3.8
            const stickGroup = new THREE.Group()
            stickGroup.position.set(0, 0, zOffset)

            // DIMM Slot Base on PCB
            const slotBase = new THREE.Mesh(
                new THREE.BoxGeometry(0.65, 0.28, 3.1),
                this.materials.pcbDark
            )
            slotBase.position.y = 0.14
            slotBase.castShadow = true
            slotBase.receiveShadow = true
            stickGroup.add(slotBase)

            // Gold Edge Contacts
            for(let p = -1.2; p <= 1.2; p += 0.3)
            {
                const pin = new THREE.Mesh(
                    new THREE.BoxGeometry(0.32, 0.18, 0.12),
                    this.materials.copperGold
                )
                pin.position.set(0, 0.32, p)
                stickGroup.add(pin)
            }

            // Metallic DDR5 Heatspreader Body
            const heatspreader = new THREE.Mesh(
                new THREE.BoxGeometry(0.24, 2.2, 2.85),
                this.materials.heatsinkMetal
            )
            heatspreader.position.y = 1.45
            heatspreader.castShadow = true
            heatspreader.receiveShadow = true
            stickGroup.add(heatspreader)

            // Memory IC Chips on side of DIMM
            for(let c = -0.9; c <= 0.9; c += 0.6)
            {
                const ic = new THREE.Mesh(
                    new THREE.BoxGeometry(0.30, 0.45, 0.42),
                    this.materials.siliconDie
                )
                ic.position.set(0, 1.2, c)
                stickGroup.add(ic)
            }

            // Glowing RGB Light Bar along top of DDR5 stick
            const rgbBar = new THREE.Mesh(
                new THREE.BoxGeometry(0.28, 0.24, 2.9),
                rgbMaterials[i % rgbMaterials.length]
            )
            rgbBar.position.y = 2.65
            stickGroup.add(rgbBar)

            ramGroup.add(stickGroup)
        }

        this.group.add(ramGroup)
    }

    setGpuUnitAtProjects()
    {
        const gpuPos = this.getPos('projects', 8.5, -5.2)
        const gpuGroup = new THREE.Group()
        gpuGroup.position.copy(gpuPos)
        gpuGroup.rotation.y = -Math.PI * 0.15

        // GPU PCB Backplate
        const pcbBase = new THREE.Mesh(
            new THREE.BoxGeometry(5.6, 0.35, 2.8),
            this.materials.pcbDark
        )
        pcbBase.position.y = 0.175
        pcbBase.castShadow = true
        pcbBase.receiveShadow = true
        gpuGroup.add(pcbBase)

        // Aluminum Heatsink Fin Stack
        for(let f = -2.4; f <= 2.4; f += 0.32)
        {
            const fin = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 1.35, 2.5),
                this.materials.heatsinkMetal
            )
            fin.position.set(f, 0.95, 0)
            fin.castShadow = true
            gpuGroup.add(fin)
        }

        // Copper Heatpipes
        for(const zPipe of [ -0.65, 0, 0.65 ])
        {
            const pipe = new THREE.Mesh(
                new THREE.CylinderGeometry(0.11, 0.11, 5.9, 10),
                this.materials.copperGold
            )
            pipe.rotation.z = Math.PI * 0.5
            pipe.position.set(0, 0.55, zPipe)
            gpuGroup.add(pipe)
        }

        // Top Shroud Accent Bars
        const topGlow = new THREE.Mesh(
            new THREE.BoxGeometry(5.5, 0.12, 0.18),
            this.materials.cyanGlow
        )
        topGlow.position.set(0, 1.68, 1.22)
        gpuGroup.add(topGlow)

        const bottomGlow = new THREE.Mesh(
            new THREE.BoxGeometry(5.5, 0.12, 0.18),
            this.materials.orangeGlow
        )
        bottomGlow.position.set(0, 1.68, -1.22)
        gpuGroup.add(bottomGlow)

        // Dual Spinning Axial Fans on top of GPU
        for(const fanX of [ -1.45, 1.45 ])
        {
            const fanRing = new THREE.Mesh(
                new THREE.TorusGeometry(1.05, 0.08, 10, 24),
                this.materials.cyanGlow
            )
            fanRing.rotation.x = Math.PI * 0.5
            fanRing.position.set(fanX, 1.72, 0)
            gpuGroup.add(fanRing)

            const rotor = new THREE.Group()
            rotor.position.set(fanX, 1.70, 0)

            const hub = new THREE.Mesh(
                new THREE.CylinderGeometry(0.28, 0.28, 0.14, 12),
                this.materials.copperGold
            )
            rotor.add(hub)

            for(let b = 0; b < 6; b++)
            {
                const blade = new THREE.Mesh(
                    new THREE.BoxGeometry(0.88, 0.05, 0.22),
                    this.materials.heatsinkMetal
                )
                const angle = (b / 6) * Math.PI * 2
                blade.position.set(Math.cos(angle) * 0.48, 0, Math.sin(angle) * 0.48)
                blade.rotation.y = -angle
                blade.rotation.x = 0.35
                rotor.add(blade)
            }

            gpuGroup.add(rotor)
            this.fans.push(rotor)
        }

        this.group.add(gpuGroup)
    }

    setNvmeAndCapacitorsAtLab()
    {
        const labPos = this.getPos('lab', -7.2, -3.5)
        const vrmGroup = new THREE.Group()
        vrmGroup.position.copy(labPos)

        // 5 Cylindrical Solid-State VRM Capacitors with Glowing Tops
        const capColors = [
            this.materials.cyanGlow,
            this.materials.purpleGlow,
            this.materials.orangeGlow,
            this.materials.greenGlow,
            this.materials.cyanGlow
        ]

        for(let i = 0; i < 5; i++)
        {
            const capX = (i - 2) * 1.15
            const capBody = new THREE.Mesh(
                new THREE.CylinderGeometry(0.42, 0.45, 1.35 + (i % 2) * 0.3, 16),
                this.materials.heatsinkMetal
            )
            const h = 1.35 + (i % 2) * 0.3
            capBody.position.set(capX, h * 0.5, 0)
            capBody.castShadow = true
            capBody.receiveShadow = true
            vrmGroup.add(capBody)

            const capTop = new THREE.Mesh(
                new THREE.CylinderGeometry(0.34, 0.34, 0.08, 16),
                capColors[i]
            )
            capTop.position.set(capX, h + 0.04, 0)
            vrmGroup.add(capTop)

            const capRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.48, 0.04, 8, 20),
                this.materials.copperGold
            )
            capRing.rotation.x = Math.PI * 0.5
            capRing.position.set(capX, 0.05, 0)
            vrmGroup.add(capRing)
        }

        this.group.add(vrmGroup)
    }

    setOverclockCoreAtTimeMachineSpot()
    {
        // Replaces Bruno Simon's old 2019 Time Machine with Daisy's Motherboard Overclock & JusticeFlow AI Core
        const corePos = this.getPos('timeMachine', 0, 0)
        const coreGroup = new THREE.Group()
        coreGroup.position.copy(corePos)

        // Octagonal / Circular PCB Pedestal
        const basePad = new THREE.Mesh(
            new THREE.CylinderGeometry(3.2, 3.6, 0.25, 8),
            this.materials.pcbDark
        )
        basePad.position.y = 0.125
        basePad.receiveShadow = true
        coreGroup.add(basePad)

        const innerPad = new THREE.Mesh(
            new THREE.CylinderGeometry(2.1, 2.3, 0.35, 8),
            this.materials.siliconDie
        )
        innerPad.position.y = 0.25
        coreGroup.add(innerPad)

        // Glowing Rotating Cyber Rings
        const outerRing = new THREE.Mesh(
            new THREE.TorusGeometry(2.7, 0.07, 10, 32),
            this.materials.cyanGlow
        )
        outerRing.rotation.x = Math.PI * 0.5
        outerRing.position.y = 0.32
        coreGroup.add(outerRing)

        const floatingDiamond = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.95, 0),
            this.materials.copperGold
        )
        floatingDiamond.position.y = 2.2
        coreGroup.add(floatingDiamond)

        const orbitRing = new THREE.Mesh(
            new THREE.TorusGeometry(1.55, 0.05, 10, 32),
            this.materials.purpleGlow
        )
        orbitRing.position.y = 2.2
        coreGroup.add(orbitRing)

        this.floatingRings.push({ mesh: floatingDiamond, baseY: 2.2, speed: 1.4, rotateX: true })
        this.floatingRings.push({ mesh: orbitRing, baseY: 2.2, speed: -1.1, rotateX: true })

        this.group.add(coreGroup)

        // Interactive Point at the Overclock Core (replaces the old 2019 link!)
        if(this.game.interactivePoints)
        {
            const interactPos = corePos.clone()
            interactPos.z += 2.6
            interactPos.y = 1.0

            this.game.interactivePoints.create(
                interactPos,
                '⚡ Overclock Core • JusticeFlow AI',
                InteractivePoints.ALIGN_RIGHT,
                InteractivePoints.STATE_CONCEALED,
                () =>
                {
                    this.game.confetti?.pop(this.game.player.position)
                    this.game.audio?.groups?.get('click')?.play(true)
                    if(this.game.map?.showPropBubble)
                    {
                        this.game.map.showPropBubble('⚡ MOTHERBOARD OVERCLOCK ACTIVATED! Launching Daisy’s JusticeFlow AI!')
                    }
                    window.open('https://justiceflow-three.vercel.app/', '_blank')
                },
                () =>
                {
                    this.game.inputs.interactiveButtons.addItems(['interact'])
                },
                () =>
                {
                    this.game.inputs.interactiveButtons.removeItems(['interact'])
                },
                () =>
                {
                    this.game.inputs.interactiveButtons.removeItems(['interact'])
                }
            )
        }
    }

    setPcbBusTraces()
    {
        // Glowing 3D PCB Copper & Cyan Data Bus Traces routed between key hubs on the ground
        const landing = this.getPos('landing', 0, -2.5)
        const projects = this.getPos('projects', 0, 2.0)
        const career = this.getPos('career', -2.5, 2.0)
        const lab = this.getPos('lab', 0, 2.0)
        const social = this.getPos('social', 0, 2.0)
        const overclock = this.getPos('timeMachine', 0, 0)

        const routes = [
            { start: landing, end: projects, mat: this.materials.cyanGlow },
            { start: landing, end: career, mat: this.materials.copperGold },
            { start: landing, end: social, mat: this.materials.purpleGlow },
            { start: social, end: lab, mat: this.materials.cyanGlow },
            { start: career, end: overclock, mat: this.materials.orangeGlow }
        ]

        for(const route of routes)
        {
            // L-shaped orthogonal PCB trace (X segment then Z segment)
            const corner = new THREE.Vector3(route.end.x, 0.03, route.start.z)

            this.createTraceSegment(route.start, corner, route.mat)
            this.createTraceSegment(corner, route.end, route.mat)

            // Solder Via Pad at the 90-degree corner
            const viaRing = new THREE.Mesh(
                new THREE.CylinderGeometry(0.32, 0.32, 0.05, 14),
                this.materials.copperGold
            )
            viaRing.position.set(corner.x, 0.035, corner.z)
            this.group.add(viaRing)
        }
    }

    setJeepDirectionArrow()
    {
        // Dedicated 3D GPS Direction Arrow that always follows the Jeep and points the way
        this.tourStops = [
            { name: 'projects', label: 'PROJECTS • JUSTICEFLOW' },
            { name: 'career', label: 'CAREER & B.TECH (8.39)' },
            { name: 'lab', label: 'CERTS & LORS LAB' },
            { name: 'social', label: 'SOCIAL & GITHUB' },
            { name: 'circuit', label: 'RACING CIRCUIT' },
            { name: 'bowling', label: 'BOWLING ALLEY' },
            { name: 'cookie', label: 'COOKIE OVEN' },
            { name: 'achievements', label: 'ACHIEVEMENTS' },
            { name: 'timeMachine', label: 'OVERCLOCK AI CORE' },
            { name: 'landing', label: 'DAISY HOME HUB' }
        ]
        this.currentStopIndex = 0

        this.jeepArrowRoot = new THREE.Group()
        this.jeepArrowRoot.name = 'daisyJeepDirectionArrow'
        this.game.scene.add(this.jeepArrowRoot)

        // 1. Ground Compass Ring around the Jeep
        const compassRing = new THREE.Mesh(
            new THREE.RingGeometry(2.35, 2.52, 40),
            this.materials.cyanGlow
        )
        compassRing.rotation.x = -Math.PI * 0.5
        compassRing.position.y = 0.18
        this.jeepArrowRoot.add(compassRing)

        // 2. Rotating Pointer Pivot (rotates toward target)
        this.jeepArrowPivot = new THREE.Group()
        this.jeepArrowRoot.add(this.jeepArrowPivot)

        // Build crisp extruded 3D Arrow shape pointing toward +Z
        const arrowShape = new THREE.Shape()
        arrowShape.moveTo(0, 1.35)       // Tip
        arrowShape.lineTo(0.68, 0.25)    // Right wing outer
        arrowShape.lineTo(0.28, 0.25)    // Right wing inner
        arrowShape.lineTo(0.28, -0.85)   // Right tail
        arrowShape.lineTo(-0.28, -0.85)  // Left tail
        arrowShape.lineTo(-0.28, 0.25)   // Left wing inner
        arrowShape.lineTo(-0.68, 0.25)   // Left wing outer
        arrowShape.closePath()

        const extrudeSettings = {
            depth: 0.16,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.04,
            bevelThickness: 0.04
        }
        const arrowGeo = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings)
        arrowGeo.rotateX(Math.PI * 0.5)
        arrowGeo.center()

        // Overhead Floating 3D GPS Arrow above the Jeep
        this.overheadArrowMesh = new THREE.Mesh(arrowGeo, this.materials.copperGold)
        this.overheadArrowMesh.position.set(0, 2.85, 0)
        this.overheadArrowMesh.scale.set(0.82, 0.82, 0.82)
        this.jeepArrowPivot.add(this.overheadArrowMesh)

        // Forward Ground Guide Chevron right in front of the Jeep on the compass ring
        this.groundArrowMesh = new THREE.Mesh(arrowGeo, this.materials.cyanGlow)
        this.groundArrowMesh.position.set(0, 0.28, 3.15)
        this.groundArrowMesh.scale.set(0.72, 0.55, 0.72)
        this.jeepArrowPivot.add(this.groundArrowMesh)

        // Second smaller trailing chevron for animated flow
        this.groundChevron2 = new THREE.Mesh(
            new THREE.ConeGeometry(0.35, 0.65, 4),
            this.materials.orangeGlow
        )
        this.groundChevron2.rotation.x = Math.PI * 0.5
        this.groundChevron2.position.set(0, 0.26, 4.25)
        this.jeepArrowPivot.add(this.groundChevron2)

        // 3. Floating 3D Destination & Distance Banner above the Arrow
        this.arrowBannerCanvas = document.createElement('canvas')
        this.arrowBannerCanvas.width = 512
        this.arrowBannerCanvas.height = 112
        this.arrowBannerCtx = this.arrowBannerCanvas.getContext('2d')

        this.arrowBannerTex = new THREE.CanvasTexture(this.arrowBannerCanvas)
        this.arrowBannerTex.colorSpace = THREE.SRGBColorSpace

        const bannerMat = new THREE.MeshBasicNodeMaterial({
            map: this.arrowBannerTex,
            transparent: true,
            depthTest: false
        })

        this.arrowBannerMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(3.2, 0.7),
            bannerMat
        )
        this.arrowBannerMesh.position.set(0, 3.65, 0)
        this.arrowBannerMesh.renderOrder = 9
        this.jeepArrowRoot.add(this.arrowBannerMesh)

        this.lastBannerText = ''
        this.updateArrowBannerText('PROJECTS • JUSTICEFLOW', 25)
    }

    updateArrowBannerText(label, distMeters)
    {
        const textKey = `${label}_${distMeters}`
        if(this.lastBannerText === textKey)
            return
        this.lastBannerText = textKey

        const ctx = this.arrowBannerCtx
        const w = this.arrowBannerCanvas.width
        const h = this.arrowBannerCanvas.height

        ctx.clearRect(0, 0, w, h)

        // Pill background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
        ctx.strokeStyle = '#00f2fe'
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.roundRect(8, 8, w - 16, h - 16, 42)
        ctx.fill()
        ctx.stroke()

        // Top subtitle
        ctx.fillStyle = '#ffb646'
        ctx.font = '900 22px "Nunito", Arial, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`🧭 FOLLOW ARROW  •  ${distMeters}m`, w * 0.5, 40)

        // Destination title
        ctx.fillStyle = '#ffffff'
        ctx.font = '900 30px "Nunito", Arial, sans-serif'
        ctx.fillText(`➔ ${label}`, w * 0.5, 80)

        this.arrowBannerTex.needsUpdate = true
    }

    setNextTourStopAfter(respawnName)
    {
        const idx = this.tourStops.findIndex(s => s.name === respawnName)
        if(idx !== -1)
        {
            this.currentStopIndex = (idx + 1) % this.tourStops.length
        }
    }

    updateJeepDirectionArrow(elapsed, delta)
    {
        if(!this.jeepArrowRoot || !this.game.player || !this.game.respawns)
            return

        const playerPos = this.game.player.position
        this.jeepArrowRoot.position.set(playerPos.x, Math.max(0, playerPos.y), playerPos.z)

        const currentStop = this.tourStops[this.currentStopIndex]
        if(!currentStop)
            return

        const targetRespawn = this.game.respawns.getByName(currentStop.name)
        if(!targetRespawn)
            return

        const dx = targetRespawn.position.x - playerPos.x
        const dz = targetRespawn.position.z - playerPos.z
        const dist = Math.hypot(dx, dz)

        // When the Jeep arrives at the target zone, advance to the next stop in the tour!
        if(dist < 9.0)
        {
            this.currentStopIndex = (this.currentStopIndex + 1) % this.tourStops.length
            return
        }

        // Smoothly rotate arrow pivot to point toward target (atan2(dx, dz))
        const targetAngle = Math.atan2(dx, dz)
        let angleDiff = targetAngle - this.jeepArrowPivot.rotation.y
        while(angleDiff > Math.PI) angleDiff -= Math.PI * 2
        while(angleDiff < -Math.PI) angleDiff += Math.PI * 2
        this.jeepArrowPivot.rotation.y += angleDiff * Math.min(1, delta * 10)

        // Pulse the arrows forward along the target direction
        const pulse = Math.sin(elapsed * 5.0) * 0.22
        this.overheadArrowMesh.position.z = pulse
        this.overheadArrowMesh.position.y = 2.85 + Math.sin(elapsed * 3.5) * 0.1
        this.groundArrowMesh.position.z = 3.15 + pulse
        this.groundChevron2.position.z = 4.25 + Math.sin(elapsed * 5.0 - 0.8) * 0.25

        // Make the overhead text banner face the camera so it's always readable
        if(this.game.view?.camera)
        {
            this.arrowBannerMesh.quaternion.copy(this.game.view.camera.quaternion)
        }

        // Update distance every 2 meters
        const roundedDist = Math.max(5, Math.round(dist / 2) * 2)
        this.updateArrowBannerText(currentStop.label, roundedDist)
    }

    createTraceSegment(p1, p2, material)
    {
        const dx = p2.x - p1.x
        const dz = p2.z - p1.z
        const length = Math.hypot(dx, dz)
        if(length < 1.0)
            return

        const midX = (p1.x + p2.x) * 0.5
        const midZ = (p1.z + p2.z) * 0.5
        const angle = Math.atan2(dx, dz)

        // Parallel 3-lane motherboard data bus
        for(const laneOffset of [ -0.22, 0, 0.22 ])
        {
            const perpX = Math.cos(angle) * laneOffset
            const perpZ = -Math.sin(angle) * laneOffset

            const traceMesh = new THREE.Mesh(
                new THREE.BoxGeometry(laneOffset === 0 ? 0.11 : 0.06, 0.025, length),
                laneOffset === 0 ? material : this.materials.copperGold
            )
            traceMesh.position.set(midX + perpX, 0.022, midZ + perpZ)
            traceMesh.rotation.y = angle
            this.group.add(traceMesh)
        }

        // Animated data pulse packet that travels along the center lane
        const packet = new THREE.Mesh(
            new THREE.BoxGeometry(0.24, 0.08, 1.15),
            material
        )
        packet.rotation.y = angle
        this.group.add(packet)

        this.dataPackets.push({
            mesh: packet,
            p1: p1.clone(),
            p2: p2.clone(),
            speed: 0.22 + Math.random() * 0.18,
            offset: Math.random()
        })
    }

    setThemeMode(mode = 'hybrid')
    {
        this.themeMode = mode
        const floor = this.game.world?.floor
        const terrain = this.game.terrain

        if(mode === 'motherboard')
        {
            // Full Cyber Motherboard PCB Mode
            this.group.visible = true
            if(floor)
            {
                floor.pcbMixUniform.value = 0.95
                floor.slabHighColor.value.set('#132a38')
                floor.slabLowColor.value.set('#07131c')
                floor.pcbTraceColor.value.set('#00f2fe')
                floor.pcbGoldColor.value.set('#ffb646')
            }
            if(terrain)
            {
                terrain.grassColorUniform.value.set('#155e4b')
                terrain.colors[0].value = '#0d3b36'
                terrain.colors[1].value = '#00a896'
                terrain.colors[2].value = '#041524'
                terrain.updateGradient?.()
            }
        }
        else if(mode === 'nature')
        {
            // Classic Nature Island Mode
            this.group.visible = false
            if(floor)
            {
                floor.pcbMixUniform.value = 0.0
                floor.slabHighColor.value.set('#ffcf8b')
                floor.slabLowColor.value.set('#a87762')
            }
            if(terrain)
            {
                terrain.grassColorUniform.value.set('#b8b62e')
                terrain.colors[0].value = '#ffa94e'
                terrain.colors[1].value = '#5bc2b9'
                terrain.colors[2].value = '#13375f'
                terrain.updateGradient?.()
            }
        }
        else
        {
            // Hybrid Mode (Default): Warm Island + Glowing PCB Traces + 3D Motherboard Landmarks
            this.group.visible = true
            if(floor)
            {
                floor.pcbMixUniform.value = 0.68
                floor.slabHighColor.value.set('#ffcf8b')
                floor.slabLowColor.value.set('#1e293b')
                floor.pcbTraceColor.value.set('#00f2fe')
                floor.pcbGoldColor.value.set('#ffb646')
            }
            if(terrain)
            {
                terrain.grassColorUniform.value.set('#b8b62e')
                terrain.colors[0].value = '#ffa94e'
                terrain.colors[1].value = '#5bc2b9'
                terrain.colors[2].value = '#13375f'
                terrain.updateGradient?.()
            }
        }
    }

    update()
    {
        const elapsed = this.game.ticker.elapsed
        const delta = this.game.ticker.delta

        // Always update the Jeep 3D Direction Arrow regardless of theme
        this.updateJeepDirectionArrow(elapsed, delta)

        if(!this.group.visible)
            return

        // Spin GPU cooling fans
        for(const fan of this.fans)
        {
            fan.rotation.y += delta * 6.5
        }

        // Animate floating cyber rings & overclock diamond
        for(const item of this.floatingRings)
        {
            item.mesh.rotation.z += delta * item.speed
            if(item.rotateX)
            {
                item.mesh.rotation.y += delta * item.speed
            }
            item.mesh.position.y = item.baseY + Math.sin(elapsed * 2.0) * 0.18
        }

        // Move glowing data packets along PCB bus traces
        for(const pkt of this.dataPackets)
        {
            const t = (elapsed * pkt.speed + pkt.offset) % 1.0
            pkt.mesh.position.x = pkt.p1.x + (pkt.p2.x - pkt.p1.x) * t
            pkt.mesh.position.z = pkt.p1.z + (pkt.p2.z - pkt.p1.z) * t
            pkt.mesh.position.y = 0.05
        }
    }
}
