import * as THREE from 'three/webgpu'
import { color, float, Fn, instancedArray, mix, normalWorld, positionGeometry, step, texture, uniform, uv, vec2, vec3, vec4 } from 'three/tsl'
import { Inputs } from '../../Inputs/Inputs.js'
import { InteractivePoints } from '../../InteractivePoints.js'
import { Area } from './Area.js'
import gsap from 'gsap'
import { MeshDefaultMaterial } from '../../Materials/MeshDefaultMaterial.js'

export class LandingArea extends Area
{
    constructor(model)
    {
        super(model)

        this.localTime = uniform(0)

        this.setLetters()
        this.setKiosk()
        this.setControls()
        this.setBonfire()
        this.setAchievement()
    }

    createLetterShape(char)
    {
        const shape = new THREE.Shape()
        switch(char)
        {
            case 'D':
            {
                shape.moveTo(0, 0)
                shape.lineTo(0.58, 0)
                shape.quadraticCurveTo(1.0, 0, 1.0, 0.5)
                shape.quadraticCurveTo(1.0, 1.0, 0.58, 1.0)
                shape.lineTo(0, 1.0)
                shape.closePath()

                const hole = new THREE.Path()
                hole.moveTo(0.28, 0.22)
                hole.lineTo(0.52, 0.22)
                hole.quadraticCurveTo(0.72, 0.22, 0.72, 0.5)
                hole.quadraticCurveTo(0.72, 0.78, 0.52, 0.78)
                hole.lineTo(0.28, 0.78)
                hole.closePath()
                shape.holes.push(hole)
                break
            }
            case 'A':
            {
                shape.moveTo(0, 0)
                shape.lineTo(0.28, 0)
                shape.lineTo(0.36, 0.24)
                shape.lineTo(0.64, 0.24)
                shape.lineTo(0.72, 0)
                shape.lineTo(1.0, 0)
                shape.lineTo(0.64, 1.0)
                shape.lineTo(0.36, 1.0)
                shape.closePath()

                const hole = new THREE.Path()
                hole.moveTo(0.42, 0.46)
                hole.lineTo(0.58, 0.46)
                hole.lineTo(0.50, 0.74)
                hole.closePath()
                shape.holes.push(hole)
                break
            }
            case 'I':
            {
                shape.moveTo(0.22, 0)
                shape.lineTo(0.78, 0)
                shape.lineTo(0.78, 0.22)
                shape.lineTo(0.64, 0.22)
                shape.lineTo(0.64, 0.78)
                shape.lineTo(0.78, 0.78)
                shape.lineTo(0.78, 1.0)
                shape.lineTo(0.22, 1.0)
                shape.lineTo(0.22, 0.78)
                shape.lineTo(0.36, 0.78)
                shape.lineTo(0.36, 0.22)
                shape.lineTo(0.22, 0.22)
                shape.closePath()
                break
            }
            case 'S':
            {
                shape.moveTo(0.05, 0.04)
                shape.lineTo(0.75, 0.0)
                shape.quadraticCurveTo(1.0, 0.0, 1.0, 0.30)
                shape.quadraticCurveTo(1.0, 0.56, 0.65, 0.60)
                shape.lineTo(0.35, 0.64)
                shape.quadraticCurveTo(0.28, 0.66, 0.28, 0.73)
                shape.quadraticCurveTo(0.28, 0.79, 0.45, 0.79)
                shape.lineTo(0.92, 0.76)
                shape.lineTo(0.92, 0.98)
                shape.lineTo(0.32, 1.0)
                shape.quadraticCurveTo(0.0, 1.0, 0.0, 0.70)
                shape.quadraticCurveTo(0.0, 0.44, 0.35, 0.40)
                shape.lineTo(0.65, 0.36)
                shape.quadraticCurveTo(0.72, 0.34, 0.72, 0.27)
                shape.quadraticCurveTo(0.72, 0.21, 0.52, 0.21)
                shape.lineTo(0.05, 0.25)
                shape.closePath()
                break
            }
            case 'Y':
            {
                shape.moveTo(0.35, 0)
                shape.lineTo(0.65, 0)
                shape.lineTo(0.65, 0.44)
                shape.lineTo(1.0, 1.0)
                shape.lineTo(0.70, 1.0)
                shape.lineTo(0.50, 0.66)
                shape.lineTo(0.30, 1.0)
                shape.lineTo(0.0, 1.0)
                shape.lineTo(0.35, 0.44)
                shape.closePath()
                break
            }
            case 'C':
            {
                shape.moveTo(0.95, 0.06)
                shape.lineTo(0.95, 0.30)
                shape.lineTo(0.45, 0.24)
                shape.quadraticCurveTo(0.28, 0.24, 0.28, 0.50)
                shape.quadraticCurveTo(0.28, 0.76, 0.45, 0.76)
                shape.lineTo(0.95, 0.70)
                shape.lineTo(0.95, 0.94)
                shape.lineTo(0.42, 1.0)
                shape.quadraticCurveTo(0.0, 1.0, 0.0, 0.50)
                shape.quadraticCurveTo(0.0, 0.0, 0.42, 0.0)
                shape.closePath()
                break
            }
            case 'H':
            {
                shape.moveTo(0, 0)
                shape.lineTo(0.28, 0)
                shape.lineTo(0.28, 0.38)
                shape.lineTo(0.72, 0.38)
                shape.lineTo(0.72, 0)
                shape.lineTo(1.0, 0)
                shape.lineTo(1.0, 1.0)
                shape.lineTo(0.72, 1.0)
                shape.lineTo(0.72, 0.62)
                shape.lineTo(0.28, 0.62)
                shape.lineTo(0.28, 1.0)
                shape.lineTo(0, 1.0)
                shape.closePath()
                break
            }
            case 'W':
            {
                shape.moveTo(0.0, 1.0)
                shape.lineTo(0.24, 1.0)
                shape.lineTo(0.34, 0.36)
                shape.lineTo(0.44, 0.85)
                shape.lineTo(0.56, 0.85)
                shape.lineTo(0.66, 0.36)
                shape.lineTo(0.76, 1.0)
                shape.lineTo(1.0, 1.0)
                shape.lineTo(0.80, 0.0)
                shape.lineTo(0.56, 0.0)
                shape.lineTo(0.50, 0.42)
                shape.lineTo(0.44, 0.0)
                shape.lineTo(0.20, 0.0)
                shape.closePath()
                break
            }
            case 'L':
            default:
            {
                shape.moveTo(0, 0)
                shape.lineTo(0.92, 0)
                shape.lineTo(0.92, 0.25)
                shape.lineTo(0.30, 0.25)
                shape.lineTo(0.30, 1.0)
                shape.lineTo(0, 1.0)
                shape.closePath()
                break
            }
        }
        return shape
    }

