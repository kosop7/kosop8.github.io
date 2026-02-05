// 드래곤볼 Z 게임 - 씬 전환 및 BGM 추가
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
        // BGM 자동 재생 시도
        const playBGM = () => {
            if (!this.isBGMPlaying) {
                this.bgm.volume = 0.5; // 적절한 볼륨 설정
                this.bgm.loop = true;
                this.bgm.play().then(() => {
                    this.isBGMPlaying = true;
                    console.log('BGM 재생 시작');
                }).catch(error => {
                    console.log('BGM 재생 실패:', error);
                });
            }
        };

        // 사용자 상호작용 시 BGM 재생
        document.addEventListener('click', playBGM);
        document.addEventListener('touchstart', playBGM);
        
        // 로딩 완료 후에도 재생 시도
        setTimeout(playBGM, 1000);
    }

    startLoading() {
        const interval = setInterval(() => {
            this.loadProgress += 0.05;
            document.querySelector('.loading-progress').style.width = `${this.loadProgress * 100}%`;
            
            if (this.loadProgress >= 1) {
                clearInterval(interval);
                setTimeout(() => {
                    this.isLoading = false;
                    document.getElementById('loading-screen').style.display = 'none';
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
        // 기존 씬들 동일하게 생성...
        // SCENE 1: 붕괴 직전의 정적
        this.scenes.push({
            name: "붕괴 직전의 정적",
            characters: [
                new Gohan(0, 0, 'defeated')
            ],
            camera: { x: 0, y: 0, zoom: 0.8 },
            duration: 2000, // 기다리는 시간 단축
            nextSceneTrigger: 'click'
        });

        // SCENE 2: 16호의 마지막 시선
        this.scenes.push({
            name: "16호의 마지막 시선",
            characters: [
                new Android16(0, 0, 'normal')
            ],
            camera: { x: 0, y: 0, zoom: 2 },
            dialogue: [
                { speaker: '안드로이드 16호', text: '내가 좋아했던', duration: 800 },
                { speaker: '안드로이드 16호', text: '자연과 동물들을…', duration: 1000 },
                { speaker: '안드로이드 16호', text: '지.켜.주.거.라.', duration: 1200 },
                { speaker: '안드로이드 16호', text: '부탁한다~', duration: 800 }
            ],
            duration: 4000,
            nextSceneTrigger: 'click'
        });

        // SCENE 3: 선택을 빼앗는 폭력
        this.scenes.push({
            name: "선택을 빼앗는 폭력",
            characters: [
                new Cell(40, 0, 'smirking'),
                new Android16(-40, 0, 'damaged')
            ],
            camera: { x: 0, y: 0, zoom: 1.2 },
            dialogue: [
                { speaker: '셀', text: '쓸데없는 참견이다.', duration: 800 },
                { speaker: '셀', text: '실패작 녀석.', duration: 800 }
            ],
            duration: 3000,
            nextSceneTrigger: 'click'
        });

        // SCENE 4: 오반의 눈, 세계의 균열
        this.scenes.push({
            name: "오반의 눈, 세계의 균열",
            characters: [
                new Gohan(0, 0, 'angry')
            ],
            camera: { x: 0, y: 0, zoom: 2.5 },
            duration: 1500,
            nextSceneTrigger: 'click'
        });

        // SCENE 5: 침묵의 임계점
        this.scenes.push({
            name: "침묵의 임계점",
            characters: [
                new Gohan(0, 0, 'determined')
            ],
            camera: { x: 0, y: 0, zoom: 2 },
            duration: 1500,
            nextSceneTrigger: 'click'
        });

        // SCENE 6: 폭발
        this.scenes.push({
            name: "폭발",
            characters: [
                new Gohan(0, 0, 'screaming')
            ],
            camera: { x: 0, y: 0, zoom: 1.5, shake: 0.5 },
            duration: 2000,
            nextSceneTrigger: 'click'
        });

        // SCENE 7: 목격자들의 반응
        this.scenes.push({
            name: "목격자들의 반응",
            characters: [
                new Goku(-50, 0, 'shocked'),
                new Piccolo(50, 0, 'surprised')
            ],
            camera: { x: 0, y: 0, zoom: 1 },
            dialogue: [
                { speaker: '화면 밖', text: '오반!!', duration: 1000 }
            ],
            duration: 1500,
            nextSceneTrigger: 'click'
        });

        // SCENE 8: 새로운 얼굴
        this.scenes.push({
            name: "새로운 얼굴",
            characters: [
                new Gohan(0, 0, 'super_saiyan')
            ],
            camera: { x: 0, y: 0, zoom: 2 },
            dialogue: [
                { speaker: '내레이션', text: '드디어... 오반의 분노의 한계가 넘은 것인가?', duration: 1500 }
            ],
            duration: 2000,
            nextSceneTrigger: 'click'
        });

        // SCENE 9: 선언 없는 선언
        this.scenes.push({
            name: "선언 없는 선언",
            characters: [
                new Gohan(0, 0, 'final')
            ],
            camera: { x: 0, y: 0, zoom: 1.8 },
            duration: 2000,
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
        document.getElementById('scene-number').textContent = index + 1;
        
        // 캐릭터 초기화
        this.characters = scene.characters;
        
        // 카메라 설정
        Object.assign(this.camera, scene.camera);
        
        // 대사 초기화
        this.dialogue = scene.dialogue || [];
        this.currentDialogueIndex = 0;
        
        // 씬 타이머 설정 (자동 전환 시간 단축)
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
        dialogueBox.classList.remove('hidden');
        
        document.getElementById('speaker-name').textContent = dialogue.speaker;
        document.getElementById('dialogue-text').textContent = dialogue.text;
        
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
        document.getElementById('dialogue-box').classList.add('hidden');
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

        // 씬 자동 전환 (대기가 필요한 경우만)
        const scene = this.scenes[this.currentSceneIndex];
        if (!this.isDialogueActive && scene.nextSceneTrigger === 'auto') {
            if (Date.now() - this.sceneStartTime >= scene.duration) {
                this.loadScene(this.currentSceneIndex + 1);
            }
        }

        // 대사 자동 넘김 (대기가 필요한 경우만)
        if (this.isDialogueActive && Date.now() - this.dialogueStartTime >= this.dialogueTimer) {
            this.nextDialogue();
        }

        // 장면별 특수 효과
        this.updateSceneEffects();
    }

    // ... 나머지 메소드들은 이전과 동일하게 유지 ...

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

        // 암전
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, w, h);

        // 엔딩 텍스트
        ctx.fillStyle = '#8A2BE2';
        ctx.font = 'bold 48px Noto Sans KR';
        ctx.textAlign = 'center';
        ctx.fillText('THE END', w / 2, h / 2 - 30);

        ctx.fillStyle = '#FFD700';
        ctx.font = '24px Noto Sans KR';
        ctx.fillText('터치하여 다시 시작', w / 2, h / 2 + 30);

        // 다시 시작 이벤트
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

// ... 나머지 캐릭터 클래스들은 이전과 동일하게 유지 ...

// 게임 시작
window.addEventListener('load', () => {
    new DragonBallZGame();
});
