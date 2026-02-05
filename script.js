class DragonBallGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.dialogBox = document.getElementById('dialogBox');
        this.dialogText = document.getElementById('dialogText');
        this.characterName = document.getElementById('characterName');
        this.sceneIndicator = document.getElementById('sceneIndicator');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.loadingProgress = document.getElementById('loadingProgress');
        this.tapToNext = document.querySelector('.tap-to-next');
        this.touchHint = document.getElementById('touchHint');
        this.muteBtn = document.getElementById('muteBtn');
        this.replayBtn = document.getElementById('replayBtn');
        this.bgm = document.getElementById('bgm');
        
        this.currentScene = 0;
        this.dialogIndex = 0;
        this.isAnimating = false;
        this.isLoading = true;
        this.loadProgress = 0;
        this.isMuted = false;
        this.isAutoPlaying = false;
        this.sceneTimer = null;
        this.lastTapTime = 0;
        this.tapCooldown = 300; // 300ms 쿨다운
        
        this.scenes = [
            {
                name: "붕괴 직전의 정적",
                duration: 0, // 터치로만 전환
                dialogs: [],
                bgColor: '#1a1a2e',
                bgmVolume: 0.1
            },
            {
                name: "16호의 마지막 시선",
                duration: 0,
                dialogs: [
                    {
                        character: "안드로이드 16호",
                        text: "내가 좋아했던",
                        delay: 0
                    },
                    {
                        character: "안드로이드 16호",
                        text: "자연과 동물들을…",
                        delay: 0
                    },
                    {
                        character: "안드로이드 16호",
                        text: "지.켜.주.거.라.",
                        delay: 0
                    },
                    {
                        character: "안드로이드 16호",
                        text: "부탁한다~",
                        delay: 0
                    }
                ],
                bgColor: '#2d3436',
                bgmVolume: 0.2
            },
            {
                name: "선택을 빼앗는 폭력",
                duration: 0,
                dialogs: [
                    {
                        character: "셀",
                        text: "쓸데없는 참견이다.",
                        delay: 0
                    },
                    {
                        character: "셀",
                        text: "실패작 녀석.",
                        delay: 0
                    }
                ],
                bgColor: '#2d132c',
                bgmVolume: 0.3
            },
            {
                name: "오반의 눈, 세계의 균열",
                duration: 0,
                dialogs: [],
                bgColor: '#801336',
                bgmVolume: 0.4
            },
            {
                name: "침묵의 임계점",
                duration: 0,
                dialogs: [],
                bgColor: '#510a32',
                bgmVolume: 0.5
            },
            {
                name: "폭발",
                duration: 0,
                dialogs: [],
                bgColor: '#c72c41',
                bgmVolume: 0.6
            },
            {
                name: "목격자들의 반응",
                duration: 0,
                dialogs: [
                    {
                        character: "",
                        text: "오반!!",
                        delay: 0
                    }
                ],
                bgColor: '#ee4540',
                bgmVolume: 0.7
            },
            {
                name: "새로운 얼굴",
                duration: 0,
                dialogs: [
                    {
                        character: "나레이션",
                        text: "드디어... 오반의 분노의 한계가 넘은 것인가?",
                        delay: 0
                    }
                ],
                bgColor: '#ff9a00',
                bgmVolume: 0.8
            },
            {
                name: "선언 없는 선언",
                duration: 0,
                dialogs: [],
                bgColor: '#000000',
                bgmVolume: 0.9
            }
        ];
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 터치 이벤트 리스너 - 전체 화면 터치 감지
        this.canvas.addEventListener('touchstart', (e) => this.handleScreenTap(e));
        this.canvas.addEventListener('click', (e) => this.handleScreenTap(e));
        
        // 대화창 터치 (캔버스와 별개로 작동)
        this.dialogBox.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleScreenTap(e);
        });
        
        this.dialogBox.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleScreenTap(e);
        });
        
        // 컨트롤 버튼 이벤트
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        this.replayBtn.addEventListener('click', () => this.restartGame());
        
        // 배경음악 이벤트
        this.bgm.addEventListener('canplaythrough', () => {
            console.log('BGM 로드 완료');
        });
        
        this.bgm.addEventListener('error', (e) => {
            console.error('BGM 로드 오류:', e);
        });
        
        // "다음 씬으로" 메시지도 터치 가능하게
        this.tapToNext.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleScreenTap(e);
        });
        
        this.tapToNext.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleScreenTap(e);
        });
        
        this.loadAssets();
    }
    
    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        if (!this.isLoading) {
            this.draw();
        }
    }
    
    loadAssets() {
        const totalSteps = 10;
        let loadedSteps = 0;
        
        // BGM 로드 시도
        this.bgm.load();
        this.bgm.volume = 0.5;
        
        const progressInterval = setInterval(() => {
            loadedSteps++;
            this.loadProgress = (loadedSteps / totalSteps) * 100;
            this.loadingProgress.style.width = this.loadProgress + '%';
            
            if (loadedSteps >= totalSteps) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    this.isLoading = false;
                    this.loadingScreen.style.display = 'none';
                    this.startGame();
                }, 500);
            }
        }, 200);
    }
    
    startGame() {
        this.currentScene = 0;
        this.dialogIndex = 0;
        this.isAnimating = true;
        this.updateSceneIndicator();
        this.showTapToNext();
        this.startBGM();
        this.animate();
    }
    
    startBGM() {
        if (!this.isMuted) {
            this.bgm.volume = this.scenes[this.currentScene].bgmVolume;
            this.bgm.play().catch(e => {
                console.log('자동 재생 차단됨, 사용자 상호작용 필요');
                // 사용자 상호작용 후 재생
                document.addEventListener('click', () => {
                    this.bgm.play();
                }, { once: true });
            });
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.bgm.pause();
            this.muteBtn.textContent = '🔊 음악켜기';
        } else {
            this.bgm.play();
            this.muteBtn.textContent = '🔇 음소거';
        }
        this.bgm.volume = this.isMuted ? 0 : this.scenes[this.currentScene].bgmVolume;
    }
    
    restartGame() {
        this.currentScene = 0;
        this.dialogIndex = 0;
        this.updateSceneIndicator();
        this.hideDialog();
        this.showTapToNext();
        this.bgm.currentTime = 0;
        this.bgm.volume = this.scenes[this.currentScene].bgmVolume;
        if (!this.isMuted) {
            this.bgm.play();
        }
    }
    
    handleScreenTap(e) {
        e.preventDefault();
        const currentTime = Date.now();
        
        // 탭 쿨다운 체크
        if (currentTime - this.lastTapTime < this.tapCooldown) {
            return;
        }
        
        this.lastTapTime = currentTime;
        
        // 탭 효과 (시각적 피드백)
        this.showTapEffect(e);
        
        // 대사가 있으면 대사 먼저 처리
        const scene = this.scenes[this.currentScene];
        if (scene.dialogs.length > 0 && this.dialogIndex < scene.dialogs.length) {
            this.nextDialog();
            return;
        }
        
        // 대사가 없거나 모두 보여준 경우 씬 전환
        this.nextScene();
    }
    
    showTapEffect(e) {
        const rect = this.canvas.getBoundingClientRect();
        let x, y;
        
        if (e.type === 'touchstart') {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        
        // 탭 위치에 원형 효과 생성
        const scale = window.devicePixelRatio || 1;
        const ctx = this.ctx;
        
        ctx.save();
        ctx.translate(x * scale, y * scale);
        
        // 원형 파동 효과
        for(let i = 0; i < 3; i++) {
            setTimeout(() => {
                ctx.save();
                ctx.beginPath();
                ctx.arc(0, 0, 20 * scale + i * 30, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 204, 0, ${0.7 - i * 0.2})`;
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.restore();
            }, i * 100);
        }
        
        ctx.restore();
    }
    
    nextDialog() {
        const scene = this.scenes[this.currentScene];
        
        if (scene.dialogs.length > 0 && this.dialogIndex < scene.dialogs.length) {
            const dialog = scene.dialogs[this.dialogIndex];
            this.showDialog(dialog.character, dialog.text);
            this.dialogIndex++;
            
            // 마지막 대사면 "다음 씬으로" 표시
            if (this.dialogIndex >= scene.dialogs.length) {
                this.showTapToNext();
            }
        }
    }
    
    showDialog(character, text) {
        this.characterName.textContent = character;
        this.dialogText.textContent = text;
        this.dialogBox.style.display = 'flex';
        this.hideTapToNext();
    }
    
    hideDialog() {
        this.dialogBox.style.display = 'none';
        this.characterName.textContent = '';
        this.dialogText.textContent = '';
    }
    
    showTapToNext() {
        this.tapToNext.classList.add('show');
    }
    
    hideTapToNext() {
        this.tapToNext.classList.remove('show');
    }
    
    updateSceneIndicator() {
        this.sceneIndicator.textContent = `Scene ${this.currentScene + 1}/9: ${this.scenes[this.currentScene].name}`;
    }
    
    nextScene() {
        this.currentScene++;
        this.dialogIndex = 0;
        
        if (this.currentScene >= this.scenes.length) {
            this.currentScene = 0; // 마지막 씬 이후 처음으로
        }
        
        this.updateSceneIndicator();
        this.hideDialog();
        this.showTapToNext();
        
        // BGM 볼륨 조정
        if (!this.isMuted) {
            this.bgm.volume = this.scenes[this.currentScene].bgmVolume;
        }
    }
    
    draw() {
        const ctx = this.ctx;
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);
        const centerX = width / 2;
        const centerY = height / 2;
        
        // 배경 그리기
        const scene = this.scenes[this.currentScene];
        ctx.fillStyle = scene.bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // 현재 씬에 따른 캐릭터 그리기
        switch(this.currentScene) {
            case 0:
                this.drawScene1(ctx, width, height, centerX, centerY);
                break;
            case 1:
                this.drawScene2(ctx, width, height, centerX, centerY);
                break;
            case 2:
                this.drawScene3(ctx, width, height, centerX, centerY);
                break;
            case 3:
                this.drawScene4(ctx, width, height, centerX, centerY);
                break;
            case 4:
                this.drawScene5(ctx, width, height, centerX, centerY);
                break;
            case 5:
                this.drawScene6(ctx, width, height, centerX, centerY);
                break;
            case 6:
                this.drawScene7(ctx, width, height, centerX, centerY);
                break;
            case 7:
                this.drawScene8(ctx, width, height, centerX, centerY);
                break;
            case 8:
                this.drawScene9(ctx, width, height, centerX, centerY);
                break;
        }
        
        // 특수 효과
        this.drawSceneEffects(ctx, width, height);
    }
    
    // [기존의 모든 draw 메서드들...]
    // (앞서 제공했던 모든 drawScene1~9, drawGohanScene1, drawAndroid16 등 모든 메서드 유지)
    // 코드 길이를 위해 여기서는 생략하지만, 위의 모든 draw 메서드를 그대로 복사해오세요
    
    drawScene1(ctx, width, height, centerX, centerY) {
        // 경기장 배경
        this.drawStadium(ctx, width, height);
        
        // 손오반 그리기 (파란 띠, 보라색 도복)
        this.drawGohanScene1(ctx, centerX, centerY);
        
        // 먼지 효과
        this.drawDustParticles(ctx, width, height, 50);
    }
    
    // ... (모든 그리기 메서드들 - 앞서 제공한 코드 그대로) ...
    
    animate() {
        if(!this.isAnimating) return;
        
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // 화면 흔들림 리셋
        
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// 게임 시작
window.addEventListener('load', () => {
    const game = new DragonBallGame();
    
    // iOS에서 오디오 자동재생 허용을 위한 터치 이벤트
    document.body.addEventListener('touchstart', function initAudio() {
        const bgm = document.getElementById('bgm');
        bgm.play().then(() => {
            bgm.pause();
            bgm.currentTime = 0;
        }).catch(e => {
            console.log('오디오 초기화 완료');
        });
        document.body.removeEventListener('touchstart', initAudio);
    });
});
