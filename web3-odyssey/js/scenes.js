import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class SceneManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.loader = new GLTFLoader();
        this.animatedObjects = [];
        this.particles = [];
        this.portal = null;
    }
    
    // Clear the scene
    clearScene() {
        // Remove all children except lights
        const objectsToRemove = [];
        this.scene.traverse((child) => {
            if (child.type !== 'Light' && child.parent) {
                objectsToRemove.push(child);
            }
        });
        
        objectsToRemove.forEach(obj => {
            if (obj.parent) {
                obj.parent.remove(obj);
            }
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });
        
        this.animatedObjects = [];
        this.particles = [];
    }
    
    // Build Act 1: Web2 Walled City
    buildAct1() {
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // City buildings
        const buildingGroup = new THREE.Group();
        const buildingColors = [0x444444, 0x555555, 0x666666];
        
        for (let i = 0; i < 20; i++) {
            const width = 2 + Math.random() * 3;
            const height = 5 + Math.random() * 15;
            const depth = 2 + Math.random() * 3;
            
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshLambertMaterial({
                color: buildingColors[Math.floor(Math.random() * buildingColors.length)]
            });
            
            const building = new THREE.Mesh(geometry, material);
            building.position.set(
                (Math.random() - 0.5) * 50,
                height / 2,
                (Math.random() - 0.5) * 50
            );
            building.castShadow = true;
            building.receiveShadow = true;
            building.userData = { type: 'building', interactive: true };
            
            buildingGroup.add(building);
            
            // Add pulse animation
            this.animatedObjects.push({
                object: building,
                update: (time) => {
                    building.scale.y = 1 + Math.sin(time * 2 + i) * 0.02;
                }
            });
        }
        
        this.scene.add(buildingGroup);
        
        // Central tower (Data Lords)
        const towerGeometry = new THREE.CylinderGeometry(5, 5, 30, 8);
        const towerMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.set(0, 15, -20);
        tower.castShadow = true;
        this.scene.add(tower);
        
        // Add ominous glow to tower
        const glowLight = new THREE.PointLight(0xff0000, 1, 20);
        glowLight.position.set(0, 25, -20);
        this.scene.add(glowLight);
        
        // Create hidden portal (revealed after quiz)
        this.createPortal();
    }
    
    // Build Act 2: Blockchain Bridge
    buildAct2() {
        // Create blockchain bridge
        const bridgeGroup = new THREE.Group();
        
        // Chain blocks
        for (let i = 0; i < 20; i++) {
            const blockGeometry = new THREE.BoxGeometry(3, 1, 3);
            const blockMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(i * 0.05, 0.7, 0.5)
            });
            
            const block = new THREE.Mesh(blockGeometry, blockMaterial);
            block.position.set(i * 4 - 40, 0, 0);
            block.castShadow = true;
            block.receiveShadow = true;
            
            bridgeGroup.add(block);
            
            // Chain links
            if (i > 0) {
                const linkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4);
                const linkMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
                const link = new THREE.Mesh(linkGeometry, linkMaterial);
                link.position.set(i * 4 - 42, 0, 0);
                link.rotation.z = Math.PI / 2;
                bridgeGroup.add(link);
            }
            
            // Animated blocks
            this.animatedObjects.push({
                object: block,
                update: (time) => {
                    block.position.y = Math.sin(time * 2 + i * 0.5) * 0.3;
                    block.rotation.y = time * 0.5;
                }
            });
        }
        
        this.scene.add(bridgeGroup);
        
        // NFT collectibles
        this.createNFTs();
        
        // DeFi fountain
        this.createDeFiFountain();
        
        // DAO council area
        this.createDAOArea();
        
        // Background stars
        this.createStarField();
    }
    
    // Build Act 3: Decentralized Galaxy
    buildAct3() {
        // Create planets (different blockchain ecosystems)
        const planets = [
            { name: 'Ethereum', color: 0x627eea, size: 5, position: new THREE.Vector3(0, 0, 0) },
            { name: 'Solana', color: 0x00ffa3, size: 3, position: new THREE.Vector3(20, 5, -10) },
            { name: 'Polygon', color: 0x8247e5, size: 3, position: new THREE.Vector3(-15, -3, 15) },
            { name: 'Avalanche', color: 0xe84142, size: 3, position: new THREE.Vector3(10, -5, 20) }
        ];
        
        planets.forEach((planetData, index) => {
            const geometry = new THREE.SphereGeometry(planetData.size, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: planetData.color,
                emissive: planetData.color,
                emissiveIntensity: 0.3
            });
            
            const planet = new THREE.Mesh(geometry, material);
            planet.position.copy(planetData.position);
            planet.castShadow = true;
            planet.userData = { type: 'planet', name: planetData.name, interactive: true };
            
            this.scene.add(planet);
            
            // Orbital motion
            this.animatedObjects.push({
                object: planet,
                update: (time) => {
                    planet.rotation.y = time * 0.2;
                    if (index > 0) {
                        const angle = time * 0.1 * (index + 1) * 0.3;
                        planet.position.x = planetData.position.x + Math.cos(angle) * 10;
                        planet.position.z = planetData.position.z + Math.sin(angle) * 10;
                    }
                }
            });
            
            // Planet rings
            if (index === 0) {
                const ringGeometry = new THREE.RingGeometry(planetData.size + 1, planetData.size + 2, 64);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: planetData.color,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.5
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2;
                planet.add(ring);
            }
        });
        
        // Create build area
        this.createBuildArea();
        
        // Enhanced star field
        this.createGalaxyBackground();
        
        // Space particles
        this.createSpaceParticles();
    }
    
    // Create portal for Act 1
    createPortal() {
        const portalGeometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
        const portalMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0
        });
        
        this.portal = new THREE.Mesh(portalGeometry, portalMaterial);
        this.portal.position.set(25, 3, 0);
        this.portal.userData = { type: 'portal', interactive: true };
        this.scene.add(this.portal);
        
        // Portal particles
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            const angle = (i / 3) * 0.1;
            const radius = 2 + Math.random() * 2;
            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = Math.random() * 6 - 3;
            positions[i + 2] = Math.sin(angle) * radius;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00ff00,
            size: 0.1,
            transparent: true,
            opacity: 0
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        particleSystem.position.copy(this.portal.position);
        this.scene.add(particleSystem);
        
        this.animatedObjects.push({
            object: particleSystem,
            update: (time) => {
                particleSystem.rotation.y = time * 0.5;
                this.portal.rotation.z = time;
                this.portal.rotation.y = time * 0.5;
            }
        });
    }
    
    // Reveal portal
    revealPortal() {
        if (this.portal) {
            gsap.to(this.portal.material, {
                opacity: 1,
                duration: 2
            });
            
            // Animate portal particles
            const particleSystem = this.scene.children.find(
                child => child.type === 'Points' && child.position.equals(this.portal.position)
            );
            
            if (particleSystem) {
                gsap.to(particleSystem.material, {
                    opacity: 1,
                    duration: 2
                });
            }
        }
    }
    
    // Create NFTs for Act 2
    createNFTs() {
        const nftPositions = [
            new THREE.Vector3(-20, 3, 5),
            new THREE.Vector3(0, 3, -5),
            new THREE.Vector3(20, 3, 3)
        ];
        
        nftPositions.forEach((position, index) => {
            const geometry = new THREE.IcosahedronGeometry(1, 0);
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(index * 0.3, 1, 0.5),
                emissive: new THREE.Color().setHSL(index * 0.3, 1, 0.5),
                emissiveIntensity: 0.5
            });
            
            const nft = new THREE.Mesh(geometry, material);
            nft.position.copy(position);
            nft.userData = { type: 'nft', collected: false, interactive: true };
            
            this.scene.add(nft);
            
            // Floating animation
            this.animatedObjects.push({
                object: nft,
                update: (time) => {
                    nft.position.y = position.y + Math.sin(time * 2 + index) * 0.5;
                    nft.rotation.y = time;
                    nft.rotation.x = time * 0.7;
                }
            });
        });
    }
    
    // Create DeFi fountain
    createDeFiFountain() {
        const fountainGroup = new THREE.Group();
        fountainGroup.position.set(0, 0, 10);
        
        // Base
        const baseGeometry = new THREE.CylinderGeometry(5, 5, 0.5, 32);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x4444ff });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        fountainGroup.add(base);
        
        // Water particles
        const particleCount = 200;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 3;
            positions[i + 1] = Math.random() * 5;
            positions[i + 2] = (Math.random() - 0.5) * 3;
            
            velocities[i] = (Math.random() - 0.5) * 0.1;
            velocities[i + 1] = Math.random() * 0.2 + 0.1;
            velocities[i + 2] = (Math.random() - 0.5) * 0.1;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00ccff,
            size: 0.2,
            transparent: true,
            opacity: 0.8
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        fountainGroup.add(particleSystem);
        
        fountainGroup.userData = { type: 'defi', interactive: true };
        this.scene.add(fountainGroup);
        
        // Animate fountain
        this.particles.push({
            system: particleSystem,
            velocities: velocities,
            update: () => {
                const positions = particleSystem.geometry.attributes.position.array;
                
                for (let i = 0; i < particleCount * 3; i += 3) {
                    positions[i] += velocities[i];
                    positions[i + 1] += velocities[i + 1];
                    positions[i + 2] += velocities[i + 2];
                    
                    // Reset particle if it goes too high
                    if (positions[i + 1] > 10) {
                        positions[i] = (Math.random() - 0.5) * 3;
                        positions[i + 1] = 0;
                        positions[i + 2] = (Math.random() - 0.5) * 3;
                    }
                    
                    // Gravity
                    velocities[i + 1] -= 0.01;
                }
                
                particleSystem.geometry.attributes.position.needsUpdate = true;
            }
        });
    }
    
    // Create DAO area
    createDAOArea() {
        const daoGroup = new THREE.Group();
        daoGroup.position.set(-30, 0, 0);
        
        // Council table
        const tableGeometry = new THREE.CylinderGeometry(5, 5, 0.5, 6);
        const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        daoGroup.add(table);
        
        // Voting bars
        for (let i = 0; i < 3; i++) {
            const barGeometry = new THREE.BoxGeometry(1, 0.1, 1);
            const barMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(i * 0.3, 0.7, 0.5)
            });
            const bar = new THREE.Mesh(barGeometry, barMaterial);
            bar.position.set(-2 + i * 2, 2, 0);
            bar.userData = { voteHeight: 0 };
            daoGroup.add(bar);
        }
        
        daoGroup.userData = { type: 'dao', interactive: true };
        this.scene.add(daoGroup);
    }
    
    // Create star field
    createStarField() {
        const starCount = 1000;
        const stars = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 1] = (Math.random() - 0.5) * 200;
            positions[i + 2] = (Math.random() - 0.5) * 200;
        }
        
        stars.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const starField = new THREE.Points(stars, starMaterial);
        this.scene.add(starField);
    }
    
    // Create build area for Act 3
    createBuildArea() {
        const buildPlatform = new THREE.Group();
        buildPlatform.position.set(0, -10, 30);
        
        // Grid
        const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x444444);
        buildPlatform.add(gridHelper);
        
        // Available blocks
        const blockTypes = [
            { color: 0xff0000, position: new THREE.Vector3(-8, 1, 0) },
            { color: 0x00ff00, position: new THREE.Vector3(-8, 1, 2) },
            { color: 0x0000ff, position: new THREE.Vector3(-8, 1, 4) }
        ];
        
        blockTypes.forEach(blockType => {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshLambertMaterial({ color: blockType.color });
            const block = new THREE.Mesh(geometry, material);
            block.position.copy(blockType.position);
            block.userData = { type: 'buildBlock', color: blockType.color, interactive: true };
            buildPlatform.add(block);
        });
        
        this.scene.add(buildPlatform);
    }
    
    // Create galaxy background
    createGalaxyBackground() {
        const galaxyGeometry = new THREE.BufferGeometry();
        const galaxyCount = 5000;
        const positions = new Float32Array(galaxyCount * 3);
        const colors = new Float32Array(galaxyCount * 3);
        
        for (let i = 0; i < galaxyCount * 3; i += 3) {
            const radius = Math.random() * 100 + 50;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 20;
            
            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = height;
            positions[i + 2] = Math.sin(angle) * radius;
            
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.2 + 0.6, 0.7, 0.5);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }
        
        galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const galaxyMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
        this.scene.add(galaxy);
        
        this.animatedObjects.push({
            object: galaxy,
            update: (time) => {
                galaxy.rotation.y = time * 0.02;
            }
        });
    }
    
    // Create space particles
    createSpaceParticles() {
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            transparent: true,
            opacity: 0.5
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        
        this.animatedObjects.push({
            object: particleSystem,
            update: (time) => {
                const positions = particleSystem.geometry.attributes.position.array;
                
                for (let i = 0; i < particleCount * 3; i += 3) {
                    positions[i + 2] += 0.1;
                    
                    if (positions[i + 2] > 50) {
                        positions[i + 2] = -50;
                    }
                }
                
                particleSystem.geometry.attributes.position.needsUpdate = true;
            }
        });
    }
    
    // Show data harvest animation
    showDataHarvest(position) {
        const particleCount = 50;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = position.x + (Math.random() - 0.5) * 2;
            positions[i + 1] = position.y;
            positions[i + 2] = position.z + (Math.random() - 0.5) * 2;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xff0000,
            size: 0.3,
            transparent: true,
            opacity: 1
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        
        // Animate particles to tower
        gsap.to(positions, {
            duration: 2,
            ease: "power2.in",
            onUpdate: () => {
                for (let i = 0; i < particleCount * 3; i += 3) {
                    positions[i] += (0 - positions[i]) * 0.05;
                    positions[i + 1] += (25 - positions[i + 1]) * 0.05;
                    positions[i + 2] += (-20 - positions[i + 2]) * 0.05;
                }
                particleSystem.geometry.attributes.position.needsUpdate = true;
            },
            onComplete: () => {
                this.scene.remove(particleSystem);
                particleSystem.geometry.dispose();
                particleSystem.material.dispose();
            }
        });
        
        gsap.to(particleMaterial, {
            opacity: 0,
            duration: 2
        });
    }
    
    // Collect NFT
    collectNFT(nft) {
        if (nft.userData.collected) return;
        
        nft.userData.collected = true;
        
        // Collection animation
        gsap.to(nft.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: "back.in",
            onComplete: () => {
                this.scene.remove(nft);
                nft.geometry.dispose();
                nft.material.dispose();
            }
        });
        
        // Particle burst
        this.createParticleBurst(nft.position, nft.material.color);
    }
    
    // Create particle burst
    createParticleBurst(position, color) {
        const particleCount = 30;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = position.x;
            positions[i + 1] = position.y;
            positions[i + 2] = position.z;
            
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                Math.random() * 0.5,
                (Math.random() - 0.5) * 0.5
            );
            velocities.push(velocity);
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: color,
            size: 0.3,
            transparent: true,
            opacity: 1
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        
        // Animate burst
        const animate = () => {
            const positions = particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y;
                positions[i * 3 + 2] += velocities[i].z;
                
                velocities[i].y -= 0.01; // Gravity
            }
            
            particleSystem.geometry.attributes.position.needsUpdate = true;
        };
        
        const animationId = setInterval(animate, 16);
        
        gsap.to(particleMaterial, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                clearInterval(animationId);
                this.scene.remove(particleSystem);
                particleSystem.geometry.dispose();
                particleSystem.material.dispose();
            }
        });
    }
    
    // Show DeFi simulation
    showDeFiSimulation() {
        // Enhanced fountain effect
        const fountain = this.scene.children.find(child => 
            child.userData && child.userData.type === 'defi'
        );
        
        if (fountain) {
            gsap.to(fountain.scale, {
                x: 1.2,
                y: 1.2,
                z: 1.2,
                duration: 0.5,
                yoyo: true,
                repeat: 2
            });
        }
    }
    
    // Show DAO vote
    showDAOVote() {
        const dao = this.scene.children.find(child =>
            child.userData && child.userData.type === 'dao'
        );
        
        if (dao) {
            const bars = dao.children.filter(child => child.geometry && child.geometry.type === 'BoxGeometry');
            const votes = [0.7, 0.2, 0.1]; // Simulated vote distribution
            
            bars.forEach((bar, index) => {
                if (index > 0 && index <= 3) {
                    const targetHeight = votes[index - 1] * 5;
                    gsap.to(bar.scale, {
                        y: targetHeight,
                        duration: 1,
                        ease: "power2.out"
                    });
                    gsap.to(bar.position, {
                        y: targetHeight / 2,
                        duration: 1,
                        ease: "power2.out"
                    });
                }
            });
        }
    }
    
    // Add build block
    addBuildBlock(position) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5)
        });
        const block = new THREE.Mesh(geometry, material);
        
        // Snap to grid
        block.position.set(
            Math.round(position.x),
            Math.round(position.y),
            Math.round(position.z)
        );
        
        this.scene.add(block);
        
        // Pop-in animation
        block.scale.set(0, 0, 0);
        gsap.to(block.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
            ease: "back.out"
        });
    }
    
    // Update animations
    update() {
        const time = Date.now() * 0.001;
        
        // Update animated objects
        this.animatedObjects.forEach(item => {
            if (item.update) {
                item.update(time);
            }
        });
        
        // Update particles
        this.particles.forEach(particle => {
            if (particle.update) {
                particle.update();
            }
        });
    }
}