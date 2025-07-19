import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SceneManager } from './scenes.js';
import { UIManager } from './ui.js';
import { InteractionManager } from './interactions.js';
import { AudioManager } from './audio.js';
import { ShareManager } from './share.js';

// Global variables
let scene, camera, renderer, controls;
let sceneManager, uiManager, interactionManager, audioManager, shareManager;
let currentAct = 1;
let userProgress = {
    score: 0,
    nftsCollected: 0,
    choicesMade: [],
    completedQuizzes: []
};

// Initialize Three.js
function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 100);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, 10);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('webgl-canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 3;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);
    
    // Initialize managers
    sceneManager = new SceneManager(scene, camera);
    uiManager = new UIManager();
    interactionManager = new InteractionManager(scene, camera, renderer);
    audioManager = new AudioManager();
    shareManager = new ShareManager(userProgress);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Load first scene after initialization
    setTimeout(() => {
        hideLoadingScreen();
        startJourney();
    }, 2000);
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            loadingScreen.style.display = 'none';
        }
    });
}

// Start the journey
function startJourney() {
    // Show initial hint
    uiManager.showHint('Click and drag to explore the world');
    
    // Load Act 1
    loadAct(1);
    
    // Start with intro story
    setTimeout(() => {
        uiManager.showStory(
            "You awaken in a grayscale city, where towering structures loom overhead. " +
            "This is Web2 - a world controlled by Central Lords who harvest your data and creativity. " +
            "But whispers of freedom echo through the digital winds...",
            () => {
                uiManager.showHint('Click on buildings to interact');
                interactionManager.enableInteractions();
            }
        );
    }, 1000);
}

// Load act
function loadAct(actNumber) {
    currentAct = actNumber;
    
    // Clear previous scene
    sceneManager.clearScene();
    
    // Update progress bar
    const progressText = ['', 'Act 1: The Web2 Walled City', 'Act 2: The Blockchain Bridge', 'Act 3: The Decentralized Galaxy'][actNumber];
    uiManager.updateProgress((actNumber - 1) * 33.33, progressText);
    
    // Load appropriate scene
    switch (actNumber) {
        case 1:
            sceneManager.buildAct1();
            scene.fog.color = new THREE.Color(0x1a1a1a);
            break;
        case 2:
            sceneManager.buildAct2();
            scene.fog.color = new THREE.Color(0x001133);
            break;
        case 3:
            sceneManager.buildAct3();
            scene.fog.color = new THREE.Color(0x000011);
            break;
    }
    
    // Set up interactions for the act
    setupActInteractions(actNumber);
}

// Set up act-specific interactions
function setupActInteractions(actNumber) {
    interactionManager.clearInteractions();
    
    switch (actNumber) {
        case 1:
            // Act 1 interactions
            interactionManager.addInteraction('building', (object) => {
                // Data harvest animation
                sceneManager.showDataHarvest(object.position);
                audioManager.play('dataLoss');
                
                uiManager.showStory(
                    "Your data flows away to the Central Lords' towers. " +
                    "In Web2, you create but don't own. You build but can't control. " +
                    "Is there another way?",
                    () => {
                        // Show quiz after a few interactions
                        if (userProgress.choicesMade.length > 2) {
                            showQuiz1();
                        }
                    }
                );
            });
            
            interactionManager.addInteraction('portal', (object) => {
                uiManager.showStory(
                    "A glowing portal appears - a gateway to Web3! " +
                    "Will you take the leap into the unknown?",
                    () => {
                        transitionToAct(2);
                    }
                );
            });
            break;
            
        case 2:
            // Act 2 interactions
            interactionManager.addInteraction('nft', (object) => {
                sceneManager.collectNFT(object);
                userProgress.nftsCollected++;
                audioManager.play('collect');
                
                uiManager.showStory(
                    `You collected a unique digital artifact! NFTs represent true ownership in Web3. ` +
                    `This one is yours forever, tradeable across any compatible world. ` +
                    `(${userProgress.nftsCollected} collected)`,
                    () => {}
                );
            });
            
            interactionManager.addInteraction('defi', (object) => {
                sceneManager.showDeFiSimulation();
                uiManager.showStory(
                    "Welcome to DeFi - Decentralized Finance! Here, you can lend, borrow, and earn " +
                    "without traditional banks. Your assets work for you, transparently and permissionlessly.",
                    () => {
                        showQuiz2();
                    }
                );
            });
            
            interactionManager.addInteraction('dao', (object) => {
                uiManager.showStory(
                    "This is a DAO - Decentralized Autonomous Organization. " +
                    "Community members vote on decisions together. No single ruler, just collective wisdom.",
                    () => {
                        // Show voting simulation
                        sceneManager.showDAOVote();
                    }
                );
            });
            break;
            
        case 3:
            // Act 3 interactions
            interactionManager.addInteraction('planet', (object) => {
                uiManager.showStory(
                    "Each planet represents a different blockchain ecosystem. " +
                    "In Web3, you can travel between them freely, taking your assets and identity with you.",
                    () => {}
                );
            });
            
            interactionManager.addInteraction('buildBlock', (object) => {
                sceneManager.addBuildBlock(object.position);
                uiManager.showStory(
                    "You're building in the decentralized galaxy! " +
                    "In Web3, creators own their work and earn directly from their community.",
                    () => {}
                );
            });
            break;
    }
}

