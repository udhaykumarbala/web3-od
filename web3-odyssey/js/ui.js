export class UIManager {
    constructor() {
        this.storyContainer = document.getElementById('story-container');
        this.storyText = document.getElementById('story-text');
        this.continueBtn = document.getElementById('continue-btn');
        this.quizContainer = document.getElementById('quiz-container');
        this.quizQuestion = document.getElementById('quiz-question');
        this.quizOptions = document.getElementById('quiz-options');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.hintContainer = document.getElementById('hint-container');
        this.hintText = document.getElementById('hint-text');
        
        this.isShowingStory = false;
        this.storyQueue = [];
        this.currentCallback = null;
        
        this.init();
    }
    
    init() {
        // Continue button handler
        this.continueBtn.addEventListener('click', () => {
            this.hideStory();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && this.isShowingStory) {
                e.preventDefault();
                this.hideStory();
            }
        });
    }
    
    // Show story text
    showStory(text, callback) {
        this.isShowingStory = true;
        this.currentCallback = callback;
        
        // Typewriter effect
        this.storyText.innerHTML = '';
        this.storyContainer.classList.add('active');
        
        let index = 0;
        const typeWriter = () => {
            if (index < text.length) {
                this.storyText.innerHTML += text.charAt(index);
                index++;
                setTimeout(typeWriter, 30);
            } else {
                this.continueBtn.style.display = 'block';
            }
        };
        
        typeWriter();
    }
    
    // Hide story
    hideStory() {
        this.storyContainer.classList.remove('active');
        this.continueBtn.style.display = 'none';
        this.isShowingStory = false;
        
        if (this.currentCallback) {
            this.currentCallback();
            this.currentCallback = null;
        }
        
        // Check for queued stories
        if (this.storyQueue.length > 0) {
            const next = this.storyQueue.shift();
            setTimeout(() => {
                this.showStory(next.text, next.callback);
            }, 500);
        }
    }
    
    // Queue story
    queueStory(text, callback) {
        this.storyQueue.push({ text, callback });
    }
    
    // Show quiz
    showQuiz(question, options, callback) {
        this.quizContainer.classList.remove('hidden');
        this.quizQuestion.textContent = question;
        this.quizOptions.innerHTML = '';
        
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option.text;
            
            button.addEventListener('click', () => {
                // Disable all buttons
                const allButtons = this.quizOptions.querySelectorAll('.quiz-option');
                allButtons.forEach(btn => btn.disabled = true);
                
                // Show result
                if (option.correct) {
                    button.classList.add('correct');
                    this.showFeedback('Correct! Well done!', true);
                } else {
                    button.classList.add('incorrect');
                    this.showFeedback('Not quite. Try again!', false);
                }
                
                // Hide quiz after delay
                setTimeout(() => {
                    this.hideQuiz();
                    callback(option.correct);
                }, 2000);
            });
            
            this.quizOptions.appendChild(button);
        });
    }
    
    // Hide quiz
    hideQuiz() {
        this.quizContainer.classList.add('hidden');
    }
    
    // Show feedback
    showFeedback(message, isCorrect) {
        const feedback = document.createElement('div');
        feedback.className = 'feedback';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${isCorrect ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)'};
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 1.2rem;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
    
    // Update progress bar
    updateProgress(percentage, text) {
        gsap.to(this.progressFill, {
            width: `${percentage}%`,
            duration: 1,
            ease: "power2.out"
        });
        
        if (text) {
            this.progressText.textContent = text;
        }
    }
    
    // Show hint
    showHint(text, duration = 3000) {
        this.hintText.textContent = text;
        this.hintContainer.classList.add('visible');
        
        if (this.hintTimeout) {
            clearTimeout(this.hintTimeout);
        }
        
        this.hintTimeout = setTimeout(() => {
            this.hideHint();
        }, duration);
    }
    
    // Hide hint
    hideHint() {
        this.hintContainer.classList.remove('visible');
    }
    
    // Show achievement
    showAchievement(title, description, icon = '🏆') {
        const achievement = document.createElement('div');
        achievement.className = 'achievement';
        achievement.style.cssText = `
            position: fixed;
            top: 100px;
            right: -400px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 350px;
            z-index: 1000;
        `;
        
        achievement.innerHTML = `
            <div style="font-size: 2rem;">${icon}</div>
            <div>
                <h4 style="margin: 0 0 5px 0; font-size: 1.1rem;">${title}</h4>
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">${description}</p>
            </div>
        `;
        
        document.body.appendChild(achievement);
        
        // Slide in
        gsap.to(achievement, {
            right: 20,
            duration: 0.5,
            ease: "power2.out"
        });
        
        // Slide out after delay
        setTimeout(() => {
            gsap.to(achievement, {
                right: -400,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => achievement.remove()
            });
        }, 4000);
    }
    
    // Show choice
    showChoice(question, choices, callback) {
        const choiceContainer = document.createElement('div');
        choiceContainer.className = 'choice-container';
        choiceContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(102, 126, 234, 0.5);
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 90%;
            z-index: 100;
        `;
        
        choiceContainer.innerHTML = `
            <h3 style="text-align: center; margin-bottom: 30px; font-size: 1.3rem;">${question}</h3>
            <div class="choice-buttons" style="display: flex; flex-direction: column; gap: 15px;"></div>
        `;
        
        const buttonContainer = choiceContainer.querySelector('.choice-buttons');
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.style.cssText = `
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1rem;
                text-align: left;
            `;
            button.textContent = choice.text;
            
            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(102, 126, 234, 0.2)';
                button.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                button.style.transform = 'translateX(5px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(255, 255, 255, 0.05)';
                button.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                button.style.transform = 'translateX(0)';
            });
            
            button.addEventListener('click', () => {
                choiceContainer.remove();
                callback(choice.value);
            });
            
            buttonContainer.appendChild(button);
        });
        
        document.body.appendChild(choiceContainer);
    }
    
    // Show loading
    showLoading(text = 'Loading...') {
        const loading = document.createElement('div');
        loading.id = 'temp-loading';
        loading.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            z-index: 1000;
        `;
        
        loading.innerHTML = `
            <div class="spinner" style="
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            "></div>
            <p style="margin: 0; color: white;">${text}</p>
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        loading.appendChild(style);
        
        document.body.appendChild(loading);
    }
    
    // Hide loading
    hideLoading() {
        const loading = document.getElementById('temp-loading');
        if (loading) {
            loading.remove();
        }
    }
    
    // Show tooltip
    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 0.9rem;
            pointer-events: none;
            z-index: 1000;
            white-space: nowrap;
        `;
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        
        // Remove on mouseout
        element.addEventListener('mouseout', () => {
            tooltip.remove();
        }, { once: true });
    }
}