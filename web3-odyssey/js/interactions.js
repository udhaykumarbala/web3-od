import * as THREE from 'three';

export class InteractionManager {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.interactiveObjects = new Map();
        this.hoveredObject = null;
        this.enabled = false;
        
        this.init();
    }
    
    init() {
        // Mouse events
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('click', this.onClick.bind(this));
        
        // Touch events for mobile
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.renderer.domElement.addEventListener('touchend', this.onTouchEnd.bind(this));
        
        // Cursor style
        this.renderer.domElement.style.cursor = 'grab';
    }
    
    // Enable/disable interactions
    enableInteractions() {
        this.enabled = true;
    }
    
    disableInteractions() {
        this.enabled = false;
    }
    
    // Add interactive object
    addInteraction(type, callback) {
        this.interactiveObjects.set(type, callback);
    }
    
    // Clear all interactions
    clearInteractions() {
        this.interactiveObjects.clear();
    }
    
    // Mouse move handler
    onMouseMove(event) {
        if (!this.enabled) return;
        
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check for intersections
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const object = this.findInteractiveParent(intersects[0].object);
            
            if (object && object.userData.interactive) {
                if (this.hoveredObject !== object) {
                    this.onHoverEnter(object);
                }
                this.renderer.domElement.style.cursor = 'pointer';
            } else {
                if (this.hoveredObject) {
                    this.onHoverExit();
                }
                this.renderer.domElement.style.cursor = 'grab';
            }
        } else {
            if (this.hoveredObject) {
                this.onHoverExit();
            }
            this.renderer.domElement.style.cursor = 'grab';
        }
    }
    
    // Click handler
    onClick(event) {
        if (!this.enabled) return;
        
        // Calculate mouse position
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check for intersections
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const object = this.findInteractiveParent(intersects[0].object);
            
            if (object && object.userData.interactive) {
                this.handleInteraction(object);
            }
        }
    }
    
    // Touch handlers for mobile
    onTouchStart(event) {
        event.preventDefault();
        
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        }
    }
    
    onTouchEnd(event) {
        event.preventDefault();
        
        if (!this.enabled) return;
        
        // Use the last touch position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check for intersections
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const object = this.findInteractiveParent(intersects[0].object);
            
            if (object && object.userData.interactive) {
                this.handleInteraction(object);
            }
        }
    }
    
    // Find interactive parent
    findInteractiveParent(object) {
        let current = object;
        
        while (current) {
            if (current.userData && current.userData.interactive) {
                return current;
            }
            current = current.parent;
        }
        
        return null;
    }
    
    // Handle hover enter
    onHoverEnter(object) {
        this.hoveredObject = object;
        
        // Hover animation
        if (!object.userData.originalScale) {
            object.userData.originalScale = object.scale.clone();
        }
        
        gsap.to(object.scale, {
            x: object.userData.originalScale.x * 1.1,
            y: object.userData.originalScale.y * 1.1,
            z: object.userData.originalScale.z * 1.1,
            duration: 0.3,
            ease: "power2.out"
        });
        
        // Glow effect
        if (object.material && !object.userData.originalEmissive) {
            if (object.material.emissive) {
                object.userData.originalEmissive = object.material.emissive.clone();
                object.userData.originalEmissiveIntensity = object.material.emissiveIntensity;
                
                gsap.to(object.material, {
                    emissiveIntensity: 0.5,
                    duration: 0.3
                });
            }
        }
    }
    
    // Handle hover exit
    onHoverExit() {
        if (this.hoveredObject) {
            const object = this.hoveredObject;
            
            // Reset scale
            if (object.userData.originalScale) {
                gsap.to(object.scale, {
                    x: object.userData.originalScale.x,
                    y: object.userData.originalScale.y,
                    z: object.userData.originalScale.z,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
            
            // Reset glow
            if (object.material && object.userData.originalEmissive) {
                gsap.to(object.material, {
                    emissiveIntensity: object.userData.originalEmissiveIntensity,
                    duration: 0.3
                });
            }
            
            this.hoveredObject = null;
        }
    }
    
    // Handle interaction
    handleInteraction(object) {
        const type = object.userData.type;
        const callback = this.interactiveObjects.get(type);
        
        if (callback) {
            // Click animation
            const originalScale = object.scale.clone();
            
            gsap.to(object.scale, {
                x: originalScale.x * 0.9,
                y: originalScale.y * 0.9,
                z: originalScale.z * 0.9,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
            
            // Execute callback
            callback(object);
        }
    }
    
    // Create interaction indicator
    createInteractionIndicator(object) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 64;
        
        const context = canvas.getContext('2d');
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.font = 'bold 20px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('CLICK', 64, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        
        sprite.scale.set(2, 1, 1);
        sprite.position.copy(object.position);
        sprite.position.y += 3;
        
        return sprite;
    }
    
    // Highlight interactive objects
    highlightInteractiveObjects() {
        this.scene.traverse((child) => {
            if (child.userData && child.userData.interactive) {
                const indicator = this.createInteractionIndicator(child);
                this.scene.add(indicator);
                
                // Fade in and float animation
                indicator.material.opacity = 0;
                gsap.to(indicator.material, {
                    opacity: 1,
                    duration: 0.5
                });
                
                gsap.to(indicator.position, {
                    y: indicator.position.y + 0.5,
                    duration: 1,
                    yoyo: true,
                    repeat: -1,
                    ease: "power1.inOut"
                });
                
                // Remove after 3 seconds
                setTimeout(() => {
                    gsap.to(indicator.material, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            this.scene.remove(indicator);
                            indicator.material.dispose();
                        }
                    });
                }, 3000);
            }
        });
    }
    
    // Create ripple effect at click position
    createClickRipple(point) {
        const geometry = new THREE.RingGeometry(0.1, 0.2, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const ripple = new THREE.Mesh(geometry, material);
        ripple.position.copy(point);
        ripple.lookAt(this.camera.position);
        
        this.scene.add(ripple);
        
        // Animate ripple
        gsap.to(ripple.scale, {
            x: 5,
            y: 5,
            z: 5,
            duration: 0.5,
            ease: "power2.out"
        });
        
        gsap.to(material, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.scene.remove(ripple);
                geometry.dispose();
                material.dispose();
            }
        });
    }
    
    // Update method for animation loop
    update() {
        // Update any ongoing interactions or animations
        if (this.hoveredObject && this.hoveredObject.userData.hover) {
            this.hoveredObject.userData.hover();
        }
    }
    
    // Dispose method for cleanup
    dispose() {
        this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove);
        this.renderer.domElement.removeEventListener('click', this.onClick);
        this.renderer.domElement.removeEventListener('touchstart', this.onTouchStart);
        this.renderer.domElement.removeEventListener('touchend', this.onTouchEnd);
        
        this.interactiveObjects.clear();
        this.hoveredObject = null;
    }
}