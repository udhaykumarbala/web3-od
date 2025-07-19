export class AudioManager {
    constructor() {
        this.context = null;
        this.sounds = new Map();
        this.isMuted = false;
        this.masterVolume = 0.7;
        this.audioToggle = document.getElementById('audio-toggle');
        
        this.init();
    }
    
    init() {
        // Initialize Web Audio API on first user interaction
        const initAudio = () => {
            if (!this.context) {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
                this.loadSounds();
            }
            document.removeEventListener('click', initAudio);
            document.removeEventListener('touchstart', initAudio);
        };
        
        document.addEventListener('click', initAudio);
        document.addEventListener('touchstart', initAudio);
        
        // Audio toggle button
        this.audioToggle.addEventListener('click', () => {
            this.toggleMute();
        });
        
        // Check localStorage for mute preference
        const savedMute = localStorage.getItem('web3odyssey-muted');
        if (savedMute === 'true') {
            this.mute();
        }
    }
    
    // Load sound effects
    loadSounds() {
        // Define sound URLs (using free sound placeholders)
        const soundUrls = {
            click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp3x+/gkEEMFWO57OurXRoMUKri7bhfGgU0kte8',
            collect: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp3x+/gkEEMFWO57OurXRoMUKri7bhfGgU0kte8',
            portal: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp3x+/gkEEMFWO57OurXRoMUKri7bhfGgU0kte8',
            dataLoss: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp3x+/gkEEMFWO57OurXRoMUKri7bhfGgU0kte8',
            ambient: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp3x+/gkEEMFWO57OurXRoMUKri7bhfGgU0kte8'
        };
        
        // Load each sound
        Object.entries(soundUrls).forEach(([name, url]) => {
            this.loadSound(name, url);
        });
    }
    
    // Load individual sound
    async loadSound(name, url) {
        if (!this.context) return;
        
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.sounds.set(name, audioBuffer);
        } catch (error) {
            console.warn(`Failed to load sound: ${name}`, error);
        }
    }
    
    // Play sound
    play(name, options = {}) {
        if (!this.context || this.isMuted || !this.sounds.has(name)) return;
        
        const buffer = this.sounds.get(name);
        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();
        
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        // Set volume
        const volume = (options.volume || 1) * this.masterVolume;
        gainNode.gain.value = volume;
        
        // Set playback rate (pitch)
        if (options.rate) {
            source.playbackRate.value = options.rate;
        }
        
        // Loop
        if (options.loop) {
            source.loop = true;
        }
        
        // Start playback
        source.start(0);
        
        // Return controls
        return {
            stop: () => source.stop(),
            setVolume: (vol) => {
                gainNode.gain.value = vol * this.masterVolume;
            }
        };
    }
    
    // Play background music
    playBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
        
        this.backgroundMusic = this.play('ambient', {
            volume: 0.3,
            loop: true
        });
    }
    
    // Stop background music
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
            this.backgroundMusic = null;
        }
    }
    
    // Toggle mute
    toggleMute() {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
    }
    
    // Mute
    mute() {
        this.isMuted = true;
        this.audioToggle.classList.add('muted');
        localStorage.setItem('web3odyssey-muted', 'true');
        
        if (this.backgroundMusic) {
            this.stopBackgroundMusic();
        }
    }
    
    // Unmute
    unmute() {
        this.isMuted = false;
        this.audioToggle.classList.remove('muted');
        localStorage.setItem('web3odyssey-muted', 'false');
        
        if (this.context && !this.backgroundMusic) {
            this.playBackgroundMusic();
        }
    }
    
    // Set master volume
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }
    
    // Create dynamic sound
    createDynamicSound(frequency = 440, type = 'sine', duration = 0.3) {
        if (!this.context || this.isMuted) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        // Envelope
        const now = this.context.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3 * this.masterVolume, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
    }
    
    // Play note sequence
    playNoteSequence(notes, tempo = 120) {
        if (!this.context || this.isMuted) return;
        
        const noteFrequencies = {
            'C': 261.63,
            'D': 293.66,
            'E': 329.63,
            'F': 349.23,
            'G': 392.00,
            'A': 440.00,
            'B': 493.88
        };
        
        const beatDuration = 60 / tempo;
        let currentTime = 0;
        
        notes.forEach(note => {
            if (noteFrequencies[note]) {
                setTimeout(() => {
                    this.createDynamicSound(noteFrequencies[note], 'sine', 0.2);
                }, currentTime * 1000);
            }
            currentTime += beatDuration;
        });
    }
    
    // Play success sound
    playSuccess() {
        this.playNoteSequence(['C', 'E', 'G', 'C'], 240);
    }
    
    // Play error sound
    playError() {
        this.createDynamicSound(200, 'sawtooth', 0.5);
    }
    
    // Play hover sound
    playHover() {
        this.createDynamicSound(800, 'sine', 0.1);
    }
    
    // Create spatial audio source
    createSpatialSound(name, position) {
        if (!this.context || this.isMuted || !this.sounds.has(name)) return;
        
        const buffer = this.sounds.get(name);
        const source = this.context.createBufferSource();
        const panner = this.context.createPanner();
        const gainNode = this.context.createGain();
        
        source.buffer = buffer;
        source.connect(panner);
        panner.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        // Set position
        panner.setPosition(position.x, position.y, position.z);
        
        // Set distance model
        panner.distanceModel = 'exponential';
        panner.refDistance = 1;
        panner.maxDistance = 100;
        panner.rolloffFactor = 2;
        
        gainNode.gain.value = this.masterVolume;
        
        source.start(0);
        
        return {
            updatePosition: (newPos) => {
                panner.setPosition(newPos.x, newPos.y, newPos.z);
            },
            stop: () => source.stop()
        };
    }
    
    // Update listener position (camera)
    updateListenerPosition(camera) {
        if (!this.context) return;
        
        const listener = this.context.listener;
        
        // Update position
        listener.setPosition(
            camera.position.x,
            camera.position.y,
            camera.position.z
        );
        
        // Update orientation
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(camera.quaternion);
        
        const up = new THREE.Vector3(0, 1, 0);
        up.applyQuaternion(camera.quaternion);
        
        listener.setOrientation(
            forward.x, forward.y, forward.z,
            up.x, up.y, up.z
        );
    }
    
    // Dispose
    dispose() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
        
        if (this.context) {
            this.context.close();
        }
        
        this.sounds.clear();
    }
}