// Show quizzes
function showQuiz1() {
    uiManager.showQuiz(
        "Who owns your data in Web2?",
        [
            { text: "You", correct: false },
            { text: "The platform", correct: true },
            { text: "Nobody", correct: false },
            { text: "The government", correct: false }
        ],
        (correct) => {
            if (correct) {
                userProgress.score += 10;
                userProgress.completedQuizzes.push('web2-data');
                // Reveal portal
                sceneManager.revealPortal();
                uiManager.showHint('A portal has appeared! Click to continue your journey.');
            }
        }
    );
}

function showQuiz2() {
    uiManager.showQuiz(
        "What does DeFi stand for?",
        [
            { text: "Digital Finance", correct: false },
            { text: "Decentralized Finance", correct: true },
            { text: "Distributed Files", correct: false },
            { text: "Direct Funding", correct: false }
        ],
        (correct) => {
            if (correct) {
                userProgress.score += 10;
                userProgress.completedQuizzes.push('defi');
            }
        }
    );
}

// Transition between acts
function transitionToAct(nextAct) {
    // Fade out
    gsap.to(scene.fog, {
        near: 0,
        far: 1,
        duration: 2,
        onComplete: () => {
            loadAct(nextAct);
            // Fade in
            gsap.to(scene.fog, {
                near: 1,
                far: 100,
                duration: 2
            });
        }
    });
    
    // Camera animation
    gsap.to(camera.position, {
        y: 20,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
            gsap.to(camera.position, {
                y: 5,
                duration: 2,
                ease: "power2.inOut"
            });
        }
    });
}

// Complete journey
function completeJourney() {
    userProgress.score += 50; // Completion bonus
    uiManager.updateProgress(100, 'Journey Complete!');
    
    // Show completion story
    uiManager.showStory(
        "Congratulations, Web3 Pioneer! You've journeyed from the constraints of Web2 " +
        "to the freedom of Web3. You now understand the power of decentralization, " +
        "true ownership, and community governance. The future is yours to build!",
        () => {
            // Show share screen
            shareManager.showShareScreen();
        }
    );
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Update scene animations
    if (sceneManager) {
        sceneManager.update();
    }
    
    // Update interaction manager
    if (interactionManager) {
        interactionManager.update();
    }
    
    // Render
    renderer.render(scene, camera);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Update loading progress
    const loadingProgress = document.querySelector('.loading-progress');
    gsap.to(loadingProgress, {
        width: '100%',
        duration: 1.5,
        ease: "power2.inOut"
    });
    
    // Initialize Three.js
    init();
    
    // Start animation loop
    animate();
});

// Export for use in other modules
export { camera, scene, renderer, userProgress, completeJourney };