    createFittedLetterGeometry(char, targetBox)
    {
        const shape = this.createLetterShape(char)
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 1,
            bevelEnabled: true,
            bevelThickness: 0.04,
            bevelSize: 0.03,
            bevelSegments: 2,
            curveSegments: 8
        })

        geo.computeBoundingBox()
        const srcBox = geo.boundingBox

        const targetSize = new THREE.Vector3()
        targetBox.getSize(targetSize)
        const targetCenter = new THREE.Vector3()
        targetBox.getCenter(targetCenter)

        const srcSize = new THREE.Vector3()
        srcBox.getSize(srcSize)
        const srcCenter = new THREE.Vector3()
        srcBox.getCenter(srcCenter)

        // Center at origin first
        geo.translate(-srcCenter.x, -srcCenter.y, -srcCenter.z)

        // Scale to fit the original letter's bounding box dimensions
        const sx = (targetSize.x || 0.8) / (srcSize.x || 1)
        const sy = (targetSize.y || 1.2) / (srcSize.y || 1)
        const sz = (targetSize.z || 0.4) / (srcSize.z || 1)
        geo.scale(sx, sy, sz)

        // Translate to original letter's local bounding box center
        geo.translate(targetCenter.x, targetCenter.y, targetCenter.z)
        geo.computeVertexNormals()
        geo.computeBoundingBox()
        geo.computeBoundingSphere()

        return geo
    }

    setLetters()
    {
        const references = this.references.items.get('letters')
        if(!references || !references.length)
            return

        // Sort the 10 physical letters from left to right along their line
        const sorted = [...references].sort((a, b) => a.position.x - b.position.x)

        // Custom vibrant lavender-violet MeshDefaultMaterial matching Bruno's 3D letters
        const letterMaterial = new MeshDefaultMaterial({
            colorNode: color('#9f86ff'),
            hasCoreShadows: true,
            hasDropShadows: true,
        })

        // Replace the 10 letters (B R U N O   S I M O N) with (D A I S Y   C H A W L)
        // and spawn the 11th physical letter (A) right after L to spell "DAISY CHAWLA"
        const targetChars = [ 'D', 'A', 'I', 'S', 'Y', 'C', 'H', 'A', 'W', 'L' ]

        for(let i = 0; i < sorted.length; i++)
        {
            const reference = sorted[i]
            const char = targetChars[i]

            if(reference.geometry && char)
            {
                reference.geometry.computeBoundingBox()
                const targetBox = reference.geometry.boundingBox.clone()
                // Normalize width so skinny letters like 'I' in BRUNO SIMON don't squash wider letters like 'H'
                const cx = (targetBox.min.x + targetBox.max.x) * 0.5
                const halfW = char === 'I' ? 0.24 : 0.42
                targetBox.min.x = cx - halfW
                targetBox.max.x = cx + halfW

                reference.geometry = this.createFittedLetterGeometry(char, targetBox)
                reference.material = letterMaterial
            }

            const physical = reference.userData.object.physical
            physical.colliders[0].setActiveEvents(this.game.RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS)
            physical.colliders[0].setContactForceEventThreshold(5)
            physical.onCollision = (force, position) =>
            {
                this.game.audio.groups.get('hitBrick').playRandomNext(force, position)
            }
        }

        // Add the 11th physical letter 'A' right after 'L' to complete "DAISY CHAWLA"
        if(sorted.length >= 2)
        {
            const lastRef = sorted[sorted.length - 1]
            const prevRef = sorted[sorted.length - 2]
            const stepVec = lastRef.position.clone().sub(prevRef.position)
            if(stepVec.length() < 0.5 || stepVec.length() > 3)
                stepVec.set(0.95, 0, 0.35)

            lastRef.geometry.computeBoundingBox()
            const boxA = lastRef.geometry.boundingBox.clone()
            const geoA = this.createFittedLetterGeometry('A', boxA)
            const meshA = new THREE.Mesh(geoA, letterMaterial)
            meshA.castShadow = true
            meshA.receiveShadow = true

            const posA = lastRef.position.clone().add(stepVec)
            const quatA = lastRef.quaternion.clone()

            const sizeA = new THREE.Vector3()
            boxA.getSize(sizeA)

            const objA = this.game.objects.add(
                {
                    model: meshA,
                    updateMaterials: false,
                    castShadow: true,
                    receiveShadow: true,
                },
                {
                    type: 'dynamic',
                    position: posA,
                    rotation: quatA,
                    friction: 0.5,
                    mass: 0.2,
                    sleeping: true,
                    colliders: [
                        {
                            shape: 'cuboid',
                            parameters: [
                                Math.max(0.2, sizeA.x * 0.5),
                                Math.max(0.4, sizeA.y * 0.5),
                                Math.max(0.15, sizeA.z * 0.5)
                            ],
                            position: { x: 0, y: sizeA.y * 0.5, z: 0 },
                            category: 'object'
                        }
                    ]
                }
            )

            if(objA.physical && objA.physical.colliders[0])
            {
                objA.physical.colliders[0].setActiveEvents(this.game.RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS)
                objA.physical.colliders[0].setContactForceEventThreshold(5)
                objA.physical.onCollision = (force, position) =>
                {
                    this.game.audio.groups.get('hitBrick').playRandomNext(force, position)
                }
            }
        }
    }

    setKiosk()
    {
        // Interactive point
        const interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('kioskInteractivePoint')[0].position,
            'Map',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                this.game.modals.open('map')
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

    setControls()
    {
        // Interactive point
        const interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('controlsInteractivePoint')[0].position,
            'Controls',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                this.game.menu.open('controls')
                interactivePoint.hide()
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

        // Menu instance
        const menuInstance = this.game.menu.items.get('controls')

        menuInstance.events.on('close', () =>
        {
            interactivePoint.show()
        })

        menuInstance.events.on('open', () =>
        {
            if(this.game.inputs.mode === Inputs.MODE_GAMEPAD)
                menuInstance.tabs.goTo('gamepad')
            else if(this.game.inputs.mode === Inputs.MODE_MOUSEKEYBOARD)
                menuInstance.tabs.goTo('mouse-keyboard')
            else if(this.game.inputs.mode === Inputs.MODE_TOUCH)
                menuInstance.tabs.goTo('touch')
        })
    }

    setBonfire()
    {
        const position = this.references.items.get('bonfireHashes')[0].position

        // Particles
        let particles = null
        {
            const emissiveMaterial = this.game.materials.getFromName('emissiveOrangeRadialGradient')
    
            const count = 30
            const elevation = uniform(5)
            const positions = new Float32Array(count * 3)
            const scales = new Float32Array(count)
    
    
            for(let i = 0; i < count; i++)
            {
                const i3 = i * 3
    
                const angle = Math.PI * 2 * Math.random()
                const radius = Math.pow(Math.random(), 1.5) * 1
                positions[i3 + 0] = Math.cos(angle) * radius
                positions[i3 + 1] = Math.random()
                positions[i3 + 2] = Math.sin(angle) * radius
    
                scales[i] = 0.02 + Math.random() * 0.06
            }
            
            const positionAttribute = instancedArray(positions, 'vec3').toAttribute()
            const scaleAttribute = instancedArray(scales, 'float').toAttribute()
    
            const material = new THREE.SpriteNodeMaterial()
            material.outputNode = emissiveMaterial.outputNode
    
            const progress = float(0).toVar()
    
            material.positionNode = Fn(() =>
            {
                const newPosition = positionAttribute.toVar()
                progress.assign(newPosition.y.add(this.localTime.mul(newPosition.y)).fract())
    
                newPosition.y.assign(progress.mul(elevation))
                newPosition.xz.addAssign(this.game.wind.direction.mul(progress))
    
                const progressHide = step(0.8, progress).mul(100)
                newPosition.y.addAssign(progressHide)
                
                return newPosition
            })()
            material.scaleNode = Fn(() =>
            {
                const progressScale = progress.remapClamp(0.5, 1, 1, 0)
                return scaleAttribute.mul(progressScale)
            })()
    
            const geometry = new THREE.CircleGeometry(0.5, 8)
    
            particles = new THREE.Mesh(geometry, material)
            particles.visible = false
            particles.position.copy(position)
            particles.count = count
            this.game.scene.add(particles)
        }

        // Hashes
        {
            const alphaNode = Fn(() =>
            {
                const baseUv = uv(1)
                const distanceToCenter = baseUv.sub(0.5).length()
    
                const voronoi = texture(
                    this.game.noises.voronoi,
                    baseUv
                ).g
    
                voronoi.subAssign(distanceToCenter.remap(0, 0.5, 0.3, 0))
    
                return voronoi
            })()
    
            const material = new MeshDefaultMaterial({
                colorNode: color(0x6F6A87),
                alphaNode: alphaNode,
                hasWater: false,
                hasLightBounce: false
            })
    
            const mesh = this.references.items.get('bonfireHashes')[0]
            mesh.material = material
        }

        // Burn
        const burn = this.references.items.get('bonfireBurn')[0]
        burn.visible = false

        // Interactive point
        this.game.interactivePoints.create(
            this.references.items.get('bonfireInteractivePoint')[0].position,
            'Res(e)t',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.reset()

                gsap.delayedCall(2, () =>
                {
                    // Bonfire
                    particles.visible = true
                    burn.visible = true
                    this.game.ticker.wait(2, () =>
                    {
                        particles.geometry.boundingSphere.center.y = 2
                        particles.geometry.boundingSphere.radius = 2
                    })

                    // Sound
                    this.game.audio.groups.get('campfire').items[0].positions.push(position)
                })
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

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'landing')
        })
        this.events.on('boundingOut', () =>
        {
            this.game.achievements.setProgress('landingLeave', 1)
        })
    }

    update()
    {
        this.localTime.value += this.game.ticker.deltaScaled * 0.1
    }
}
