import * as THREE from 'three/webgpu'
import { Game } from '../../Game.js'
import { color, float, Fn, luminance, max, mix, positionGeometry, step, texture, uniform, uv, vec4 } from 'three/tsl'
import gsap from 'gsap'
import { clamp } from 'three/src/math/MathUtils.js'
import { Area } from './Area.js'
import { InteractivePoints } from '../../InteractivePoints.js'

export class CareerArea extends Area
{
    constructor(references)
    {
        super(references)

        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel = this.game.debug.panel.addFolder({
                title: '💼 Career',
                expanded: false,
            })
        }

        this.setSounds()
        this.setLines()
        this.setYears()
        this.setAchievement()
    }

    createCareerMaskTexture(topText, bottomText)
    {
        const canvas = document.createElement('canvas')
        canvas.width = 1100
        canvas.height = 256
        const ctx = canvas.getContext('2d')

        // Black background = transparent in shader
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Top line (Bold)
        ctx.font = '900 84px "Nunito", Arial, sans-serif'
        ctx.textBaseline = 'middle'
        const topMetrics = ctx.measureText(topText)
        const topWidth = Math.min(canvas.width - 10, Math.ceil(topMetrics.width + 44))

        // Green channel = mask background box
        ctx.fillStyle = '#00ff00'
        ctx.fillRect(0, 6, topWidth, 112)

        // Red channel = emissive text
        ctx.fillStyle = '#ff0000'
        ctx.fillText(topText, 20, 64)

        // Bottom line
        ctx.font = '700 72px "Nunito", Arial, sans-serif'
        const bottomMetrics = ctx.measureText(bottomText)
        const bottomWidth = Math.min(canvas.width - 10, Math.ceil(bottomMetrics.width + 44))

        ctx.fillStyle = '#00ff00'
        ctx.fillRect(0, 136, bottomWidth, 112)

        ctx.fillStyle = '#ff0000'
        ctx.fillText(bottomText, 20, 194)

        const tex = new THREE.CanvasTexture(canvas)
        tex.flipY = false
        tex.minFilter = THREE.LinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.generateMipmaps = false
        tex.wrapS = THREE.ClampToEdgeWrapping
        tex.wrapT = THREE.ClampToEdgeWrapping
        tex.needsUpdate = true
        return tex
    }

    setSounds()
    {
        this.sounds = {}
        this.sounds.stoneOut = this.game.audio.register({
            path: 'sounds/stoneSlides/stoneSlideOut.mp3',
            autoplay: false,
            loop: false,
            volume: 0.3,
            antiSpam: 0.1,
            positions: new THREE.Vector3(),
            distanceFade: 14,
            onPlay: (item, line) =>
            {
                item.positions[0].copy(line.origin)
                item.rate = 1.2 + line.index * 0.1
            }
        })
        this.sounds.stoneIn = this.game.audio.register({
            path: 'sounds/stoneSlides/stoneSlideIn.mp3',
            autoplay: false,
            loop: false,
            volume: 0.2,
            rate: 0.8,
            antiSpam: 0.1,
            positions: new THREE.Vector3(),
            distanceFade: 14,
            onPlay: (item, line) =>
            {
                item.positions[0].copy(line.origin)
            }
        })
    }

    setLines()
    {
        this.lines = {}
        this.lines.items = []
        this.lines.activeElevation = 2.5
        this.lines.padding = 0.25
        
        const lineGroups = this.references.items.get('line')

        const colors = {
            blue: uniform(color('#5390ff')),
            orange: uniform(color('#ff8039')),
            purple: uniform(color('#b65fff')),
            green: uniform(color('#a2ffab'))
        }

        // Daisy Chawla's custom career & education milestones mapped to the 6 timeline pillars
        const daisyCareerMap = {
            careerHetic: [ 'B.TECH CSE @ PCTE', 'CGPA 8.39 (2023-27)' ],
            careerUzik: [ 'ACMEGRADE INTERN', 'WEB DEVELOPMENT' ],
            careerImmersiveGarden: [ 'DIGIMANTRA LABS', 'JAVA DEV INTERN' ],
            careerFreelancer: [ 'IIT ROORKEE', 'AI / ML TRAINEE' ],
            careerIRLTeacher: [ 'THAPAR & NIT DELHI', 'HACKATHON FINALIST' ],
            careerOnlineTeacher: [ 'JUSTICEFLOW AI', 'FULL-STACK & AI LEAD' ]
        }

        for(const group of lineGroups)
        {
            const line = {}
            line.group = group
            line.size = parseFloat(line.group.userData.size)
            line.hasEnd = line.group.userData.hasEnd
            line.color = line.group.userData.color

            const customLabels = daisyCareerMap[line.group.userData.texture]
            if(customLabels)
            {
                line.texture = this.createCareerMaskTexture(customLabels[0], customLabels[1])
            }
            else
            {
                line.texture = this.game.resources[`${line.group.userData.texture}Texture`]
            }

            line.stone = line.group.children.find(child => child.name.startsWith('stone'))
            line.stone.position.y = 0
            
            line.origin = line.group.position.clone()
            
            line.isIn = false
            line.isUp = false
            line.elevationTarget = 0
            line.offsetTarget = 0
            line.labelReveal = uniform(0)

            {
                line.textMesh = line.stone.children.find(child => child.name.startsWith('careerText'))

                const material = new THREE.MeshLambertNodeMaterial({ transparent: true })
                
                const baseColor = colors[line.color]

                material.outputNode = Fn(() =>
                {
                    const baseUv = uv().toVar()

                    step(baseUv.x, line.labelReveal).lessThan(0.5).discard()

                    const textureColor = texture(line.texture, baseUv)

                    const alpha = step(0.1, max(textureColor.r, textureColor.g))

                    const emissiveColor = baseColor.div(luminance(baseColor)).mul(1.7)

                    const maskColor = color('#251f2b')
                    const finalColor = mix(maskColor, emissiveColor, textureColor.r)
                    
                    return vec4(finalColor, alpha)
                })()

                // Mesh
                line.textMesh.castShadow = false
                line.textMesh.receiveShadow = false
                line.textMesh.material = material
            }

            this.lines.items.push(line)
        }

        this.lines.items.sort((a, b) => b.origin.z - a.origin.z)

        let i = 0
        for(const line of this.lines.items)
        {
            line.index = i++
        }

        // Interactive point at Career start to open Daisy's Official Resume PDF
        if(this.lines.items.length > 0)
        {
            const resumePos = this.lines.items[0].origin.clone()
            resumePos.x -= 3.5
            resumePos.y = 1
            this.game.interactivePoints.create(
                resumePos,
                'Resume PDF (CGPA 8.39)',
                InteractivePoints.ALIGN_LEFT,
                InteractivePoints.STATE_CONCEALED,
                () =>
                {
                    window.open('/resume.pdf', '_blank')
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

        // Debug
        if(this.game.debug.active)
        {
            this.game.debug.addThreeColorBinding(this.debugPanel, colors.blue.value, 'blue')
            this.game.debug.addThreeColorBinding(this.debugPanel, colors.orange.value, 'orange')
            this.game.debug.addThreeColorBinding(this.debugPanel, colors.purple.value, 'purple')
            this.game.debug.addThreeColorBinding(this.debugPanel, colors.green.value, 'green')
        }
    }

    setYears()
    {
        this.year = {}
        this.year.group = this.references.items.get('year')[0]
        this.year.originZ = this.year.group.position.z
        this.year.size = 17
        this.year.offsetTarget = 0
        this.year.start = 2021
        this.year.current = this.year.start

        const a = 255

        const digitData = new Uint8Array([
            a, a, a, a, a, a, 0, // 0
            0, a, a, 0, 0, 0, 0, // 1
            a, a, 0, a, a, 0, a, // 2
            a, a, a, a, 0, 0, a, // 3
            0, a, a, 0, 0, a, a, // 4
            a, 0, a, a, 0, a, a, // 5
            a, 0, a, a, a, a, a, // 6
            a, a, a, 0, 0, 0, 0, // 7
            a, a, a, a, a, a, a, // 8
            a, a, a, a, 0, a, a, // 9
        ])

        this.year.digitsTexture = new THREE.DataTexture(
            digitData,
            7,
            10,
            THREE.RedFormat,
            THREE.UnsignedByteType,
            THREE.UVMapping,
            THREE.ClampToEdgeWrapping,
            THREE.ClampToEdgeWrapping,
            THREE.NearestFilter,
            THREE.NearestFilter
        )
        this.year.digitsTexture.generateMipmaps = false
        this.year.digitsTexture.needsUpdate = true

        this.year.digits = []

        const digitMeshes = this.year.group.children.filter(child => child.name.startsWith('digit'))

        for(const mesh of digitMeshes)
        {
            const digit = {}
            digit.mesh = mesh
            digit.indexUniform = uniform(0)
            
            const material = new THREE.MeshBasicNodeMaterial()
            material.outputNode = vec4(1.7)

            material.positionNode = Fn(() =>
            {
                const barUv = uv(1).toVar()

                const uvY = digit.indexUniform.div(10).add(float(0.5).div(10))
                barUv.y.assign(uvY)

                const barActive = texture(this.year.digitsTexture, barUv).r

                const newPosition = positionGeometry.toVar()
                newPosition.y.subAssign(barActive.oneMinus())

                return newPosition
            })()

            digit.mesh.material = material

            this.year.digits.push(digit)
        }

        this.year.updateDigits = (year = 2025) =>
        {
            const yearString = `${year}`
            let i = 0
            for(const digit of this.year.digits)
            {
                digit.indexUniform.value = parseInt(yearString[i])
                i++
            }
        }

        this.year.updateDigits(this.year.current)
    }

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'career')
        })
    }

    update()
    {
        // Lines
        for(const line of this.lines.items)
        {
            const delta = line.origin.z - this.game.player.position.z

            // Is in
            if(delta > - this.lines.padding && delta < line.size + this.lines.padding * 2)
            {
                if(!line.isIn)
                {
                    line.isIn = true
                    gsap.to(line.labelReveal, { value: 1, duration: 1, delay: 0.3, overwrite: true, ease: 'power2.inOut' })
                }
            }

            // Is out
            else
            {
                if(line.isIn)
                {
                    line.isIn = false
                    gsap.to(line.labelReveal, { value: 0, duration: 1, overwrite: true, ease: 'power2.inOut' })
                }
            }

            // Elevation
            if(line.isIn)
            {
                if(!line.isUp)
                {
                    line.isUp = true
                    this.sounds.stoneOut.play(line)
                }
            }
            else
            {
                if(delta > line.size)
                {
                    if(line.hasEnd)
                    {
                        if(line.isUp)
                        {
                            line.isUp = false
                            gsap.delayedCall(0.3, () =>
                            {
                                this.sounds.stoneIn.play(line)
                            })
                        }
                    }
                }
                else
                {
                    if(line.isUp)
                    {
                        line.isUp = false
                        gsap.delayedCall(0.3, () =>
                        {
                            this.sounds.stoneIn.play(line)
                        })
                    }
                }
            }

            line.elevationTarget = line.isUp ? this.lines.activeElevation : 0
            line.stone.position.y += (line.elevationTarget - line.stone.position.y) * this.game.ticker.deltaScaled * 3

            // Position
            if(line.isIn)
            {
                if(line.stone.position.y > 1)
                    line.offsetTarget = - clamp(delta, 0, line.size)
            }
            else
            {
                // End
                if(delta > line.size)
                    line.offsetTarget = - line.size
                // Start
                else
                    line.offsetTarget = 0
            }

            line.stone.position.z += (line.offsetTarget - line.stone.position.z) * this.game.ticker.deltaScaled * 10
        }

        // Year (2021 -> 2027)
        const delta = this.year.originZ - this.game.player.position.z

        if(delta > this.year.size)
            this.year.offsetTarget = this.year.size
        else if(delta < 0)
            this.year.offsetTarget = 0
        else
            this.year.offsetTarget = delta

        const finalPositionZ = this.year.originZ - this.year.offsetTarget
        this.year.group.position.z += (finalPositionZ - this.year.group.position.z) * this.game.ticker.deltaScaled * 10

        const yearCurrent = this.year.start + Math.round((this.year.offsetTarget / this.year.size) * 6)

        if(yearCurrent !== this.year.current)
        {
            this.year.current = yearCurrent
            this.year.updateDigits(this.year.current)
        }
    }
}
