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
        console.log('灯谜游戏初始化完成');
    }

    initializeElements() {
        this.lanterns = document.querySelectorAll('.lantern');
        this.tangyuanBowl = document.querySelector('.tangyuan-bowl');
        
        // 校验元素是否存在
        if (this.lanterns.length === 0) {
            console.error('未找到灯笼元素，请检查DOM结构');
            throw new Error('缺少核心元素：lantern');
        }
        if (!this.tangyuanBowl) {
            console.error('未找到汤圆碗元素，请检查DOM结构');
            throw new Error('缺少核心元素：tangyuan-bowl');
        }
        
        console.log(`找到 ${this.lanterns.length} 个灯笼元素`);
    }

    addEventListeners() {
        // 为每个灯笼添加点击事件
        this.lanterns.forEach((lantern, index) => {
            lantern.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLanternClick(e);
            });
            
            // 鼠标悬停/离开事件
            lantern.addEventListener('mouseenter', () => this.handleLanternHover());
            lantern.addEventListener('mouseleave', () => this.handleLanternLeave());
            
            // 移动端触摸事件
            lantern.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleLanternClick({ currentTarget: lantern });
            });
        });

        // 汤圆碗点击事件
        this.tangyuanBowl.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleTangyuanClick();
        });
        
        // 移动端触摸事件
        this.tangyuanBowl.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTangyuanClick();
        });
    }

    handleLanternClick(event) {
        console.log('灯笼被点击，显示灯谜');
        
        // 清除之前的隐藏定时器
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        // 保存当前灯谜为上一个灯谜
        if (this.currentRiddle) {
            this.lastRiddle = this.currentRiddle;
        }

        // 随机选择一个灯谜（避免重复）
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * riddles.length);
        } while (riddles[randomIndex] === this.currentRiddle && riddles.length > 1);
        
        this.currentRiddle = riddles[randomIndex];
        this.isRiddleVisible = true;

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
        console.log('汤圆碗被点击，显示谜底');
        
        if (this.currentRiddle && this.isRiddleVisible) {
            // 显示当前灯谜的谜底
            this.showAnswer(this.currentRiddle.answer);
        } else if (this.lastRiddle) {
            // 显示上一个灯谜的谜底
            this.showAnswer(this.lastRiddle.answer);
        } else {
            // 没有灯谜可显示
            alert('🎈 请先点击灯笼获取灯谜！');
        }
    }

    showRiddle(lantern, question) {
        // 移除之前的谜面
        this.hideRiddle();

        // 创建谜面显示元素
        const riddleDisplay = document.createElement('div');
        riddleDisplay.className = 'riddle-display';
        riddleDisplay.innerHTML = `<div class="riddle-content">🏮 ${question} 🏮</div>`;

        // 将谜面添加到灯笼中
        lantern.appendChild(riddleDisplay);
    }

    hideRiddle() {
        const riddleDisplay = document.querySelector('.riddle-display');
        if (riddleDisplay) {
            riddleDisplay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                riddleDisplay.remove();
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

        // 5秒后自动隐藏谜底
        setTimeout(() => {
            answerDisplay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                answerDisplay.remove();
            }, 300);
        }, 5000);
    }
}

// 确保DOM完全加载后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，开始初始化灯谜游戏');
    try {
        new LanternRiddle();
    } catch (error) {
        console.error('游戏初始化失败:', error);
        alert(`游戏加载出错：${error.message}，请刷新页面重试`);
    }
});

// 兜底：页面完全加载后再检查
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!document.querySelector('.riddle-display') && !document.querySelector('.answer-display')) {
            console.log('备用初始化：尝试重新初始化游戏');
            try {
                new LanternRiddle();
            } catch (error) {
                console.error('备用初始化也失败:', error);
            }
        }
    }, 500);
});
