// 드래곤볼 Z 게임 - 새 움직임 수정 버전
class DragonBallZGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scenes = [];
        this.currentSceneIndex = 0;
        this.isPlaying = false;
        this.lastTime = 0;
        this.camera = { x: 0, y: 0, zoom: 1, shake: 0 };
        this.characters = [];
        this.particles = [];
        this.dialogue = [];
        this.currentDialogueIndex = 0;
        this.isDialogueActive = false;
        this.isLoading = true;
        this.loadProgress = 0;
        this.bgm = document.getElementById('bgm');
        this.isBGMPlaying = false;
        this.loadingInterval = null;
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createScenes();
        this.setupEventListeners();
        this.setupBGM();
        this.startLoading();
    }

    setupCanvas() {
        const resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleClick(e);
        });
    }

    setupBGM() {
        // BGM 자동 재생 시도 (볼륨 아주 작게 설정)
        const playBGM = () => {
            if (!this.isBGMPlaying) {
                this.bgm.volume = 0.1; // 볼륨 아주 작게 (10%)
                this.bgm.loop = true;
                this.bgm.play().then(() => {
                    this.isBGMPlaying = true;
                }).catch(error => {
                    console.log('BGM 재생 실패:', error);
                });
            }
        };

        // 사용자 상호작용 시 BGM 재생
        document.addEventListener('click', playBGM);
        document.addEventListener('touchstart', playBGM);
    }

    startLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.querySelector('.loading-progress');
        
        if (!loadingScreen || !loadingProgress) {
            console.error('로딩 요소를 찾을 수 없습니다');
            this.isLoading = false;
            this.start();
            return;
        }
        
        loadingScreen.style.display = 'flex';
        this.loadProgress = 0;
        loadingProgress.style.width = '0%';
        
        this.loadingInterval = setInterval(() => {
            this.loadProgress += 0.05;
            loadingProgress.style.width = `${this.loadProgress * 100}%`;
            
            if (this.loadProgress >= 1) {
                clearInterval(this.loadingInterval);
                setTimeout(() => {
                    this.isLoading = false;
                    loadingScreen.style.display = 'none';
                    this.start();
                }, 500);
            }
        }, 100);
    }

    start() {
        this.isPlaying = true;
        this.loadScene(0);
        this.gameLoop();
        
        // 게임 시작 시 BGM 재생 시도
        if (!this.isBGMPlaying) {
            setTimeout(() => {
                this.bgm.play().then(() => {
                    this.isBGMPlaying = true;
                });
            }, 1000);
        }
    }

    createScenes() {
        // SCENE 1
        this.scenes.push({
            characters: [
                new Gohan(0, 0, 'defeated')
            ],
            camera: { x: 0, y: 0, zoom: 0.8 },
            duration: 1000,
            nextSceneTrigger: 'click'
        });

        // SCENE 2
        this.scenes.push({
            characters: [
                new Android16(0, 0, 'normal')
            ],
            camera: { x: 0, y: 0, zoom: 2 },
            dialogue: [
                { speaker: '안드로이드 16호', text: '내가 좋아했던', duration: 500 },
                { speaker: '안드로이드 16호', text: '자연과 동물들을…', duration: 600 },
                { speaker: '안드로이드 16호', text: '지.켜.주.거.라.', duration: 700 },
                { speaker: '안드로이드 16호', text: '부탁한다~', duration: 500 }
            ],
            duration: 1000,
            nextSceneTrigger: 'click'
        });

        // SCENE 3
        this.scenes.push({
            characters: [
                new Cell(40, 0, 'smirking'),
                new Android16(-40, 0, 'damaged')
            ],
            camera: { x: 0, y: 0, zoom: 1.2 },
            dialogue: [
                { speaker: '셀', text: '쓸데없는 참견이다.', duration: 500 },
                { speaker: '셀', text: '실패작 녀석.', duration: 500 }
            ],
            duration: 1000,
            nextSceneTrigger: 'click'
        });

        // SCENE 4
        this.scenes.push({
            characters: [
                new Gohan(0, 0, 'angry')
            ],
            camera: { x: 0, y: 0, zoom: 2.5 },
            duration: 1000,
            nextSceneTrigger: 'click'
        });

        // SCENE 5
        this.scenes.push({
            characters: [
                new Gohan(0, 0, 'determined')
            ],
            camera: { x: 0, y: 0, zoom: 2 },
            duration: 1000,
            nextSceneTrigger: 'click'
        });

        // SCENE 6
        this.scenes.push({
            characters: [
                new Gohan(0, 0, 'screaming')
            ],
            camera: { x: 0, y: 0, zoom: 1.5, shake: 0.5 },
            duration: 1000,
            nextSceneTrigger: 'click'
        });

        // SCENE 7
        this.scenes.push({
            characters: [
                new Goku(-50, 0, 'shocked'),
                new Piccolo(50, 0, 'surprised')
            ],
            camera: { x: 0, y: 0, zoom: 1 },
            dialogue: [
                { speaker: '화면 밖', text: '오반!!', duration: 500 }
            ],
            duration: 1000,
            nextSceneTrigger: 'click'
        });

        // SCENE 8
        this.scenes.push({
            characters: [
                new Gohan(0, 0, 'super_saiyan')
            ],
            camera: { x: 0, y: 0, zoom: 2 },
            dialogue: [
                { speaker: '내레이션', text: '드디어... 오반의 분노의 한계가 넘은 것인가?', duration: 700 }
            ],
            duration: 1000,
            nextSceneTrigger: 'click'
        });

        // SCENE 9
        this.scenes.push({
            characters: [
                new Gohan(0, 0, 'final')
            ],
            camera: { x: 0, y: 0, zoom: 1.8 },
            duration: 1000,
            nextSceneTrigger: 'click'
        });
    }

    loadScene(index) {
        if (index >= this.scenes.length) {
            this.showEnding();
            return;
        }

        this.currentSceneIndex = index;
        const scene = this.scenes[index];
        
        // 업데이트 UI
        const sceneNumberElement = document.getElementById('scene-number');
        if (sceneNumberElement) {
            sceneNumberElement.textContent = index + 1;
        }
        
        // 캐릭터 초기화
        this.characters = scene.characters;
        
        // 카메라 설정
        Object.assign(this.camera, scene.camera);
        
        // 대사 초기화
        this.dialogue = scene.dialogue || [];
        this.currentDialogueIndex = 0;
        
        // 씬 타이머 설정
        this.sceneTimer = scene.duration;
        this.sceneStartTime = Date.now();
        
        // 대사 시작
        if (this.dialogue.length > 0) {
            this.startDialogue();
        } else {
            this.hideDialogue();
        }
    }

    startDialogue() {
        if (this.currentDialogueIndex >= this.dialogue.length) {
            this.hideDialogue();
            return;
        }

        this.isDialogueActive = true;
        const dialogue = this.dialogue[this.currentDialogueIndex];
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            dialogueBox.classList.remove('hidden');
        }
        
        const speakerNameElement = document.getElementById('speaker-name');
        const dialogueTextElement = document.getElementById('dialogue-text');
        
        if (speakerNameElement) {
            speakerNameElement.textContent = dialogue.speaker;
        }
        if (dialogueTextElement) {
            dialogueTextElement.textContent = dialogue.text;
        }
        
        this.dialogueTimer = dialogue.duration;
        this.dialogueStartTime = Date.now();
    }

    nextDialogue() {
        this.currentDialogueIndex++;
        if (this.currentDialogueIndex < this.dialogue.length) {
            this.startDialogue();
        } else {
            this.hideDialogue();
        }
    }

    hideDialogue() {
        this.isDialogueActive = false;
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            dialogueBox.classList.add('hidden');
        }
    }

    handleClick(e) {
        if (this.isLoading) return;

        if (this.isDialogueActive) {
            // 대사가 진행 중이면 다음 대사로
            this.nextDialogue();
        } else {
            // 대사가 없으면 바로 다음 씬으로
            this.loadScene(this.currentSceneIndex + 1);
        }
    }

    update() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // 카메라 흔들림 업데이트
        if (this.camera.shake > 0) {
            this.camera.shake *= 0.9;
            if (this.camera.shake < 0.01) this.camera.shake = 0;
        }

        // 캐릭터 업데이트
        this.characters.forEach(char => char.update(deltaTime));

        // 파티클 업데이트
        this.particles = this.particles.filter(p => {
            p.update(deltaTime);
            return p.life > 0;
        });

        // 장면별 특수 효과
        this.updateSceneEffects();
    }

    updateSceneEffects() {
        const sceneIndex = this.currentSceneIndex;
        
        switch(sceneIndex) {
            case 3: // SCENE 4: 오반의 눈, 세계의 균열
                // 눈물 생성
                if (Math.random() < 0.02) {
                    const gohan = this.characters[0];
                    this.particles.push(new Particle(gohan.x, gohan.y - 20, 'tear'));
                }
                break;
                
            case 5: // SCENE 6: 폭발
                // 에너지 파티클 생성
                if (Math.random() < 0.3) {
                    const gohan = this.characters[0];
                    this.particles.push(new Particle(
                        gohan.x + (Math.random() - 0.5) * 50,
                        gohan.y + (Math.random() - 0.5) * 50,
                        'energy'
                    ));
                }
                break;
                
            case 7: // SCENE 8: 새로운 얼굴
                // 번개 효과
                if (Math.random() < 0.1) {
                    const gohan = this.characters[0];
                    this.particles.push(new Particle(
                        gohan.x + (Math.random() - 0.5) * 100,
                        gohan.y - 50,
                        'lightning'
                    ));
                }
                break;
        }
    }

    drawBackground() {
        const ctx = this.ctx;
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        const sceneIndex = this.currentSceneIndex;

        switch(sceneIndex) {
            case 0: // SCENE 1: 붕괴된 경기장
                const gradient1 = ctx.createLinearGradient(0, 0, 0, h);
                gradient1.addColorStop(0, '#1a1a2e');
                gradient1.addColorStop(1, '#16213e');
                ctx.fillStyle = gradient1;
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = '#2c3e50';
                ctx.fillRect(0, h * 0.6, w, h * 0.4);

                ctx.strokeStyle = '#34495e';
                ctx.lineWidth = 3;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const x = w * (0.2 + i * 0.15);
                    ctx.moveTo(x, h * 0.65);
                    ctx.lineTo(x + w * 0.05, h * 0.7);
                    ctx.lineTo(x + w * 0.1, h * 0.63);
                }
                ctx.stroke();
                break;

            case 1: // SCENE 2: 잔디밭
                const gradient2 = ctx.createLinearGradient(0, 0, 0, h * 0.6);
                gradient2.addColorStop(0, '#87CEEB');
                gradient2.addColorStop(1, '#4682B4');
                ctx.fillStyle = gradient2;
                ctx.fillRect(0, 0, w, h * 0.6);

                ctx.fillStyle = '#2E8B57';
                ctx.fillRect(0, h * 0.6, w, h * 0.4);

                ctx.fillStyle = '#3CB371';
                for (let i = 0; i < 30; i++) {
                    const x = Math.random() * w;
                    const height = 10 + Math.random() * 20;
                    ctx.fillRect(x, h * 0.6 - height, 2, height);
                }
                break;

            case 4: // SCENE 5: 침묵
            case 5: // SCENE 6: 폭발
                const gradient3 = ctx.createLinearGradient(0, 0, 0, h);
                gradient3.addColorStop(0, '#8B0000');
                gradient3.addColorStop(0.5, '#B22222');
                gradient3.addColorStop(1, '#8B0000');
                ctx.fillStyle = gradient3;
                ctx.fillRect(0, 0, w, h);
                break;

            case 7: // SCENE 8: 새로운 얼굴
                const gradient4 = ctx.createLinearGradient(0, 0, 0, h);
                gradient4.addColorStop(0, '#0f0c29');
                gradient4.addColorStop(0.5, '#302b63');
                gradient4.addColorStop(1, '#24243e');
                ctx.fillStyle = gradient4;
                ctx.fillRect(0, 0, w, h);
                break;

            case 8: // SCENE 9: 최종
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, w, h);
                break;

            default:
                ctx.fillStyle = '#1C2833';
                ctx.fillRect(0, 0, w, h);
        }
    }

    render() {
        if (!this.ctx || !this.isPlaying) return;
        
        const ctx = this.ctx;
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        this.drawBackground();

        ctx.save();
        
        const shakeX = this.camera.shake > 0 ? (Math.random() - 0.5) * this.camera.shake * 20 : 0;
        const shakeY = this.camera.shake > 0 ? (Math.random() - 0.5) * this.camera.shake * 20 : 0;
        
        ctx.translate(w / 2 + shakeX, h / 2 + shakeY);
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.translate(-this.camera.x, -this.camera.y);

        this.particles.forEach(p => p.draw(ctx));

        this.characters.forEach(char => char.draw(ctx));

        ctx.restore();

        this.renderSceneEffects();
    }

    renderSceneEffects() {
        const sceneIndex = this.currentSceneIndex;
        const ctx = this.ctx;
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        switch(sceneIndex) {
            case 3: // SCENE 4: 비둘기 효과
                this.drawDove();
                break;
                
            case 5: // SCENE 6: 지면 갈라짐
                this.drawGroundCrack();
                break;
        }
    }

    drawDove() {
        const ctx = this.ctx;
        const time = Date.now() * 0.001;
        
        // 왼쪽에서 오른쪽으로 움직이는 새
        const progress = (time * 0.3) % 1; // 0에서 1까지 반복
        const x = -ctx.canvas.width * 0.3 + progress * (ctx.canvas.width * 1.6); // 왼쪽(-30%)에서 오른쪽(+130%)으로
        const y = ctx.canvas.height * 0.3 + Math.sin(time * 2) * 10; // 약간의 상하 움직임

        ctx.save();
        ctx.translate(x, y);

        // 새 몸통
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // 날개 (펄럭이는 효과)
        const wingFlap = Math.sin(time * 8) * 0.3;
        ctx.beginPath();
        ctx.ellipse(-12, -3, 12, 6, wingFlap, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(12, -3, 12, 6, -wingFlap, 0, Math.PI * 2);
        ctx.fill();

        // 머리
        ctx.beginPath();
        ctx.arc(0, -8, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawGroundCrack() {
        const ctx = this.ctx;
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height * 0.7;

        ctx.strokeStyle = 'rgba(139, 0, 0, 0.8)';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(centerX - 150, centerY);
        for (let i = 0; i < 15; i++) {
            const x = centerX - 150 + i * 20 + (Math.random() - 0.5) * 15;
            const y = centerY + i * 3 + (Math.random() - 0.5) * 8;
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        for (let j = 0; j < 3; j++) {
            ctx.beginPath();
            const startX = centerX - 100 + j * 50;
            const startY = centerY + 10;
            ctx.moveTo(startX, startY);
            for (let i = 0; i < 8; i++) {
                const x = startX + i * 10 + (Math.random() - 0.5) * 8;
                const y = startY + i * 5 + (Math.random() - 0.5) * 6;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }

    gameLoop() {
        if (!this.isPlaying) return;
        
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    showEnding() {
        this.isPlaying = false;
        const ctx = this.ctx;
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#8A2BE2';
        ctx.font = 'bold 48px Noto Sans KR';
        ctx.textAlign = 'center';
        ctx.fillText('THE END', w / 2, h / 2 - 30);

        ctx.fillStyle = '#FFD700';
        ctx.font = '24px Noto Sans KR';
        ctx.fillText('터치하여 다시 시작', w / 2, h / 2 + 30);

        const restart = () => {
            this.canvas.removeEventListener('click', restart);
            this.canvas.removeEventListener('touchstart', restart);
            this.currentSceneIndex = 0;
            this.isPlaying = true;
            this.loadScene(0);
            this.gameLoop();
        };

        this.canvas.addEventListener('click', restart);
        this.canvas.addEventListener('touchstart', restart);
    }
}

// 나머지 클래스들은 이전과 동일하게 유지
class Character {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.scale = 1;
        this.opacity = 1;
        this.state = 'normal';
        this.animationTime = 0;
    }

    update(deltaTime) {
        this.animationTime += deltaTime;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = this.opacity;
        this.drawCharacter(ctx);
        ctx.restore();
    }

    drawCharacter(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(-20, -20, 40, 40);
    }
}

class Gohan extends Character {
    constructor(x, y, state = 'normal') {
        super(x, y);
        this.state = state;
        this.hairColor = '#000000';
        this.skinColor = '#FFD7B5';
        this.giColor = '#8A2BE2';
        this.beltColor = '#0000CD';
        this.aura = { active: false, intensity: 0, color: '#FFD700' };
        this.expression = {
            eyebrows: 'normal',
            eyes: 'normal',
            mouth: 'normal',
            tear: false
        };
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        switch(this.state) {
            case 'defeated':
                this.expression = { eyebrows: 'sad', eyes: 'down', mouth: 'frown', tear: false };
                this.scale = 0.9 + Math.sin(this.animationTime * 0.002) * 0.05;
                break;
                
            case 'angry':
                this.expression = { eyebrows: 'angry', eyes: 'angry', mouth: 'grit', tear: true };
                this.aura.active = true;
                this.aura.intensity = 0.5;
                this.scale = 1;
                break;
                
            case 'determined':
                this.expression = { eyebrows: 'angry', eyes: 'determined', mouth: 'grit', tear: true };
                this.aura.active = true;
                this.aura.intensity = 0.8;
                this.scale = 1;
                break;
                
            case 'screaming':
                this.expression = { eyebrows: 'angry', eyes: 'wide', mouth: 'scream', tear: false };
                this.aura.active = true;
                this.aura.intensity = 1.5;
                this.scale = 1;
                break;
                
            case 'super_saiyan':
                this.expression = { eyebrows: 'angry', eyes: 'focused', mouth: 'grit', tear: false };
                this.hairColor = '#FFD700';
                this.aura.active = true;
                this.aura.intensity = 2;
                this.scale = 1.2;
                break;
                
            case 'final':
                this.expression = { eyebrows: 'angry', eyes: 'focused', mouth: 'grit', tear: false };
                this.hairColor = '#FFD700';
                this.aura.active = true;
                this.aura.intensity = 2.5;
                this.scale = 2.0;
                break;
        }
    }

    drawCharacter(ctx) {
        if (this.aura.active) {
            const gradient = ctx.createRadialGradient(0, 0, 20 * this.scale, 0, 0, (60 + this.aura.intensity * 40) * this.scale);
            gradient.addColorStop(0, `rgba(255, 215, 0, ${0.3 + this.aura.intensity * 0.2})`);
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, (60 + this.aura.intensity * 40) * this.scale, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = this.hairColor;
        ctx.beginPath();
        ctx.moveTo(0, -50);
        ctx.lineTo(-20, -65);
        ctx.lineTo(-15, -80);
        ctx.lineTo(15, -80);
        ctx.lineTo(20, -65);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(-25, -45);
        ctx.lineTo(-35, -60);
        ctx.lineTo(-30, -70);
        ctx.lineTo(-15, -55);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(25, -45);
        ctx.lineTo(35, -60);
        ctx.lineTo(30, -70);
        ctx.lineTo(15, -55);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = this.skinColor;
        ctx.beginPath();
        ctx.moveTo(-20, -40);
        ctx.lineTo(-25, -20);
        ctx.lineTo(-20, 0);
        ctx.lineTo(20, 0);
        ctx.lineTo(25, -20);
        ctx.lineTo(20, -40);
        ctx.closePath();
        ctx.fill();

        this.drawEyes(ctx);
        
        this.drawMouth(ctx);
        
        if (this.expression.tear) {
            ctx.fillStyle = 'rgba(100, 150, 255, 0.8)';
            ctx.beginPath();
            ctx.ellipse(-12, -25, 1.5, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.ellipse(12, -25, 1.5, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = this.giColor;
        ctx.fillRect(-25, 0, 50, 40);
        
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(0, 15);
        ctx.lineTo(15, 0);
        ctx.fill();
        
        ctx.fillStyle = this.skinColor;
        ctx.fillRect(-35, 10, 10, 25);
        ctx.fillRect(25, 10, 10, 25);
        
        ctx.fillStyle = this.beltColor;
        ctx.fillRect(-30, 35, 60, 8);
    }

    drawEyes(ctx) {
        const eyes = this.expression.eyes;
        let eyeHeight, pupilSize;
        
        switch(eyes) {
            case 'down':
                eyeHeight = 6;
                pupilSize = 4;
                break;
            case 'angry':
                eyeHeight = 4;
                pupilSize = 3;
                break;
            case 'wide':
                eyeHeight = 12;
                pupilSize = 8;
                break;
            case 'focused':
                eyeHeight = 8;
                pupilSize = 5;
                break;
            default:
                eyeHeight = 8;
                pupilSize = 5;
        }

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(-15, -30, 10, eyeHeight, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(15, -30, 10, eyeHeight, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(-15, -30, pupilSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(15, -30, pupilSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        const eyebrows = this.expression.eyebrows;
        
        if (eyebrows === 'angry') {
            ctx.beginPath();
            ctx.moveTo(-25, -42);
            ctx.lineTo(-8, -38);
            ctx.lineTo(-10, -45);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(25, -42);
            ctx.lineTo(8, -38);
            ctx.lineTo(10, -45);
            ctx.closePath();
            ctx.fill();
        } else if (eyebrows === 'sad') {
            ctx.beginPath();
            ctx.moveTo(-25, -38);
            ctx.lineTo(-5, -42);
            ctx.lineTo(-8, -38);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(25, -38);
            ctx.lineTo(5, -42);
            ctx.lineTo(8, -38);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(-25, -40);
            ctx.lineTo(-5, -35);
            ctx.lineTo(-8, -40);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(25, -40);
            ctx.lineTo(5, -35);
            ctx.lineTo(8, -40);
            ctx.closePath();
            ctx.fill();
        }
    }

    drawMouth(ctx) {
        const mouth = this.expression.mouth;
        
        ctx.fillStyle = '#E8B4B4';
        
        switch(mouth) {
            case 'frown':
                ctx.beginPath();
                ctx.moveTo(-12, -15);
                ctx.quadraticCurveTo(0, -10, 12, -15);
                ctx.fill();
                break;
                
            case 'grit':
                ctx.beginPath();
                ctx.moveTo(-15, -10);
                ctx.lineTo(15, -10);
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#E8B4B4';
                ctx.stroke();
                break;
                
            case 'scream':
                ctx.beginPath();
                ctx.ellipse(0, -5, 15, 10, 0, 0, Math.PI);
                ctx.fill();
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.ellipse(0, -5, 12, 7, 0, 0, Math.PI);
                ctx.fill();
                break;
                
            default:
                ctx.beginPath();
                ctx.moveTo(-10, -10);
                ctx.quadraticCurveTo(0, -5, 10, -10);
                ctx.fill();
        }
    }
}

class Android16 extends Character {
    constructor(x, y, state = 'normal') {
        super(x, y);
        this.state = state;
        this.hairColor = '#CC0000';
        this.skinColor = '#FFD7B5';
        this.damage = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        if (this.state === 'damaged') {
            this.damage = Math.min(1, this.damage + deltaTime * 0.001);
        }
    }

    drawCharacter(ctx) {
        ctx.save();
        ctx.rotate(Math.PI / 6);
        
        ctx.fillStyle = this.skinColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = this.hairColor;
        ctx.beginPath();
        ctx.ellipse(0, -15, 25, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(-25, 0, 8, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(25, 0, 8, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(-12, -5, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(8, -5, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-3, 5);
        ctx.lineTo(3, 5);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-10, 10);
        ctx.lineTo(10, 10);
        ctx.stroke();
        
        if (this.damage > 0) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(15, -10);
            ctx.lineTo(20, 0);
            ctx.lineTo(15, 5);
            ctx.stroke();
            
            if (this.damage > 0.5) {
                ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
                ctx.lineWidth = 1;
                
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    const sparkX = 18 + Math.random() * 5;
                    const sparkY = -2 + Math.random() * 5;
                    ctx.moveTo(sparkX, sparkY);
                    ctx.lineTo(
                        sparkX + (Math.random() - 0.5) * 8,
                        sparkY + (Math.random() - 0.5) * 8
                    );
                    ctx.stroke();
                }
            }
        }
        
        ctx.restore();
    }
}

class Cell extends Character {
    constructor(x, y, state = 'normal') {
        super(x, y);
        this.state = state;
        this.armorColor = '#2E8B57';
        this.darkArmor = '#1E5B37';
        this.highlight = '#4CAF50';
        this.smile = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        if (this.state === 'smirking') {
            this.smile = 0.5 + Math.sin(this.animationTime * 0.003) * 0.3;
        }
    }

    drawCharacter(ctx) {
        ctx.fillStyle = this.armorColor;
        ctx.beginPath();
        ctx.moveTo(0, -50);
        ctx.lineTo(-25, -30);
        ctx.lineTo(-20, 0);
        ctx.lineTo(20, 0);
        ctx.lineTo(25, -30);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = this.highlight;
        ctx.beginPath();
        ctx.moveTo(0, -45);
        ctx.lineTo(-20, -25);
        ctx.lineTo(-15, 0);
        ctx.lineTo(15, 0);
        ctx.lineTo(20, -25);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(-12, -35, 6, 3, 0, 0, Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(12, -35, 6, 3, 0, 0, Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2.5;
        const smileY = -15 + this.smile * 10;
        ctx.beginPath();
        ctx.moveTo(-15, smileY);
        ctx.quadraticCurveTo(0, smileY + 5 + this.smile * 5, 
                           15, smileY - this.smile * 3);
        ctx.stroke();
        
        ctx.fillStyle = this.darkArmor;
        ctx.beginPath();
        ctx.moveTo(0, -50);
        ctx.lineTo(-5, -65);
        ctx.lineTo(5, -65);
        ctx.closePath();
        ctx.fill();
    }
}

class Goku extends Character {
    constructor(x, y, state = 'normal') {
        super(x, y);
        this.state = state;
    }

    drawCharacter(ctx) {
        ctx.fillStyle = '#000000';
        this.drawSpikyHair(ctx, 5, 25, -35);
        
        ctx.fillStyle = '#FFD7B5';
        ctx.beginPath();
        ctx.arc(0, -20, 18, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(-8, -25, 7, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(8, -25, 7, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(-8, -25, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(8, -25, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -10, 6, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#FF6600';
        ctx.fillRect(-15, 0, 30, 25);
    }

    drawSpikyHair(ctx, spikes, length, yOffset) {
        for (let i = 0; i < spikes; i++) {
            const angle = (i / spikes) * Math.PI * 2;
            const spikeLength = length * (0.8 + Math.random() * 0.4);
            
            ctx.beginPath();
            ctx.moveTo(0, yOffset);
            ctx.lineTo(
                Math.cos(angle) * spikeLength,
                yOffset + Math.sin(angle) * spikeLength
            );
            ctx.lineTo(
                Math.cos(angle + 0.2) * (spikeLength * 0.6),
                yOffset + Math.sin(angle + 0.2) * (spikeLength * 0.6)
            );
            ctx.closePath();
            ctx.fill();
        }
    }
}

class Piccolo extends Character {
    constructor(x, y, state = 'normal') {
        super(x, y);
        this.state = state;
    }

    drawCharacter(ctx) {
        ctx.fillStyle = '#2E8B57';
        ctx.beginPath();
        ctx.ellipse(0, -25, 15, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#1E5B37';
        ctx.beginPath();
        ctx.moveTo(0, -45);
        ctx.lineTo(-5, -55);
        ctx.lineTo(0, -50);
        ctx.lineTo(5, -55);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(-6, -25, 4, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(6, -25, 4, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(-6, -25, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(6, -25, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#1E5B37';
        ctx.beginPath();
        ctx.moveTo(-10, -35);
        ctx.lineTo(-2, -32);
        ctx.lineTo(-4, -38);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(10, -35);
        ctx.lineTo(2, -32);
        ctx.lineTo(4, -38);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-10, -15);
        ctx.lineTo(10, -15);
        ctx.stroke();
    }
}

class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.life = 1.0;
        this.size = type === 'tear' ? 2 : 3 + Math.random() * 4;
        this.color = this.getColor();
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = type === 'tear' ? 2 : (Math.random() - 0.5) * 3;
        this.decay = type === 'tear' ? 0.02 : 0.01 + Math.random() * 0.02;
    }

    getColor() {
        switch(this.type) {
            case 'tear': return 'rgba(100, 150, 255, 0.8)';
            case 'energy': return 'rgba(255, 215, 0, 0.8)';
            case 'lightning': return 'rgba(100, 200, 255, 0.9)';
            default: return 'rgba(255, 255, 255, 0.8)';
        }
    }

    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        return this.life > 0;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        
        if (this.type === 'lightning') {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            for (let i = 0; i < 3; i++) {
                ctx.lineTo(
                    this.x + (Math.random() - 0.5) * 20,
                    this.y + (i + 1) * 10
                );
            }
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DragonBallZGame();
});
