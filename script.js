// 드래곤볼 Z 게임 - 캐릭터 선택 버전
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
        
        // 새로 추가: 현재 플레이 중인 스토리 (손오공 또는 손오반)
        this.currentStory = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
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
        // 캔버스 클릭 이벤트 (게임 진행용)
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleClick(e);
        });

        // 캐릭터 선택 이벤트 [citation:2]
        const selectGoku = document.getElementById('select-goku');
        const selectGohan = document.getElementById('select-gohan');
        
        if (selectGoku) {
            selectGoku.addEventListener('click', () => this.startGokuStory());
            selectGoku.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.startGokuStory();
            });
        }
        
        if (selectGohan) {
            selectGohan.addEventListener('click', () => this.startGohanStory());
            selectGohan.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.startGohanStory();
            });
        }
    }

    setupBGM() {
        this.bgm.src = 'assets/BGM.mp3';
        this.bgm.type = 'audio/mpeg';
        
        const playBGM = () => {
            if (!this.isBGMPlaying) {
                this.bgm.volume = 0.1;
                this.bgm.loop = true;
                this.bgm.load();
                this.bgm.play().then(() => {
                    this.isBGMPlaying = true;
                }).catch(error => {
                    console.log('BGM MP3 재생 실패:', error);
                });
            }
        };

        document.addEventListener('click', playBGM);
        document.addEventListener('touchstart', playBGM);
        window.addEventListener('load', playBGM);
    }

    startLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.querySelector('.loading-progress');
        
        if (!loadingScreen || !loadingProgress) {
            console.error('로딩 요소를 찾을 수 없습니다');
            this.isLoading = false;
            this.showCharacterSelect();
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
                    this.showCharacterSelect();
                }, 500);
            }
        }, 100);
    }

    showCharacterSelect() {
        const selectScreen = document.getElementById('character-select-screen');
        if (selectScreen) {
            selectScreen.classList.remove('hidden');
        }
        this.isPlaying = false;
    }

    hideCharacterSelect() {
        const selectScreen = document.getElementById('character-select-screen');
        if (selectScreen) {
            selectScreen.classList.add('hidden');
        }
    }

    startGokuStory() {
        this.hideCharacterSelect();
        this.currentStory = 'goku';
        this.createGokuScenes();
        this.start();
    }

    startGohanStory() {
        this.hideCharacterSelect();
        this.currentStory = 'gohan';
        this.createGohanScenes();
        this.start();
    }

    createGokuScenes() {
        this.scenes = [];
        
        // 손오공 각성 시나리오 (10개 씬)
        // SCENE 1: 평화로운 손오공
        this.scenes.push({
            characters: [
                new Goku(0, 0, 'normal')
            ],
            camera: { x: 0, y: 0, zoom: 1.5 },
            dialogue: [
                { speaker: '손오공', text: '오늘은 날씨도 좋고 트레이닝 하기 딱 좋은 날이야!', duration: 700 }
            ],
            duration: 1500,
            nextSceneTrigger: 'click'
        });

        // SCENE 2: 프리더의 등장
        this.scenes.push({
            characters: [
                new Frieza(40, 0, 'smirking'),
                new Goku(-40, 0, 'alert')
            ],
            camera: { x: 0, y: 0, zoom: 1.2 },
            dialogue: [
                { speaker: '프리더', text: '키이이... 사이어인 원숭이 놈!', duration: 600 },
                { speaker: '프리더', text: '네놈이 나의 계획을 방해했지!', duration: 600 }
            ],
            duration: 1500,
            nextSceneTrigger: 'click'
        });

        // SCENE 3: 전투 시작
        this.scenes.push({
            characters: [
                new Goku(0, 0, 'battling'),
                new Frieza(50, 0, 'attacking')
            ],
            camera: { x: 0, y: 0, zoom: 1, shake: 0.3 },
            dialogue: [
                { speaker: '손오공', text: '프리더... 너는 더 이상 악을 행할 수 없다!', duration: 700 }
            ],
            duration: 1200,
            nextSceneTrigger: 'click'
        });

        // SCENE 4: 크리링의 죽음 (추가 캐릭터 필요 시 구현)
        this.scenes.push({
            characters: [
                new Goku(0, 0, 'shocked')
            ],
            camera: { x: 0, y: 0, zoom: 2.5 },
            dialogue: [
                { speaker: '내레이션', text: '크리링이... 프리더에게...', duration: 800 },
                { speaker: '내레이션', text: '오공의 분노가 서서히 끓어오른다...', duration: 800 }
            ],
            duration: 1500,
            nextSceneTrigger: 'click'
        });

        // SCENE 5: 분노의 시작
        this.scenes.push({
            characters: [
                new Goku(0, 0, 'angry')
            ],
            camera: { x: 0, y: 0, zoom: 2, shake: 0.5 },
            dialogue: [
                { speaker: '손오공', text: '크... 크리링이...', duration: 600 },
                { speaker: '손오공', text: '으아아아아악!!!!', duration: 800 }
            ],
            duration: 1500,
            nextSceneTrigger: 'click'
        });

        // SCENE 6: 초사이어인 변신 시작
        this.scenes.push({
            characters: [
                new Goku(0, 0, 'transforming')
            ],
            camera: { x: 0, y: 0, zoom: 1.8, shake: 0.8 },
            dialogue: [
                { speaker: '내레이션', text: '오공의 기가 급격히 상승하기 시작한다!', duration: 700 },
                { speaker: '내레이션', text: '머리카락이 금빛으로 물들어간다...', duration: 700 }
            ],
            duration: 1500,
            nextSceneTrigger: 'click'
        });

        // SCENE 7: 초사이어인 변신 완료
        this.scenes.push({
            characters: [
                new Goku(0, 0, 'super_saiyan')
            ],
            camera: { x: 0, y: 0, zoom: 1.5, shake: 0.3 },
            dialogue: [
                { speaker: '프리더', text: '이... 이게 무슨 힘이지?!', duration: 600 },
                { speaker: '손오공', text: '이게 바로... 초사이어인이다!', duration: 700 }
            ],
            duration: 1500,
            nextSceneTrigger: 'click'
        });

        // SCENE 8: 새로운 힘
        this.scenes.push({
            characters: [
                new Goku(0, 0, 'powerful')
            ],
            camera: { x: 0, y: 0, zoom: 2 },
            dialogue: [
                { speaker: '내레이션', text: '전설의 초사이어인이 드디어 각성했다!', duration: 800 },
                { speaker: '내레이션', text: '우주의 운명이 이 순간 바뀐다...', duration: 800 }
            ],
            duration: 1500,
            nextSceneTrigger: 'click'
        });

        // SCENE 9: 최후의 일격
        this.scenes.push({
            characters: [
                new Goku(0, 0, 'final_attack'),
                new Frieza(60, 0, 'defeated')
            ],
            camera: { x: 0, y: 0, zoom: 1.2, shake: 0.5 },
            dialogue: [
                { speaker: '손오공', text: '이걸로 끝이다, 프리더!', duration: 600 }
            ],
            duration: 1500,
            nextSceneTrigger: 'click'
        });

        // SCENE 10: 승리와 각성 완료
        this.scenes.push({
            characters: [
                new Goku(0, 0, 'victory')
            ],
            camera: { x: 0, y: 0, zoom: 1.5 },
            dialogue: [
                { speaker: '내레이션', text: '초사이어인 손오공, 우주의 새로운 수호자가 되다.', duration: 1000 }
            ],
            duration: 2000,
            nextSceneTrigger: 'click'
        });
    }

    createGohanScenes() {
        // 기존 손오반 씬 9개 (원래 코드에서 가져옴)
        this.scenes = [];

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

    start() {
        this.isPlaying = true;
        this.currentSceneIndex = 0;
        this.loadScene(0);
        this.gameLoop();
        
        if (!this.isBGMPlaying) {
            setTimeout(() => {
                this.bgm.play().then(() => {
                    this.isBGMPlaying = true;
                }).catch(error => {
                    console.log('BGM 자동 재생 실패, 사용자 상호작용 필요:', error);
                });
            }, 1000);
        }
    }

    loadScene(index) {
        if (index >= this.scenes.length) {
            this.showEnding();
            return;
        }

        this.currentSceneIndex = index;
        const scene = this.scenes[index];
        
        // UI 업데이트
        const sceneNumberElement = document.getElementById('scene-number');
        const sceneTotalElement = document.getElementById('scene-total');
        if (sceneNumberElement) {
            sceneNumberElement.textContent = index + 1;
        }
        if (sceneTotalElement) {
            sceneTotalElement.textContent = this.scenes.length;
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
            this.nextDialogue();
        } else {
            this.loadScene(this.currentSceneIndex + 1);
        }
    }

    update() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        if (this.camera.shake > 0) {
            this.camera.shake *= 0.9;
            if (this.camera.shake < 0.01) this.camera.shake = 0;
        }

        this.characters.forEach(char => char.update(deltaTime));

        this.particles = this.particles.filter(p => {
            p.update(deltaTime);
            return p.life > 0;
        });

        this.updateSceneEffects();
    }

    updateSceneEffects() {
        const sceneIndex = this.currentSceneIndex;
        
        // 손오공 시나리오 효과
        if (this.currentStory === 'goku') {
            switch(sceneIndex) {
                case 5: // 변신 시작
                case 6: // 변신 완료
                    if (Math.random() < 0.4) {
                        const goku = this.characters[0];
                        this.particles.push(new Particle(
                            goku.x + (Math.random() - 0.5) * 80,
                            goku.y + (Math.random() - 0.5) * 80,
                            'gold_energy'
                        ));
                    }
                    break;
            }
        }
        // 손오반 시나리오 효과 (기존)
        else if (this.currentStory === 'gohan') {
            switch(sceneIndex) {
                case 3:
                    if (Math.random() < 0.02) {
                        const gohan = this.characters[0];
                        this.particles.push(new Particle(gohan.x, gohan.y - 20, 'tear'));
                    }
                    break;
                case 5:
                    if (Math.random() < 0.3) {
                        const gohan = this.characters[0];
                        this.particles.push(new Particle(
                            gohan.x + (Math.random() - 0.5) * 50,
                            gohan.y + (Math.random() - 0.5) * 50,
                            'energy'
                        ));
                    }
                    break;
                case 7:
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
    }

    drawBackground() {
        const ctx = this.ctx;
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        const sceneIndex = this.currentSceneIndex;

        // 손오공 시나리오 배경
        if (this.currentStory === 'goku') {
            switch(sceneIndex) {
                case 0: // 평화로운 나메크성
                    const gradient1 = ctx.createLinearGradient(0, 0, 0, h);
                    gradient1.addColorStop(0, '#0066cc');
                    gradient1.addColorStop(0.6, '#0099ff');
                    gradient1.addColorStop(1, '#003366');
                    ctx.fillStyle = gradient1;
                    ctx.fillRect(0, 0, w, h);
                    
                    ctx.fillStyle = '#00cc66';
                    ctx.fillRect(0, h * 0.7, w, h * 0.3);
                    break;
                    
                case 4: // 크리링의 죽음
                case 5: // 분노의 시작
                    const gradient2 = ctx.createLinearGradient(0, 0, 0, h);
                    gradient2.addColorStop(0, '#660000');
                    gradient2.addColorStop(0.5, '#990000');
                    gradient2.addColorStop(1, '#330000');
                    ctx.fillStyle = gradient2;
                    ctx.fillRect(0, 0, w, h);
                    break;
                    
                case 6: // 변신 시작
                case 7: // 변신 완료
                    const gradient3 = ctx.createLinearGradient(0, 0, 0, h);
                    gradient3.addColorStop(0, '#996600');
                    gradient3.addColorStop(0.5, '#ffcc00');
                    gradient3.addColorStop(1, '#663300');
                    ctx.fillStyle = gradient3;
                    ctx.fillRect(0, 0, w, h);
                    break;
                    
                case 9: // 승리
                    const gradient4 = ctx.createLinearGradient(0, 0, 0, h);
                    gradient4.addColorStop(0, '#ffcc00');
                    gradient4.addColorStop(0.5, '#ffffff');
                    gradient4.addColorStop(1, '#ffcc00');
                    ctx.fillStyle = gradient4;
                    ctx.fillRect(0, 0, w, h);
                    break;
                    
                default:
                    ctx.fillStyle = '#1C2833';
                    ctx.fillRect(0, 0, w, h);
            }
        }
        // 손오반 시나리오 배경 (기존)
        else if (this.currentStory === 'gohan') {
            switch(sceneIndex) {
                case 0:
                    const gradient1 = ctx.createLinearGradient(0, 0, 0, h);
                    gradient1.addColorStop(0, '#1a1a2e');
                    gradient1.addColorStop(1, '#16213e');
                    ctx.fillStyle = gradient1;
                    ctx.fillRect(0, 0, w, h);
                    break;
                case 1:
                    const gradient2 = ctx.createLinearGradient(0, 0, 0, h * 0.6);
                    gradient2.addColorStop(0, '#87CEEB');
                    gradient2.addColorStop(1, '#4682B4');
                    ctx.fillStyle = gradient2;
                    ctx.fillRect(0, 0, w, h * 0.6);
                    break;
                case 4:
                case 5:
                    const gradient3 = ctx.createLinearGradient(0, 0, 0, h);
                    gradient3.addColorStop(0, '#8B0000');
                    gradient3.addColorStop(0.5, '#B22222');
                    gradient3.addColorStop(1, '#8B0000');
                    ctx.fillStyle = gradient3;
                    ctx.fillRect(0, 0, w, h);
                    break;
                case 7:
                    const gradient4 = ctx.createLinearGradient(0, 0, 0, h);
                    gradient4.addColorStop(0, '#0f0c29');
                    gradient4.addColorStop(0.5, '#302b63');
                    gradient4.addColorStop(1, '#24243e');
                    ctx.fillStyle = gradient4;
                    ctx.fillRect(0, 0, w, h);
                    break;
                case 8:
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.fillRect(0, 0, w, h);
                    break;
                default:
                    ctx.fillStyle = '#1C2833';
                    ctx.fillRect(0, 0, w, h);
            }
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

        const storyName = this.currentStory === 'goku' ? '손오공 각성 완료!' : '손오반 각성 완료!';
        const color = this.currentStory === 'goku' ? '#FF9900' : '#8A2BE2';
        
        ctx.fillStyle = color;
        ctx.font = 'bold 48px Noto Sans KR';
        ctx.textAlign = 'center';
        ctx.fillText(storyName, w / 2, h / 2 - 50);

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 36px Noto Sans KR';
        ctx.fillText('THE END', w / 2, h / 2 + 10);

        ctx.font = '24px Noto Sans KR';
        ctx.fillText('터치하여 캐릭터 선택으로 돌아가기', w / 2, h / 2 + 60);

        const restart = () => {
            this.canvas.removeEventListener('click', restart);
            this.canvas.removeEventListener('touchstart', restart);
            this.showCharacterSelect();
        };

        this.canvas.addEventListener('click', restart);
        this.canvas.addEventListener('touchstart', restart);
    }
}

// ===== 캐릭터 클래스들 =====
// (기존 Character, Gohan, Android16, Cell, Goku, Piccolo 클래스는 그대로 유지)
// 아래는 손오공 시나리오에 필요한 추가/수정 클래스

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

// Goku 클래스 확장 (새로운 상태 추가)
class Goku extends Character {
    constructor(x, y, state = 'normal') {
        super(x, y);
        this.state = state;
        this.hairColor = '#000000';
        this.skinColor = '#FFD7B5';
        this.giColor = '#FF6600'; // 주황색 도복
        this.beltColor = '#0000CD';
        this.aura = { active: false, intensity: 0, color: '#FFD700' };
        this.expression = {
            eyebrows: 'normal',
            eyes: 'normal',
            mouth: 'normal'
        };
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        switch(this.state) {
            case 'normal':
                this.expression = { eyebrows: 'normal', eyes: 'normal', mouth: 'smile' };
                this.scale = 1;
                break;
                
            case 'alert':
                this.expression = { eyebrows: 'concerned', eyes: 'alert', mouth: 'neutral' };
                this.scale = 1;
                break;
                
            case 'battling':
                this.expression = { eyebrows: 'angry', eyes: 'focused', mouth: 'grit' };
                this.aura.active = true;
                this.aura.intensity = 0.5;
                this.scale = 1;
                break;
                
            case 'shocked':
                this.expression = { eyebrows: 'surprised', eyes: 'wide', mouth: 'open' };
                this.scale = 1;
                break;
                
            case 'angry':
                this.expression = { eyebrows: 'angry', eyes: 'angry', mouth: 'grit' };
                this.aura.active = true;
                this.aura.intensity = 0.8;
                this.scale = 1.1;
                break;
                
            case 'transforming':
                this.expression = { eyebrows: 'angry', eyes: 'closed', mouth: 'scream' };
                this.hairColor = '#FFD700';
                this.aura.active = true;
                this.aura.intensity = 1.5;
                this.scale = 1.2;
                // 변신 중 깜빡임 효과
                this.opacity = 0.7 + Math.sin(this.animationTime * 0.01) * 0.3;
                break;
                
            case 'super_saiyan':
                this.expression = { eyebrows: 'angry', eyes: 'focused', mouth: 'grit' };
                this.hairColor = '#FFD700';
                this.giColor = '#FF3300'; // 더 진한 주황색
                this.aura.active = true;
                this.aura.intensity = 2;
                this.scale = 1.3;
                this.opacity = 1;
                break;
                
            case 'powerful':
                this.expression = { eyebrows: 'confident', eyes: 'focused', mouth: 'smirk' };
                this.hairColor = '#FFD700';
                this.aura.active = true;
                this.aura.intensity = 2.5;
                this.scale = 1.4;
                break;
                
            case 'final_attack':
                this.expression = { eyebrows: 'angry', eyes: 'determined', mouth: 'scream' };
                this.hairColor = '#FFD700';
                this.aura.active = true;
                this.aura.intensity = 3;
                this.scale = 1.5;
                break;
                
            case 'victory':
                this.expression = { eyebrows: 'normal', eyes: 'confident', mouth: 'smile' };
                this.hairColor = '#FFD700';
                this.aura.active = true;
                this.aura.intensity = 1;
                this.scale = 1.2;
                break;
        }
    }

    drawCharacter(ctx) {
        if (this.aura.active) {
            const gradient = ctx.createRadialGradient(0, 0, 20 * this.scale, 0, 0, (60 + this.aura.intensity * 40) * this.scale);
            const auraColor = this.state === 'super_saiyan' || this.state === 'transforming' || 
                            this.state === 'powerful' || this.state === 'final_attack' || 
                            this.state === 'victory' ? '#FFD700' : '#00ccff';
            
            gradient.addColorStop(0, `rgba(255, 215, 0, ${0.3 + this.aura.intensity * 0.2})`);
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, (60 + this.aura.intensity * 40) * this.scale, 0, Math.PI * 2);
            ctx.fill();
        }

        // 머리카락 (상태에 따라 색상 변경)
        ctx.fillStyle = this.hairColor;
        this.drawSpikyHair(ctx, 7, 25, -35);
        
        // 얼굴
        ctx.fillStyle = this.skinColor;
        ctx.beginPath();
        ctx.arc(0, -20, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // 눈
        this.drawEyes(ctx);
        
        // 입
        this.drawMouth(ctx);
        
        // 도복 상의
        ctx.fillStyle = this.giColor;
        ctx.fillRect(-25, 0, 50, 40);
        
        // 도복 디테일
        ctx.fillStyle = '#CC3300';
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(0, 15);
        ctx.lineTo(15, 0);
        ctx.fill();
        
        // 팔
        ctx.fillStyle = this.skinColor;
        ctx.fillRect(-35, 10, 10, 25);
        ctx.fillRect(25, 10, 10, 25);
        
        // 벨트
        ctx.fillStyle = this.beltColor;
        ctx.fillRect(-30, 35, 60, 8);
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

    drawEyes(ctx) {
        const eyes = this.expression.eyes;
        let eyeHeight, pupilSize;
        
        switch(eyes) {
            case 'alert':
                eyeHeight = 6;
                pupilSize = 4;
                break;
            case 'wide':
                eyeHeight = 12;
                pupilSize = 8;
                break;
            case 'closed':
                eyeHeight = 0;
                pupilSize = 0;
                break;
            case 'focused':
                eyeHeight = 8;
                pupilSize = 5;
                break;
            case 'angry':
                eyeHeight = 4;
                pupilSize = 3;
                break;
            case 'determined':
                eyeHeight = 6;
                pupilSize = 4;
                break;
            case 'confident':
                eyeHeight = 8;
                pupilSize = 5;
                break;
            default:
                eyeHeight = 8;
                pupilSize = 5;
        }

        if (eyeHeight > 0) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.ellipse(-8, -25, 7, eyeHeight, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.ellipse(8, -25, 7, eyeHeight, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(-8, -25, pupilSize, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(8, -25, pupilSize, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // 눈을 감은 상태
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-15, -25);
            ctx.lineTo(-5, -25);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(5, -25);
            ctx.lineTo(15, -25);
            ctx.stroke();
        }

        // 눈썹
        ctx.fillStyle = 'black';
        const eyebrows = this.expression.eyebrows;
        
        if (eyebrows === 'angry') {
            ctx.beginPath();
            ctx.moveTo(-20, -35);
            ctx.lineTo(-5, -30);
            ctx.lineTo(-7, -35);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(20, -35);
            ctx.lineTo(5, -30);
            ctx.lineTo(7, -35);
            ctx.closePath();
            ctx.fill();
        } else if (eyebrows === 'surprised') {
            ctx.beginPath();
            ctx.moveTo(-20, -38);
            ctx.lineTo(-5, -38);
            ctx.lineTo(-7, -35);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(20, -38);
            ctx.lineTo(5, -38);
            ctx.lineTo(7, -35);
            ctx.closePath();
            ctx.fill();
        } else if (eyebrows === 'concerned') {
            ctx.beginPath();
            ctx.moveTo(-20, -33);
            ctx.lineTo(-5, -38);
            ctx.lineTo(-7, -33);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(20, -33);
            ctx.lineTo(5, -38);
            ctx.lineTo(7, -33);
            ctx.closePath();
            ctx.fill();
        } else if (eyebrows === 'confident') {
            ctx.beginPath();
            ctx.moveTo(-20, -32);
            ctx.lineTo(-5, -32);
            ctx.lineTo(-7, -30);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(20, -32);
            ctx.lineTo(5, -32);
            ctx.lineTo(7, -30);
            ctx.closePath();
            ctx.fill();
        } else {
            // 기본 눈썹
            ctx.beginPath();
            ctx.moveTo(-20, -33);
            ctx.lineTo(-5, -33);
            ctx.lineTo(-7, -30);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(20, -33);
            ctx.lineTo(5, -33);
            ctx.lineTo(7, -30);
            ctx.closePath();
            ctx.fill();
        }
    }

    drawMouth(ctx) {
        const mouth = this.expression.mouth;
        
        ctx.fillStyle = '#E8B4B4';
        
        switch(mouth) {
            case 'smile':
                ctx.beginPath();
                ctx.moveTo(-12, -15);
                ctx.quadraticCurveTo(0, -10, 12, -15);
                ctx.fill();
                break;
                
            case 'neutral':
                ctx.beginPath();
                ctx.moveTo(-10, -10);
                ctx.lineTo(10, -10);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#E8B4B4';
                ctx.stroke();
                break;
                
            case 'grit':
                ctx.beginPath();
                ctx.moveTo(-15, -10);
                ctx.lineTo(15, -10);
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#E8B4B4';
                ctx.stroke();
                break;
                
            case 'open':
                ctx.beginPath();
                ctx.ellipse(0, -10, 10, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.ellipse(0, -10, 8, 6, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'scream':
                ctx.beginPath();
                ctx.ellipse(0, -5, 15, 12, 0, 0, Math.PI);
                ctx.fill();
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.ellipse(0, -5, 12, 9, 0, 0, Math.PI);
                ctx.fill();
                break;
                
            case 'smirk':
                ctx.beginPath();
                ctx.moveTo(-10, -10);
                ctx.quadraticCurveTo(5, -5, 12, -12);
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

// 프리더 클래스 (새로 추가)
class Frieza extends Character {
    constructor(x, y, state = 'normal') {
        super(x, y);
        this.state = state;
        this.armorColor = '#9933cc'; // 보라색 갑옷
        this.skinColor = '#ccccff';  // 연보라색 피부
        this.highlight = '#cc99ff';
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        switch(this.state) {
            case 'smirking':
                this.scale = 1;
                break;
            case 'attacking':
                this.scale = 1.1;
                break;
            case 'defeated':
                this.scale = 0.9;
                this.opacity = 0.7;
                break;
        }
    }

    drawCharacter(ctx) {
        // 머리
        ctx.fillStyle = this.skinColor;
        ctx.beginPath();
        ctx.moveTo(0, -50);
        ctx.lineTo(-15, -30);
        ctx.lineTo(-25, -20);
        ctx.lineTo(-20, 0);
        ctx.lineTo(20, 0);
        ctx.lineTo(25, -20);
        ctx.lineTo(15, -30);
        ctx.closePath();
        ctx.fill();
        
        // 뿔
        ctx.fillStyle = '#663399';
        ctx.beginPath();
        ctx.moveTo(-10, -55);
        ctx.lineTo(-5, -70);
        ctx.lineTo(0, -55);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(10, -55);
        ctx.lineTo(5, -70);
        ctx.lineTo(0, -55);
        ctx.closePath();
        ctx.fill();
        
        // 얼굴
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(-10, -35, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(10, -35, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 입
        if (this.state === 'smirking') {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-8, -25);
            ctx.quadraticCurveTo(0, -20, 8, -25);
            ctx.stroke();
        } else {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-10, -25);
            ctx.lineTo(10, -25);
            ctx.stroke();
        }
        
        // 갑옷
        ctx.fillStyle = this.armorColor;
        ctx.fillRect(-30, 0, 60, 30);
        
        // 갑옷 디테일
        ctx.fillStyle = this.highlight;
        ctx.fillRect(-25, 5, 50, 10);
        
        // 손
        ctx.fillStyle = this.skinColor;
        ctx.fillRect(-40, 10, 10, 20);
        ctx.fillRect(30, 10, 10, 20);
        
        if (this.state === 'defeated') {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-20, -10);
            ctx.lineTo(-30, 5);
            ctx.lineTo(-25, 15);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(20, -10);
            ctx.lineTo(30, 5);
            ctx.lineTo(25, 15);
            ctx.stroke();
        }
    }
}

// Gohan, Android16, Cell, Piccolo 클래스는 기존 코드 그대로 유지
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
            case 'gold_energy': return 'rgba(255, 215, 0, 0.9)';
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

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new DragonBallZGame();
});
