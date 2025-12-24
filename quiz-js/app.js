// 问答应用主逻辑
class QuizApp {
    constructor() {
        this.currentTopic = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.questions = [];
        this.userAnswers = [];
        this.init();
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.showHomePage();
    }

    // 绑定事件
    bindEvents() {
        // 选题卡片点击
        document.querySelectorAll('.topic-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const topic = e.currentTarget.dataset.topic;
                this.startQuiz(topic);
            });
        });

        // 返回按钮
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showHomePage();
        });

        // 提交答案按钮
        document.getElementById('submitAnswer').addEventListener('click', () => {
            this.submitAnswer();
        });

        // 重试按钮
        document.getElementById('retryBtn').addEventListener('click', () => {
            this.retryQuiz();
        });

        // 返回首页按钮
        document.getElementById('homeBtn').addEventListener('click', () => {
            this.showHomePage();
        });

        // 模态框点击关闭
        document.getElementById('feedbackModal').addEventListener('click', (e) => {
            if (e.target.id === 'feedbackModal' || e.target.closest('.modal-content')) {
                this.closeFeedbackModal();
                this.nextQuestion();
            }
        });
    }

    // 显示首页
    showHomePage() {
        this.hideAllPages();
        document.getElementById('homePage').classList.add('active');
        this.resetQuiz();
    }

    // 显示问答页面
    showQuizPage() {
        this.hideAllPages();
        document.getElementById('quizPage').classList.add('active');
    }

    // 显示结果页面
    showResultPage() {
        this.hideAllPages();
        document.getElementById('resultPage').classList.add('active');
    }

    // 隐藏所有页面
    hideAllPages() {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
    }

    // 开始问答
    startQuiz(topicKey) {
        this.currentTopic = topicKey;
        // 从50道题中随机选择10道题
        const allQuestions = [...quizData[topicKey].questions];
        this.questions = this.shuffleArray(allQuestions).slice(0, 10);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        
        // 更新页面标题
        document.getElementById('topicTitle').textContent = quizData[topicKey].title;
        
        this.showQuizPage();
        this.displayQuestion();
        this.updateProgress();
        this.updateScore();
    }

    // 数组随机排序
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // 显示当前问题
    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // 更新问题编号
        document.getElementById('questionNumber').textContent = this.currentQuestionIndex + 1;
        
        // 更新问题文本
        document.getElementById('questionText').textContent = question.question;
        
        // 更新选项
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.dataset.index = index;
            optionElement.innerHTML = `
                <span class="option-label">${String.fromCharCode(65 + index)}.</span>
                ${option}
            `;
            
            optionElement.addEventListener('click', () => {
                this.selectOption(index);
            });
            
            optionsContainer.appendChild(optionElement);
            
            // 添加进入动画
            setTimeout(() => {
                optionElement.classList.add('option-enter');
            }, index * 100);
        });
        
        // 重置选择状态
        this.selectedAnswer = null;
        document.getElementById('submitAnswer').disabled = true;
    }

    // 选择选项
    selectOption(index) {
        // 移除之前的选择
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // 添加新的选择
        const selectedOption = document.querySelector(`[data-index="${index}"]`);
        selectedOption.classList.add('selected');
        selectedOption.classList.add('option-select');
        
        this.selectedAnswer = index;
        document.getElementById('submitAnswer').disabled = false;
        
        // 移除动画类
        setTimeout(() => {
            selectedOption.classList.remove('option-select');
        }, 300);
    }

    // 提交答案
    submitAnswer() {
        if (this.selectedAnswer === null) return;
        
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = this.selectedAnswer === question.correct;
        
        // 记录用户答案
        this.userAnswers.push({
            questionIndex: this.currentQuestionIndex,
            selectedAnswer: this.selectedAnswer,
            correctAnswer: question.correct,
            isCorrect: isCorrect
        });
        
        // 更新分数
        if (isCorrect) {
            this.score++;
        }
        
        // 显示答案反馈
        this.showAnswerFeedback(isCorrect, question);
        
        // 更新选项样式
        this.updateOptionsAfterSubmit(question.correct);
        
        // 禁用提交按钮
        document.getElementById('submitAnswer').disabled = true;
        
        // 设置自动进入下一题的定时器
        this.autoNextTimer = setTimeout(() => {
            this.closeFeedbackModal();
            this.nextQuestion();
        }, 3000);
    }

    // 显示答案反馈
    showAnswerFeedback(isCorrect, question) {
        const modal = document.getElementById('feedbackModal');
        const icon = document.getElementById('feedbackIcon');
        const text = document.getElementById('feedbackText');
        const explanation = document.getElementById('feedbackExplanation');
        
        if (isCorrect) {
            icon.textContent = '✓';
            icon.className = 'feedback-icon correct';
            text.textContent = '回答正确！';
            text.className = 'feedback-text correct';
        } else {
            icon.textContent = '✗';
            icon.className = 'feedback-icon incorrect';
            text.textContent = '回答错误！';
            text.className = 'feedback-text incorrect';
        }
        
        explanation.textContent = question.explanation;
        modal.style.display = 'block';
    }

    // 关闭反馈弹窗
    closeFeedbackModal() {
        document.getElementById('feedbackModal').style.display = 'none';
        // 清除自动进入下一题的定时器
        if (this.autoNextTimer) {
            clearTimeout(this.autoNextTimer);
            this.autoNextTimer = null;
        }
    }

    // 更新选项样式（显示正确答案）
    updateOptionsAfterSubmit(correctIndex) {
        document.querySelectorAll('.option').forEach((option, index) => {
            if (index === correctIndex) {
                option.classList.add('correct');
                option.classList.add('option-correct-feedback');
            } else if (index === this.selectedAnswer && index !== correctIndex) {
                option.classList.add('incorrect');
                option.classList.add('option-incorrect-feedback');
            }
        });
    }

    // 下一题
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
            this.updateProgress();
            this.updateScore();
        } else {
            this.showResults();
        }
    }

    // 更新进度条
    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressText').textContent = 
            `${this.currentQuestionIndex + 1}/${this.questions.length}`;
    }

    // 更新分数显示
    updateScore() {
        const scoreElement = document.getElementById('currentScore');
        scoreElement.textContent = this.score;
        scoreElement.classList.add('score-increment');
        
        setTimeout(() => {
            scoreElement.classList.remove('score-increment');
        }, 600);
    }

    // 显示结果
    showResults() {
        this.showResultPage();
        
        const totalQuestions = this.questions.length;
        const rating = ratingSystem.getRating(this.score, totalQuestions);
        
        // 更新结果显示
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('totalScore').textContent = totalQuestions;
        
        const resultRating = document.getElementById('resultRating');
        resultRating.textContent = rating.title;
        resultRating.className = `result-rating ${rating.level}`;
        
        document.getElementById('resultDescription').textContent = rating.description;
        
        // 设置结果图标
        const resultIcon = document.getElementById('resultIcon');
        const percentage = (this.score / totalQuestions) * 100;
        
        if (percentage >= 90) {
            resultIcon.textContent = '🏆';
            resultIcon.className = 'result-icon result-icon-success';
        } else if (percentage >= 75) {
            resultIcon.textContent = '🎉';
            resultIcon.className = 'result-icon result-icon-good';
        } else if (percentage >= 60) {
            resultIcon.textContent = '👍';
            resultIcon.className = 'result-icon result-icon-average';
        } else {
            resultIcon.textContent = '😅';
            resultIcon.className = 'result-icon result-icon-poor';
        }
        
        // 添加结果页面动画
        document.querySelector('.result-content').classList.add('result-enter');
        
        // 如果得分很高，添加庆祝效果
        if (percentage >= 90) {
            this.addCelebrationEffect();
        }
    }

    // 添加庆祝效果
    addCelebrationEffect() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 2 + 's';
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 50);
        }
    }

    // 重试问答
    retryQuiz() {
        this.startQuiz(this.currentTopic);
    }

    // 重置问答状态
    resetQuiz() {
        this.currentTopic = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.questions = [];
        this.userAnswers = [];
    }

    // 添加粒子效果
    addParticleEffect() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 8 + 's';
                document.querySelector('.background-animation').appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 8000);
            }, i * 200);
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    const app = new QuizApp();
    
    // 添加一些交互效果
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('topic-card-hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('topic-card-hover');
        });
    });
    
    // 添加按钮点击效果
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            e.target.classList.add('button-click');
            setTimeout(() => {
                e.target.classList.remove('button-click');
            }, 200);
        }
    });
    
    // 定期添加粒子效果
    setInterval(() => {
        app.addParticleEffect();
    }, 10000);
});