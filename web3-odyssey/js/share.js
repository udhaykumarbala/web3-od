import { completeJourney } from './main.js';

export class ShareManager {
    constructor(userProgress) {
        this.userProgress = userProgress;
        this.shareScreen = document.getElementById('share-screen');
        this.badgeCanvas = document.getElementById('badge-canvas');
        this.shareXBtn = document.getElementById('share-x');
        this.downloadBtn = document.getElementById('download-badge');
        this.replayBtn = document.getElementById('replay-btn');
        
        this.init();
    }
    
    init() {
        // Button handlers
        this.shareXBtn.addEventListener('click', () => this.shareOnX());
        this.downloadBtn.addEventListener('click', () => this.downloadBadge());
        this.replayBtn.addEventListener('click', () => this.replay());
    }
    
    // Show share screen
    showShareScreen() {
        this.generateBadge();
        this.shareScreen.classList.remove('hidden');
        
        // Animate in
        gsap.from(this.shareScreen, {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: "back.out"
        });
        
        // Confetti effect
        this.createConfetti();
    }
    
    // Generate personalized badge
    generateBadge() {
        const ctx = this.badgeCanvas.getContext('2d');
        const width = this.badgeCanvas.width;
        const height = this.badgeCanvas.height;
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add stars pattern
        this.drawStars(ctx, width, height);
        
        // Add border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, width - 20, height - 20);
        
        // Title
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Web3 Pioneer', width / 2, 60);
        
        // Achievement icon
        ctx.font = '60px Arial';
        ctx.fillText('🚀', width / 2, 120);
        
        // Stats
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${this.userProgress.score} points`, width / 2, 180);
        ctx.fillText(`NFTs Collected: ${this.userProgress.nftsCollected}`, width / 2, 210);
        ctx.fillText(`Quizzes Completed: ${this.userProgress.completedQuizzes.length}`, width / 2, 240);
        
        // Website
        ctx.font = '16px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText('web3odyssey.com', width / 2, height - 30);
        
        // Add glow effect
        this.addGlowEffect(ctx, width, height);
    }
    
    // Draw stars background
    drawStars(ctx, width, height) {
        const starCount = 50;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 2;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Add glow effect
    addGlowEffect(ctx, width, height) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        const glowGradient = ctx.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, width / 2
        );
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, width, height);
        
        ctx.restore();
    }
    
    // Share on X (Twitter)
    shareOnX() {
        const text = `🚀 Just completed my Web3 Odyssey journey!\n\n` +
                    `✨ Score: ${this.userProgress.score} points\n` +
                    `🎨 NFTs Collected: ${this.userProgress.nftsCollected}\n` +
                    `🧠 Web3 Knowledge: Unlocked!\n\n` +
                    `Take your own journey from Web2 to Web3 freedom:\n`;
        
        const url = 'https://web3odyssey.com';
        const hashtags = 'Web3Odyssey,Web3,CryptoEducation,Blockchain';
        
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
        
        window.open(tweetUrl, '_blank');
        
        // Track share event
        this.trackShare('twitter');
    }
    
    // Download badge
    downloadBadge() {
        const link = document.createElement('a');
        link.download = 'web3-odyssey-badge.png';
        link.href = this.badgeCanvas.toDataURL();
        link.click();
        
        // Track download
        this.trackShare('download');
    }
    
    // Replay
    replay() {
        // Reset progress
        this.userProgress.score = 0;
        this.userProgress.nftsCollected = 0;
        this.userProgress.choicesMade = [];
        this.userProgress.completedQuizzes = [];
        
        // Hide share screen
        this.shareScreen.classList.add('hidden');
        
        // Reload page for fresh start
        window.location.reload();
    }
    
    // Create confetti effect
    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f687b3', '#fbbf24', '#34d399'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -20px;
                transform: rotate(${Math.random() * 360}deg);
                z-index: 1001;
            `;
            
            document.body.appendChild(confetti);
            
            // Animate falling
            const duration = 3 + Math.random() * 2;
            const endPosition = window.innerHeight + 20;
            const rotation = Math.random() * 720 - 360;
            
            gsap.to(confetti, {
                y: endPosition,
                rotation: rotation,
                duration: duration,
                ease: "power1.in",
                onComplete: () => confetti.remove()
            });
            
            // Horizontal drift
            gsap.to(confetti, {
                x: `+=${Math.random() * 200 - 100}`,
                duration: duration,
                ease: "sine.inOut"
            });
        }
    }
    
    // Generate shareable image with badge
    async generateShareImage() {
        const shareCanvas = document.createElement('canvas');
        shareCanvas.width = 1200;
        shareCanvas.height = 630;
        const ctx = shareCanvas.getContext('2d');
        
        // Background
        const gradient = ctx.createLinearGradient(0, 0, shareCanvas.width, shareCanvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, shareCanvas.width, shareCanvas.height);
        
        // Draw badge on the left
        ctx.drawImage(this.badgeCanvas, 50, 157, 400, 315);
        
        // Text on the right
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Web3 Odyssey', 500, 200);
        
        ctx.font = '32px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText('Journey from Web2 to', 500, 260);
        ctx.fillText('Decentralized Freedom', 500, 300);
        
        ctx.font = '24px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('Learn Web3 through an', 500, 360);
        ctx.fillText('interactive 3D adventure', 500, 390);
        
        ctx.font = '20px Arial';
        ctx.fillStyle = '#667eea';
        ctx.fillText('web3odyssey.com', 500, 450);
        
        return shareCanvas.toDataURL();
    }
    
    // Track share events
    trackShare(platform) {
        // Analytics tracking (if implemented)
        console.log(`Shared on ${platform}`);
        
        // Store in localStorage for stats
        const shares = JSON.parse(localStorage.getItem('web3odyssey-shares') || '[]');
        shares.push({
            platform: platform,
            timestamp: Date.now(),
            score: this.userProgress.score
        });
        localStorage.setItem('web3odyssey-shares', JSON.stringify(shares));
    }
    
    // Get share stats
    getShareStats() {
        const shares = JSON.parse(localStorage.getItem('web3odyssey-shares') || '[]');
        return {
            total: shares.length,
            platforms: shares.reduce((acc, share) => {
                acc[share.platform] = (acc[share.platform] || 0) + 1;
                return acc;
            }, {})
        };
    }
    
    // Create leaderboard entry
    createLeaderboardEntry() {
        const entry = {
            score: this.userProgress.score,
            nfts: this.userProgress.nftsCollected,
            timestamp: Date.now(),
            id: this.generateUserId()
        };
        
        // Store locally (in real app, would send to server)
        const leaderboard = JSON.parse(localStorage.getItem('web3odyssey-leaderboard') || '[]');
        leaderboard.push(entry);
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard.splice(100); // Keep top 100
        localStorage.setItem('web3odyssey-leaderboard', JSON.stringify(leaderboard));
        
        return leaderboard.findIndex(e => e.id === entry.id) + 1;
    }
    
    // Generate anonymous user ID
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}