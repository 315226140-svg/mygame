class SimonGame {
    constructor() {
        this.colors = ['golden', 'jade', 'ruby', 'purple'];
        this.sequence = [];
        this.playerSequence = [];
        this.score = 0;
        this.highScore = localStorage.getItem('simonHighScore') || 0;
        this.isGameActive = false;
        this.isPlayerTurn = false;

        this.initializeElements();
        this.displayHighScore();
        this.addEventListeners();
    }

    initializeElements() {
        this.buttons = document.querySelectorAll('.color-button');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.messageElement = document.getElementById('message');
    }

    addEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());

        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => this.handlePlayerInput(e));
        });
    }

    startGame() {
        if (this.isGameActive) return;

        this.isGameActive = true;
        this.sequence = [];
        this.playerSequence = [];
        this.score = 0;
        this.updateScore();
        this.messageElement.textContent = '元宵游戏开始！请观察序列...';

        this.addToSequence();
    }

    resetGame() {
        this.isGameActive = false;
        this.isPlayerTurn = false;
        this.sequence = [];
        this.playerSequence = [];
        this.score = 0;
        this.updateScore();
        this.messageElement.textContent = '元宵游戏已重置';
    }

    addToSequence() {
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.sequence.push(randomColor);
        this.playerSequence = [];
        this.isPlayerTurn = false;

        setTimeout(() => {
            this.playSequence();
        }, 1000);
    }

    async playSequence() {
        this.messageElement.textContent = '请观察宫灯序列...';

        for (let i = 0; i < this.sequence.length; i++) {
            await this.flashButton(this.sequence[i]);
            await this.delay(300);
        }

        this.isPlayerTurn = true;
        this.messageElement.textContent = '轮到你了！元宵好运！';
    }

    flashButton(color) {
        return new Promise(resolve => {
            const button = document.querySelector(`[data-color="${color}"]`);
            button.classList.add('active');
            this.playSound(color);

            setTimeout(() => {
                button.classList.remove('active');
                setTimeout(resolve, 300);
            }, 500);
        });
    }

    playSound(color) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        const frequencies = {
            golden: 261.63,
            jade: 329.63,
            ruby: 392.00,
            purple: 523.25
        };

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequencies[color];
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    handlePlayerInput(event) {
        if (!this.isGameActive || !this.isPlayerTurn) return;

        const clickedColor = event.target.dataset.color;
        this.flashButton(clickedColor);

        const currentIndex = this.playerSequence.length;
        this.playerSequence.push(clickedColor);

        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            this.gameOver();
            return;
        }

        if (this.playerSequence.length === this.sequence.length) {
            this.score++;
            this.updateScore();
            this.messageElement.textContent = '元宵好记性！准备下一轮...';
            this.isPlayerTurn = false;

            setTimeout(() => {
                this.addToSequence();
            }, 1500);
        }
    }

    gameOver() {
        this.isGameActive = false;
        this.isPlayerTurn = false;
        this.messageElement.textContent = `元宵游戏结束！你的分数是 ${this.score}`;

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('simonHighScore', this.highScore);
            this.displayHighScore();
            this.messageElement.textContent = `元宵新纪录！你的分数是 ${this.score}，团团圆圆！`;
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    displayHighScore() {
        this.highScoreElement.textContent = this.highScore;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 灯谜数据
const riddles = [
    { question: "一口咬掉牛尾巴", answer: "告" },
    { question: "一点一横长，一撇到南洋，南洋有个人，只有一寸长", answer: "府" },
    { question: "四面都是山，山山皆相连", answer: "田" },
    { question: "千里相逢", answer: "重" },
    { question: "一点一横长，口字在中央，大口不封口，小口里面藏", answer: "高" },
    { question: "两人土上谈心", answer: "坐" },
    { question: "十个哥哥", answer: "克" },
    { question: "七十二小时", answer: "晶" },
    { question: "需要一半，留下一半", answer: "雷" },
    { question: "一月一日非今天", answer: "明" },
    { question: "十五天", answer: "胖" },
    { question: "种瓜得瓜", answer: "长" },
    { question: "守门员", answer: "闪" },
    { question: "一口吃掉牛尾巴", answer: "告" },
    { question: "皇帝新衣", answer: "袭" },
    { question: "格外大方", answer: "回" },
    { question: "七十二小时", answer: "晶" },
    { question: "需要一半，留下一半", answer: "雷" },
    { question: "一月一日非今天", answer: "明" },
    { question: "十五天", answer: "胖" },
    { question: "种瓜得瓜", answer: "长" },
    { question: "守门员", answer: "闪" },
    { question: "皇帝新衣", answer: "袭" },
    { question: "格外大方", answer: "回" },
    { question: "半青半紫", answer: "素" },
    { question: "半甜半辣", answer: "辞" }
];

// 灯谜类
class LanternRiddle {
    constructor() {
        this.currentRiddle = null;
        this.lastRiddle = null;
        this.hideTimeout = null;
        this.isRiddleVisible = false;
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.lanterns = document.querySelectorAll('.lantern');
        this.tangyuanBowl = document.querySelector('.tangyuan-bowl');
        console.log('找到灯笼数量:', this.lanterns.length);
        console.log('找到汤圆碗:', this.tangyuanBowl);
    }

    addEventListeners() {
        // 为每个灯笼添加点击事件
        this.lanterns.forEach((lantern, index) => {
            console.log(`为灯笼 ${index} 添加事件监听器`);
            lantern.addEventListener('click', (e) => {
                console.log('灯笼被点击了！', e.target);
                this.handleLanternClick(e);
            });
            lantern.addEventListener('mouseenter', () => this.handleLanternHover());
            lantern.addEventListener('mouseleave', () => this.handleLanternLeave());
        });

        // 为汤圆碗添加点击事件
        if (this.tangyuanBowl) {
            this.tangyuanBowl.addEventListener('click', () => this.handleTangyuanClick());
        }
    }

    handleLanternClick(event) {
        console.log('handleLanternClick 被调用');
        // 清除之前的隐藏定时器
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        // 保存当前灯谜为上一个灯谜
        if (this.currentRiddle) {
            this.lastRiddle = this.currentRiddle;
        }

        // 随机选择一个灯谜
        const randomIndex = Math.floor(Math.random() * riddles.length);
        this.currentRiddle = riddles[randomIndex];
        this.isRiddleVisible = true;

        console.log('选择的灯谜:', this.currentRiddle);

        // 显示灯谜
        this.showRiddle(event.currentTarget, this.currentRiddle.question);
    }

    handleLanternHover() {
        // 清除隐藏定时器，保持灯谜显示
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    handleLanternLeave() {
        // 10秒后隐藏灯谜
        if (this.isRiddleVisible) {
            this.hideTimeout = setTimeout(() => {
                this.hideRiddle();
                this.isRiddleVisible = false;
            }, 10000);
        }
    }

    handleTangyuanClick() {
        if (this.currentRiddle && this.isRiddleVisible) {
            // 如果当前灯谜显示，显示当前灯谜的谜底
            this.showAnswer(this.currentRiddle.answer);
        } else if (this.lastRiddle) {
            // 如果灯谜已消失，显示上一个灯谜的谜底
            this.showAnswer(this.lastRiddle.answer);
        } else {
            // 没有灯谜可显示
            alert('请先点击灯笼获取灯谜！');
        }
    }

    showRiddle(lantern, question) {
        // 移除之前的谜面
        const existingRiddle = document.querySelector('.riddle-display');
        if (existingRiddle) {
            existingRiddle.remove();
        }

        // 创建谜面显示元素
        const riddleDisplay = document.createElement('div');
        riddleDisplay.className = 'riddle-display';
        riddleDisplay.innerHTML = `<div class="riddle-content">🏮 ${question} 🏮</div>`;

        // 将谜面添加到灯笼容器中
        lantern.appendChild(riddleDisplay);

        // 添加显示动画
        riddleDisplay.style.animation = 'fadeIn 0.3s ease-in';
    }

    hideRiddle() {
        const riddleDisplay = document.querySelector('.riddle-display');
        if (riddleDisplay) {
            riddleDisplay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (riddleDisplay.parentNode) {
                    riddleDisplay.remove();
                }
            }, 300);
        }
    }

    showAnswer(answer) {
        // 移除之前的谜底
        const existingAnswer = document.querySelector('.answer-display');
        if (existingAnswer) {
            existingAnswer.remove();
        }

        // 创建谜底显示元素
        const answerDisplay = document.createElement('div');
        answerDisplay.className = 'answer-display';
        answerDisplay.innerHTML = `<div class="answer-content">🎯 谜底：${answer} 🎯</div>`;

        // 将谜底添加到汤圆碗中
        this.tangyuanBowl.appendChild(answerDisplay);

        // 添加显示动画
        answerDisplay.style.animation = 'fadeIn 0.3s ease-in';

        // 5秒后自动隐藏谜底
        setTimeout(() => {
            answerDisplay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (answerDisplay.parentNode) {
                    answerDisplay.remove();
                }
            }, 300);
        }, 5000);
    }
}

// 初始化灯谜游戏
console.log('JavaScript文件已加载');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM已加载完成');
    new LanternRiddle();
    console.log('元宵猜灯谜已初始化');
});
