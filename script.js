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
        
        this.currentScene = 0;
        this.dialogIndex = 0;
        this.isAnimating = false;
        this.isLoading = true;
        this.loadProgress = 0;
        
        this.scenes = [
            {
                name: "붕괴 직전의 정적",
                duration: 5000,
                dialogs: [],
                bgColor: '#1a1a2e'
            },
            {
                name: "16호의 마지막 시선",
                duration: 8000,
                dialogs: [
                    {
                        character: "안드로이드 16호",
                        text: "내가 좋아했던",
                        delay: 1000
                    },
                    {
                        character: "안드로이드 16호",
                        text: "자연과 동물들을…",
                        delay: 1500
                    },
                    {
                        character: "안드로이드 16호",
                        text: "지.켜.주.거.라.",
                        delay: 2000
                    },
                    {
                        character: "안드로이드 16호",
                        text: "부탁한다~",
                        delay: 1500
                    }
                ],
                bgColor: '#2d3436'
            },
            {
                name: "선택을 빼앗는 폭력",
                duration: 4000,
                dialogs: [
                    {
                        character: "셀",
                        text: "쓸데없는 참견이다.",
                        delay: 1000
                    },
                    {
                        character: "셀",
                        text: "실패작 녀석.",
                        delay: 1000
                    }
                ],
                bgColor: '#2d132c'
            },
            {
                name: "오반의 눈, 세계의 균열",
                duration: 6000,
                dialogs: [],
                bgColor: '#801336'
            },
            {
                name: "침묵의 임계점",
                duration: 7000,
                dialogs: [],
                bgColor: '#510a32'
            },
            {
                name: "폭발",
                duration: 5000,
                dialogs: [],
                bgColor: '#c72c41'
            },
            {
                name: "목격자들의 반응",
                duration: 3000,
                dialogs: [
                    {
                        character: "",
                        text: "오반!!",
                        delay: 1000
                    }
                ],
                bgColor: '#ee4540'
            },
            {
                name: "새로운 얼굴",
                duration: 6000,
                dialogs: [
                    {
                        character: "나레이션",
                        text: "드디어... 오반의 분노의 한계가 넘은 것인가?",
                        delay: 2000
                    }
                ],
                bgColor: '#ff9a00'
            },
            {
                name: "선언 없는 선언",
                duration: 4000,
                dialogs: [],
                bgColor: '#000000'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 터치 이벤트 리스너
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e));
        this.canvas.addEventListener('click', (e) => this.handleTouch(e));
        
        this.dialogBox.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nextDialog();
        });
        
        this.dialogBox.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nextDialog();
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
        this.animate();
    }
    
    handleTouch(e) {
        e.preventDefault();
        if (this.isAnimating) {
            this.nextDialog();
        }
    }
    
    nextDialog() {
        const scene = this.scenes[this.currentScene];
        
        if (scene.dialogs.length > 0 && this.dialogIndex < scene.dialogs.length) {
            const dialog = scene.dialogs[this.dialogIndex];
            this.showDialog(dialog.character, dialog.text);
            this.dialogIndex++;
        }
    }
    
    showDialog(character, text) {
        this.characterName.textContent = character;
        this.dialogText.textContent = text;
        this.dialogBox.style.display = 'flex';
    }
    
    hideDialog() {
        this.dialogBox.style.display = 'none';
        this.characterName.textContent = '';
        this.dialogText.textContent = '';
    }
    
    updateSceneIndicator() {
        this.sceneIndicator.textContent = `Scene ${this.currentScene + 1}/9: ${this.scenes[this.currentScene].name}`;
    }
    
    nextScene() {
        this.currentScene++;
        this.dialogIndex = 0;
        
        if (this.currentScene >= this.scenes.length) {
            this.currentScene = 0;
        }
        
        this.updateSceneIndicator();
        this.hideDialog();
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
    
    drawScene1(ctx, width, height, centerX, centerY) {
        // 경기장 배경
        this.drawStadium(ctx, width, height);
        
        // 손오반 그리기 (파란 띠, 보라색 도복)
        this.drawGohanScene1(ctx, centerX, centerY);
        
        // 먼지 효과
        this.drawDustParticles(ctx, width, height, 50);
    }
    
    drawScene2(ctx, width, height, centerX, centerY) {
        // 안드로이드 16호 클로즈업
        this.drawAndroid16(ctx, centerX, centerY);
        
        // 기계적 손상 효과
        this.drawMechanicalDamage(ctx, centerX, centerY);
    }
    
    drawScene3(ctx, width, height, centerX, centerY) {
        // 셀의 발 차기 장면
        this.drawCellAttack(ctx, centerX, centerY);
        
        // 충격파 효과
        this.drawShockwave(ctx, centerX, centerY, width, height);
    }
    
    drawScene4(ctx, width, height, centerX, centerY) {
        // 오반의 눈 클로즈업
        this.drawGohanEyes(ctx, centerX, centerY);
        
        // 배경 붉어짐 효과
        this.drawRedBackgroundEffect(ctx, width, height);
    }
    
    drawScene5(ctx, width, height, centerX, centerY) {
        // 오반의 얼굴 클로즈업 (침묵)
        this.drawGohanSilent(ctx, centerX, centerY);
        
        // 눈물 효과
        this.drawTearEffect(ctx, centerX, centerY);
    }
    
    drawScene6(ctx, width, height, centerX, centerY) {
        // 오반의 폭발 장면
        this.drawGohanExplosion(ctx, centerX, centerY);
        
        // 지면 갈라짐 효과
        this.drawGroundCrack(ctx, width, height);
        
        // 오라 효과
        this.drawAuraEffect(ctx, centerX, centerY);
    }
    
    drawScene7(ctx, width, height, centerX, centerY) {
        // 오공과 피콜로 반응
        this.drawGokuAndPiccolo(ctx, centerX, centerY);
    }
    
    drawScene8(ctx, width, height, centerX, centerY) {
        // 초사이어인2 오반
        this.drawSSJ2Gohan(ctx, centerX, centerY);
        
        // 번개 효과
        this.drawLightningEffects(ctx, width, height);
    }
    
    drawScene9(ctx, width, height, centerX, centerY) {
        // 최종 장면 (암전)
        this.drawFinalScene(ctx, centerX, centerY);
    }
    
    drawStadium(ctx, width, height) {
        // 경기장 바닥
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(0, height * 0.6, width, height * 0.4);
        
        // 균열 효과
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width * 0.2, height * 0.7);
        ctx.lineTo(width * 0.8, height * 0.7);
        ctx.moveTo(width * 0.5, height * 0.65);
        ctx.lineTo(width * 0.5, height * 0.9);
        ctx.stroke();
        
        // 파편 효과
        this.drawDebris(ctx, width, height);
    }
    
    drawGohanScene1(ctx, centerX, centerY) {
        // 오반 기본 도형 구조
        const scale = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.002;
        
        // 얼굴 (타원형, 부드러운 턱선)
        ctx.fillStyle = '#f8d7a6';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 30, 40 * scale, 50 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 머리카락 (검정색, 약간 흐트러짐)
        ctx.fillStyle = '#000';
        this.drawGohanHair(ctx, centerX, centerY - 30, scale);
        
        // 눈 (평소 상태: 크고 동그란)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(centerX - 15 * scale, centerY - 30, 8 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 15 * scale, centerY - 30, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 동공
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(centerX - 15 * scale, centerY - 32, 3 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 15 * scale, centerY - 32, 3 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 눈썹 (완만한 아치형)
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(centerX - 25 * scale, centerY - 45);
        ctx.quadraticCurveTo(centerX - 15 * scale, centerY - 50, centerX - 5 * scale, centerY - 45);
        ctx.moveTo(centerX + 5 * scale, centerY - 45);
        ctx.quadraticCurveTo(centerX + 15 * scale, centerY - 50, centerX + 25 * scale, centerY - 45);
        ctx.stroke();
        
        // 입 (내향적, 입꼬리 살짝 내려감)
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.moveTo(centerX - 10 * scale, centerY - 10);
        ctx.quadraticCurveTo(centerX, centerY - 5, centerX + 10 * scale, centerY - 10);
        ctx.stroke();
        
        // 도복 상의 (보라색)
        ctx.fillStyle = '#8a2be2'; // 보라색
        ctx.beginPath();
        ctx.moveTo(centerX - 60 * scale, centerY - 30);
        ctx.lineTo(centerX - 40 * scale, centerY + 40);
        ctx.lineTo(centerX + 40 * scale, centerY + 40);
        ctx.lineTo(centerX + 60 * scale, centerY - 30);
        ctx.closePath();
        ctx.fill();
        
        // 브이넥 라인
        ctx.strokeStyle = '#6a1b9a';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 20);
        ctx.lineTo(centerX, centerY + 20);
        ctx.stroke();
        
        // 띠 (파란색 - 주황색 절대 아님)
        ctx.fillStyle = '#0000ff'; // 파란색
        ctx.fillRect(centerX - 45 * scale, centerY + 30, 90 * scale, 15 * scale);
        
        // 손 (떨리는 주먹)
        ctx.fillStyle = '#f8d7a6';
        ctx.beginPath();
        ctx.arc(centerX - 70 * scale, centerY, 15 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 70 * scale, centerY, 15 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 상처와 먼지 효과
        this.drawBattleDamage(ctx, centerX, centerY, scale);
    }
    
    drawGohanHair(ctx, x, y, scale) {
        // 오반의 전형적인 머리스타일
        ctx.fillStyle = '#000';
        ctx.beginPath();
        
        // 정수리 부분
        ctx.moveTo(x - 45 * scale, y - 40);
        ctx.quadraticCurveTo(x - 20 * scale, y - 80, x, y - 60);
        ctx.quadraticCurveTo(x + 20 * scale, y - 80, x + 45 * scale, y - 40);
        
        // 측면
        ctx.lineTo(x + 50 * scale, y - 20);
        ctx.lineTo(x - 50 * scale, y - 20);
        ctx.closePath();
        ctx.fill();
        
        // 앞머리 가닥들
        for(let i = 0; i < 5; i++) {
            const offset = i * 10 - 20;
            ctx.beginPath();
            ctx.moveTo(x + offset * scale, y - 60);
            ctx.quadraticCurveTo(x + (offset - 5) * scale, y - 70, x + offset * scale, y - 80);
            ctx.stroke();
        }
    }
    
    drawAndroid16(ctx, centerX, centerY) {
        const scale = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.0015;
        
        // 얼굴 (사각형 구조)
        ctx.fillStyle = '#b0bec5';
        ctx.beginPath();
        ctx.roundRect(centerX - 60 * scale, centerY - 80, 120 * scale, 160 * scale, [20]);
        ctx.fill();
        
        // 이마 보호대
        ctx.fillStyle = '#78909c';
        ctx.fillRect(centerX - 50 * scale, centerY - 85, 100 * scale, 20 * scale);
        
        // 눈 (작고 깊게 박힘)
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(centerX - 25 * scale, centerY - 30, 15 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 25 * scale, centerY - 30, 15 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 동공
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(centerX - 25 * scale, centerY - 30, 8 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 25 * scale, centerY - 30, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 눈썹 (굵고 중립적)
        ctx.fillStyle = '#37474f';
        ctx.fillRect(centerX - 40 * scale, centerY - 50, 30 * scale, 8 * scale);
        ctx.fillRect(centerX + 10 * scale, centerY - 50, 30 * scale, 8 * scale);
        
        // 입 (직선, 무표정)
        ctx.strokeStyle = '#37474f';
        ctx.lineWidth = 4 * scale;
        ctx.beginPath();
        ctx.moveTo(centerX - 30 * scale, centerY + 20);
        ctx.lineTo(centerX + 30 * scale, centerY + 20);
        ctx.stroke();
        
        // 기계적 접합부
        ctx.strokeStyle = '#546e7a';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.moveTo(centerX - 60 * scale, centerY - 20);
        ctx.lineTo(centerX + 60 * scale, centerY - 20);
        ctx.moveTo(centerX - 60 * scale, centerY + 40);
        ctx.lineTo(centerX + 60 * scale, centerY + 40);
        ctx.stroke();
        
        // 손상 효과
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(centerX + 50 * scale, centerY - 60);
        ctx.lineTo(centerX + 70 * scale, centerY - 40);
        ctx.lineTo(centerX + 60 * scale, centerY - 20);
        ctx.stroke();
    }
    
    drawCellAttack(ctx, centerX, centerY) {
        const scale = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.0012;
        
        // 셀의 발
        ctx.fillStyle = '#81c784';
        ctx.beginPath();
        
        // 발바닥
        ctx.moveTo(centerX - 100 * scale, centerY + 50);
        ctx.lineTo(centerX - 80 * scale, centerY + 100);
        ctx.lineTo(centerX + 80 * scale, centerY + 100);
        ctx.lineTo(centerX + 100 * scale, centerY + 50);
        
        // 발등
        ctx.quadraticCurveTo(centerX, centerY - 50, centerX - 100 * scale, centerY + 50);
        ctx.closePath();
        ctx.fill();
        
        // 발톱
        ctx.fillStyle = '#4caf50';
        for(let i = 0; i < 3; i++) {
            const x = centerX - 40 * scale + i * 40 * scale;
            ctx.beginPath();
            ctx.moveTo(x, centerY + 100);
            ctx.lineTo(x - 10 * scale, centerY + 130);
            ctx.lineTo(x + 10 * scale, centerY + 130);
            ctx.closePath();
            ctx.fill();
        }
        
        // 셀의 얼굴 (위쪽에 약간 보임)
        this.drawCellFace(ctx, centerX, centerY - 150, scale * 0.8);
    }
    
    drawCellFace(ctx, x, y, scale) {
        // 얼굴 기반색
        ctx.fillStyle = '#81c784';
        ctx.beginPath();
        ctx.ellipse(x, y, 50 * scale, 60 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 뿔
        ctx.fillStyle = '#4caf50';
        ctx.beginPath();
        ctx.moveTo(x - 10 * scale, y - 60 * scale);
        ctx.lineTo(x, y - 100 * scale);
        ctx.lineTo(x + 10 * scale, y - 60 * scale);
        ctx.closePath();
        ctx.fill();
        
        // 눈 (반쯤 뜬 상태, 비웃는 듯한)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x - 20 * scale, y - 10, 12 * scale, 0, Math.PI * 2);
        ctx.arc(x + 20 * scale, y - 10, 12 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 동공 (작고 날카로운)
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(x - 20 * scale, y - 12, 4 * scale, 0, Math.PI * 2);
        ctx.arc(x + 20 * scale, y - 12, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 입 (비대칭 미소)
        ctx.strokeStyle = '#4caf50';
        ctx.lineWidth = 4 * scale;
        ctx.beginPath();
        ctx.moveTo(x - 25 * scale, y + 20);
        ctx.quadraticCurveTo(x - 10 * scale, y + 30, x + 5 * scale, y + 25);
        ctx.stroke();
    }
    
    drawGohanEyes(ctx, centerX, centerY) {
        const scale = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.001;
        
        // 눈 클로즈업
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(centerX - 40 * scale, centerY, 50 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 40 * scale, centerY, 50 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 흰자
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(centerX - 40 * scale, centerY, 45 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 40 * scale, centerY, 45 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 홍채 (격렬하게 흔들리는 효과)
        const time = Date.now() * 0.01;
        const shakeX = Math.sin(time) * 5;
        const shakeY = Math.cos(time * 0.7) * 3;
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(centerX - 40 * scale + shakeX, centerY + shakeY, 25 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 40 * scale + shakeX, centerY + shakeY, 25 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 동공 (축소된 상태)
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(centerX - 40 * scale + shakeX, centerY + shakeY, 10 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 40 * scale + shakeX, centerY + shakeY, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 눈물 (눈가에 맺힌)
        ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(centerX - 40 * scale, centerY + 35 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 40 * scale, centerY + 35 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 피 (이마에서 흐르는)
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 60 * scale);
        ctx.quadraticCurveTo(centerX + 10 * scale, centerY - 40 * scale, centerX + 20 * scale, centerY - 20 * scale);
        ctx.stroke();
    }
    
    drawGohanSilent(ctx, centerX, centerY) {
        const scale = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.001;
        
        // 얼굴 전체 클로즈업
        ctx.fillStyle = '#f8d7a6';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 100 * scale, 120 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 눈 (고정된 시선)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(centerX - 40 * scale, centerY - 10, 25 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 40 * scale, centerY - 10, 25 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 눈동자 (안정된 상태)
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(centerX - 40 * scale, centerY - 12, 8 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 40 * scale, centerY - 12, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 눈썹 (모인 상태)
        ctx.fillStyle = '#000';
        ctx.fillRect(centerX - 60 * scale, centerY - 40, 40 * scale, 8 * scale);
        ctx.fillRect(centerX + 20 * scale, centerY - 40, 40 * scale, 8 * scale);
        
        // 입 (굳게 다문)
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 4 * scale;
        ctx.beginPath();
        ctx.moveTo(centerX - 30 * scale, centerY + 40);
        ctx.lineTo(centerX + 30 * scale, centerY + 40);
        ctx.stroke();
        
        // 주름 (이마와 눈가)
        ctx.strokeStyle = '#d4a76a';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        // 이마 주름
        for(let i = 0; i < 3; i++) {
            const y = centerY - 50 + i * 5;
            ctx.moveTo(centerX - 20 * scale, y);
            ctx.lineTo(centerX + 20 * scale, y);
        }
        // 눈가 주름
        ctx.moveTo(centerX - 60 * scale, centerY - 20);
        ctx.lineTo(centerX - 45 * scale, centerY - 15);
        ctx.moveTo(centerX + 60 * scale, centerY - 20);
        ctx.lineTo(centerX + 45 * scale, centerY - 15);
        ctx.stroke();
    }
    
    drawTearEffect(ctx, centerX, centerY) {
        const scale = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.001;
        const time = Date.now() * 0.001;
        
        // 눈물 생성 (랜덤한 타이밍)
        if(Math.sin(time) > 0.9) {
            const tearX = centerX - 40 * scale + (Math.random() * 20 - 10);
            const tearY = centerY - 10;
            
            // 눈물 방울
            ctx.fillStyle = 'rgba(100, 150, 255, 0.8)';
            ctx.beginPath();
            ctx.ellipse(tearX, tearY, 3 * scale, 5 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 눈물 흔적
            ctx.strokeStyle = 'rgba(100, 150, 255, 0.5)';
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.moveTo(tearX, tearY);
            ctx.lineTo(tearX, tearY + 30);
            ctx.stroke();
        }
    }
    
    drawGohanExplosion(ctx, centerX, centerY) {
        const scale = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.001;
        const time = Date.now() * 0.01;
        
        // 폭발하는 오라 (황금색)
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, 200 * scale
        );
        gradient.addColorStop(0, '#ffff00');
        gradient.addColorStop(0.3, '#ffcc00');
        gradient.addColorStop(0.6, '#ff6600');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        // 오라 펄스 효과
        const pulse = Math.sin(time) * 0.2 + 0.8;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 150 * scale * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // 초사이어인 오반
        this.drawSSJGohan(ctx, centerX, centerY, scale);
        
        // 에너지 빔 (파란색 번개)
        for(let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + time * 0.1;
            const length = 100 + Math.sin(time + i) * 50;
            
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3 * scale;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * length * scale,
                centerY + Math.sin(angle) * length * scale
            );
            ctx.stroke();
        }
    }
    
    drawSSJGohan(ctx, centerX, centerY, scale) {
        // 얼굴 (분노 표정)
        ctx.fillStyle = '#f8d7a6';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 50 * scale, 60 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 머리카락 (금색, 뾰족하게)
        ctx.fillStyle = '#ffcc00';
        this.drawSSJHair(ctx, centerX, centerY - 40, scale);
        
        // 눈 (날카롭게 찢어진)
        ctx.fillStyle = '#00aaff';
        ctx.beginPath();
        // 좌측 눈
        ctx.moveTo(centerX - 30 * scale, centerY - 15);
        ctx.lineTo(centerX - 45 * scale, centerY - 10);
        ctx.lineTo(centerX - 30 * scale, centerY + 5);
        ctx.lineTo(centerX - 15 * scale, centerY);
        ctx.closePath();
        // 우측 눈
        ctx.moveTo(centerX + 15 * scale, centerY);
        ctx.lineTo(centerX + 30 * scale, centerY + 5);
        ctx.lineTo(centerX + 45 * scale, centerY - 10);
        ctx.lineTo(centerX + 30 * scale, centerY - 15);
        ctx.closePath();
        ctx.fill();
        
        // 눈동자 (파란색 빛남)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX - 22 * scale, centerY - 5, 8 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 22 * scale, centerY - 5, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 눈썹 (안쪽으로 강하게 모임)
        ctx.fillStyle = '#000';
        ctx.fillRect(centerX - 50 * scale, centerY - 25, 35 * scale, 6 * scale);
        ctx.fillRect(centerX + 15 * scale, centerY - 25, 35 * scale, 6 * scale);
        
        // 입 (포효)
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 25, 25 * scale, 15 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawSSJHair(ctx, x, y, scale) {
        // 초사이어인 머리: 뾰족하게 위로 솟음
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        
        // 중앙 가닥
        ctx.moveTo(x - 25 * scale, y);
        ctx.lineTo(x, y - 80 * scale);
        ctx.lineTo(x + 25 * scale, y);
        
        // 좌측 가닥
        ctx.lineTo(x - 10 * scale, y - 20);
        ctx.lineTo(x - 40 * scale, y - 60 * scale);
        ctx.lineTo(x - 25 * scale, y);
        
        // 우측 가닥
        ctx.moveTo(x + 25 * scale, y);
        ctx.lineTo(x + 10 * scale, y - 20);
        ctx.lineTo(x + 40 * scale, y - 60 * scale);
        ctx.lineTo(x + 25 * scale, y);
        
        ctx.closePath();
        ctx.fill();
        
        // 빛나는 효과
        const gradient = ctx.createLinearGradient(
            x, y - 80 * scale,
            x, y
        );
        gradient.addColorStop(0, '#ffff00');
        gradient.addColorStop(1, '#ffcc00');
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    drawGokuAndPiccolo(ctx, centerX, centerY) {
        const scale = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.0008;
        
        // 오공 (왼쪽)
        this.drawGoku(ctx, centerX - 100 * scale, centerY, scale);
        
        // 피콜로 (오른쪽)
        this.drawPiccolo(ctx, centerX + 100 * scale, centerY, scale);
        
        // 놀란 표정 효과
        const time = Date.now() * 0.01;
        const shake = Math.sin(time * 5) * 3;
        
        // "오반!!" 텍스트 효과
        ctx.fillStyle = '#ffffff';
        ctx.font = `${40 * scale}px 'Noto Sans KR'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 20;
        ctx.fillText("오반!!", centerX, centerY - 100 + shake);
        ctx.shadowBlur = 0;
    }
    
    drawGoku(ctx, x, y, scale) {
        // 얼굴
        ctx.fillStyle = '#f8d7a6';
        ctx.beginPath();
        ctx.arc(x, y, 40 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 머리카락 (초사이어인)
        ctx.fillStyle = '#ffcc00';
        this.drawGokuHair(ctx, x, y - 30 * scale, scale);
        
        // 눈 (동그란, 놀란 표정)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x - 15 * scale, y - 5, 12 * scale, 0, Math.PI * 2);
        ctx.arc(x + 15 * scale, y - 5, 12 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 입 (벌어진)
        ctx.fillStyle = '#8b4513';
        ctx.beginPath();
        ctx.ellipse(x, y + 20 * scale, 15 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 도복
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(x - 30 * scale, y + 10 * scale, 60 * scale, 40 * scale);
    }
    
    drawPiccolo(ctx, x, y, scale) {
        // 얼굴 (녹색)
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath();
        ctx.ellipse(x, y, 40 * scale, 50 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 뿔 (두 개)
        ctx.fillStyle = '#1b5e20';
        for(let i = -1; i <= 1; i += 2) {
            ctx.beginPath();
            ctx.moveTo(x + i * 10 * scale, y - 40 * scale);
            ctx.lineTo(x + i * 25 * scale, y - 70 * scale);
            ctx.lineTo(x + i * 5 * scale, y - 40 * scale);
            ctx.closePath();
            ctx.fill();
        }
        
        // 눈 (날카로운)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(x - 25 * scale, y - 10);
        ctx.lineTo(x - 10 * scale, y - 5);
        ctx.lineTo(x - 25 * scale, y);
        ctx.closePath();
        
        ctx.moveTo(x + 10 * scale, y - 5);
        ctx.lineTo(x + 25 * scale, y);
        ctx.lineTo(x + 25 * scale, y - 10);
        ctx.closePath();
        ctx.fill();
        
        // 입 (찌푸린)
        ctx.strokeStyle = '#1b5e20';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(x - 20 * scale, y + 25);
        ctx.lineTo(x + 20 * scale, y + 25);
        ctx.stroke();
        
        // 로브
        ctx.fillStyle = '#8bc34a';
        ctx.fillRect(x - 35 * scale, y + 15 * scale, 70 * scale, 50 * scale);
    }
    
    drawSSJ2Gohan(ctx, centerX, centerY) {
        const scale = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.001;
        const time = Date.now() * 0.01;
        
        // 초사이어인2 머리카락 (더 길고 뾰족함)
        ctx.fillStyle = '#ffff00';
        this.drawSSJ2Hair(ctx, centerX, centerY - 50, scale, time);
        
        // 얼굴 (냉정한 분노)
        ctx.fillStyle = '#f8d7a6';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 50 * scale, 60 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 눈 (차갑고 매서움)
        ctx.fillStyle = '#00aaff';
        ctx.beginPath();
        // 더 날카롭게 각진 눈
        ctx.moveTo(centerX - 35 * scale, centerY - 15);
        ctx.lineTo(centerX - 50 * scale, centerY - 5);
        ctx.lineTo(centerX - 35 * scale, centerY + 10);
        ctx.lineTo(centerX - 20 * scale, centerY);
        ctx.closePath();
        
        ctx.moveTo(centerX + 20 * scale, centerY);
        ctx.lineTo(centerX + 35 * scale, centerY + 10);
        ctx.lineTo(centerX + 50 * scale, centerY - 5);
        ctx.lineTo(centerX + 35 * scale, centerY - 15);
        ctx.closePath();
        ctx.fill();
        
        // 눈동자 (빛나는)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX - 27 * scale, centerY - 2, 6 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 27 * scale, centerY - 2, 6 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 눈썹 (더 날카롭게)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(centerX - 60 * scale, centerY - 30);
        ctx.lineTo(centerX - 25 * scale, centerY - 35);
        ctx.lineTo(centerX - 60 * scale, centerY - 40);
        ctx.closePath();
        
        ctx.moveTo(centerX + 25 * scale, centerY - 35);
        ctx.lineTo(centerX + 60 * scale, centerY - 30);
        ctx.lineTo(centerX + 60 * scale, centerY - 40);
        ctx.closePath();
        ctx.fill();
        
        // 입 (단호함)
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(centerX - 20 * scale, centerY + 35);
        ctx.lineTo(centerX + 20 * scale, centerY + 35);
        ctx.stroke();
        
        // 오라 (더 강력한)
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, 250 * scale
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.2, '#ffff00');
        gradient.addColorStop(0.5, '#ff6600');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 200 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        // 번개 효과
        this.drawLightning(ctx, centerX, centerY, scale, time);
    }
    
    drawSSJ2Hair(ctx, x, y, scale, time) {
        // 초사이어인2 머리: 더 길고 뾰족하며 움직이는 효과
        ctx.fillStyle = '#ffff00';
        
        // 중앙 가닥 (가장 길게)
        ctx.beginPath();
        ctx.moveTo(x - 15 * scale, y);
        ctx.lineTo(x, y - 120 * scale + Math.sin(time) * 5);
        ctx.lineTo(x + 15 * scale, y);
        ctx.closePath();
        ctx.fill();
        
        // 측면 가닥들
        for(let i = -1; i <= 1; i += 2) {
            ctx.beginPath();
            ctx.moveTo(x + i * 25 * scale, y - 10);
            ctx.lineTo(x + i * 40 * scale, y - 90 * scale + Math.sin(time + i) * 5);
            ctx.lineTo(x + i * 15 * scale, y - 30);
            ctx.closePath();
            ctx.fill();
            
            // 뒤쪽 가닥
            ctx.beginPath();
            ctx.moveTo(x + i * 10 * scale, y);
            ctx.lineTo(x + i * 30 * scale, y - 70 * scale + Math.cos(time + i) * 5);
            ctx.lineTo(x + i * 0, y - 20);
            ctx.closePath();
            ctx.fill();
        }
        
        // 빛나는 효과
        const gradient = ctx.createLinearGradient(
            x, y - 120 * scale,
            x, y
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#ffff00');
        gradient.addColorStop(1, '#ffcc00');
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    drawLightning(ctx, centerX, centerY, scale, time) {
        // 번개 효과 그리기
        for(let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + time * 0.05;
            const length = 150 + Math.sin(time + i) * 50;
            
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2 * scale;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            
            // 번개 패스 생성
            let x = centerX;
            let y = centerY;
            const segments = 8;
            
            for(let j = 0; j < segments; j++) {
                const segmentLength = length / segments;
                const segmentAngle = angle + (Math.random() - 0.5) * 0.5;
                
                x += Math.cos(segmentAngle) * segmentLength * scale;
                y += Math.sin(segmentAngle) * segmentLength * scale;
                
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
            
            // 번개 끝 빛나는 효과
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x, y, 5 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawFinalScene(ctx, centerX, centerY) {
        const scale = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.001;
        const time = Date.now() * 0.001;
        
        // 점점 어두워지는 효과
        const fade = Math.max(0, 1 - time % 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${1 - fade * 0.5})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // 마지막으로 보이는 오반의 눈
        if(fade > 0.3) {
            ctx.fillStyle = '#00aaff';
            ctx.beginPath();
            ctx.arc(centerX - 20 * scale, centerY, 15 * scale * fade, 0, Math.PI * 2);
            ctx.arc(centerX + 20 * scale, centerY, 15 * scale * fade, 0, Math.PI * 2);
            ctx.fill();
            
            // 마지막 빛줄기
            ctx.strokeStyle = `rgba(255, 255, 255, ${fade})`;
            ctx.lineWidth = 2 * scale;
            ctx.beginPath();
            ctx.moveTo(centerX + 25 * scale, centerY - 5);
            ctx.lineTo(centerX + 40 * scale, centerY - 20 * fade);
            ctx.stroke();
        }
    }
    
    drawSceneEffects(ctx, width, height) {
        const scene = this.scenes[this.currentScene];
        const time = Date.now() * 0.001;
        
        // 씬별 특수 효과
        switch(this.currentScene) {
            case 0: // 먼지 입자
                this.drawFloatingDust(ctx, width, height, time);
                break;
            case 1: // 기계 스파크
                this.drawSparks(ctx, width * 0.5, height * 0.5, time);
                break;
            case 2: // 충격파
                this.drawImpactWave(ctx, width * 0.5, height * 0.5, time);
                break;
            case 3: // 붉은 안개
                this.drawRedMist(ctx, width, height, time);
                break;
            case 5: // 지진 효과
                this.drawScreenShake(ctx, width, height, time);
                break;
            case 7: // 전기 스파크
                this.drawElectricSparks(ctx, width, height, time);
                break;
        }
    }
    
    drawFloatingDust(ctx, width, height, time) {
        // 떠다니는 먼지 입자
        for(let i = 0; i < 30; i++) {
            const x = (Math.sin(time + i) * 0.5 + 0.5) * width;
            const y = (time * 20 + i * 50) % height;
            const size = 2 + Math.sin(time + i) * 1;
            
            ctx.fillStyle = `rgba(200, 200, 200, ${0.3 + Math.sin(time + i) * 0.2})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawSparks(ctx, x, y, time) {
        // 기계적 스파크 효과
        for(let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 30;
            const sparkX = x + Math.cos(angle) * distance;
            const sparkY = y + Math.sin(angle) * distance;
            
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 꼬리 효과
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sparkX, sparkY);
            ctx.lineTo(
                sparkX - Math.cos(angle) * 10,
                sparkY - Math.sin(angle) * 10
            );
            ctx.stroke();
        }
    }
    
    drawImpactWave(ctx, x, y, time) {
        // 충격파 원형 효과
        const radius = 50 + (time % 1) * 100;
        const alpha = 1 - (time % 1);
        
        ctx.strokeStyle = `rgba(255, 100, 100, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawRedMist(ctx, width, height, time) {
        // 붉은 안개 효과
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.1)');
        gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.5 + Math.sin(time) * 0.3;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1.0;
    }
    
    drawScreenShake(ctx, width, height, time) {
        // 화면 흔들림 효과
        const shakeX = Math.sin(time * 10) * 5;
        const shakeY = Math.cos(time * 8) * 5;
        
        ctx.translate(shakeX, shakeY);
    }
    
    drawElectricSparks(ctx, width, height, time) {
        // 전기 스파크 전체화면 효과
        for(let i = 0; i < 10; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const length = 20 + Math.random() * 30;
            
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            
            for(let j = 0; j < 3; j++) {
                const angle = Math.random() * Math.PI * 2;
                ctx.lineTo(
                    x + Math.cos(angle) * length,
                    y + Math.sin(angle) * length
                );
            }
            
            ctx.stroke();
        }
    }
    
    drawBattleDamage(ctx, centerX, centerY, scale) {
        // 상처와 먼지 효과
        ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
        for(let i = 0; i < 5; i++) {
            const x = centerX - 30 + Math.random() * 60;
            const y = centerY - 20 + Math.random() * 40;
            const size = 5 + Math.random() * 10;
            
            ctx.beginPath();
            ctx.arc(x, y, size * scale, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 상처 (붉은색)
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        for(let i = 0; i < 3; i++) {
            const x = centerX - 20 + Math.random() * 40;
            const y = centerY - 10 + Math.random() * 20;
            
            ctx.beginPath();
            ctx.ellipse(x, y, 8 * scale, 3 * scale, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawDebris(ctx, width, height) {
        // 파편 효과
        ctx.fillStyle = '#795548';
        for(let i = 0; i < 10; i++) {
            const x = Math.random() * width;
            const y = height * 0.7 + Math.random() * height * 0.2;
            const size = 5 + Math.random() * 15;
            
            ctx.beginPath();
            ctx.rect(x, y, size, size);
            ctx.fill();
        }
    }
    
    drawGroundCrack(ctx, width, height) {
        // 지면 갈라짐 효과
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 4;
        
        for(let i = 0; i < 5; i++) {
            const startX = width * 0.2 + i * width * 0.15;
            const startY = height * 0.7;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            for(let j = 0; j < 3; j++) {
                const x = startX + (Math.random() - 0.5) * 50;
                const y = startY + (j + 1) * 30;
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        }
    }
    
    drawAuraEffect(ctx, centerX, centerY) {
        const scale = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.001;
        const time = Date.now() * 0.01;
        
        // 오라 파동 효과
        for(let i = 0; i < 3; i++) {
            const radius = 80 * scale + i * 40 * scale + (time % 100) * 2;
            const alpha = 0.7 - i * 0.2;
            
            const gradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, radius
            );
            gradient.addColorStop(0, `rgba(255, 255, 0, ${alpha})`);
            gradient.addColorStop(1, `rgba(255, 100, 0, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawRedBackgroundEffect(ctx, width, height) {
        // 붉은 배경 그라데이션 효과
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#801336');
        gradient.addColorStop(0.5, '#c72c41');
        gradient.addColorStop(1, '#ee4540');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 핏빛 구름 효과
        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        for(let i = 0; i < 5; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height * 0.3;
            const size = 50 + Math.random() * 100;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawMechanicalDamage(ctx, centerX, centerY) {
        const scale = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.001;
        const time = Date.now() * 0.01;
        
        // 기계적 손상 (깨진 부분)
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3 * scale;
        
        // 머리 부분 균열
        ctx.beginPath();
        ctx.moveTo(centerX - 40 * scale, centerY - 60);
        ctx.lineTo(centerX - 20 * scale, centerY - 40);
        ctx.lineTo(centerX, centerY - 50);
        ctx.stroke();
        
        // 전기 스파크 효과 (깜빡임)
        if(Math.sin(time) > 0) {
            const sparkX = centerX - 30 * scale;
            const sparkY = centerY - 50;
            
            // 스파크 중심
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, 3 * scale, 0, Math.PI * 2);
            ctx.fill();
            
            // 스파크 줄기
            for(let i = 0; i < 3; i++) {
                const angle = Math.random() * Math.PI * 2;
                const length = 10 + Math.random() * 20;
                
                ctx.strokeStyle = '#ffff00';
                ctx.lineWidth = 1 * scale;
                ctx.beginPath();
                ctx.moveTo(sparkX, sparkY);
                ctx.lineTo(
                    sparkX + Math.cos(angle) * length * scale,
                    sparkY + Math.sin(angle) * length * scale
                );
                ctx.stroke();
            }
        }
    }
    
    drawShockwave(ctx, centerX, centerY, width, height) {
        const time = Date.now() * 0.01;
        
        // 충격파 원
        const radius = 30 + (time % 1) * 200;
        const alpha = 0.8 - (time % 1);
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // 두 번째 충격파
        if(radius > 100) {
            const radius2 = radius - 100;
            const alpha2 = alpha * 0.7;
            
            ctx.strokeStyle = `rgba(200, 200, 255, ${alpha2})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius2, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 먼지 기둥 효과
        ctx.fillStyle = `rgba(139, 69, 19, ${alpha * 0.5})`;
        for(let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            const height = 20 + Math.random() * 30;
            
            ctx.beginPath();
            ctx.ellipse(x, y, 10, height, angle, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    animate() {
        if(!this.isAnimating) return;
        
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // 화면 흔들림 리셋
        
        this.draw();
        
        // 씬 자동 전환
        const scene = this.scenes[this.currentScene];
        const sceneStartTime = performance.now();
        
        setTimeout(() => {
            this.nextScene();
            this.animate();
        }, scene.duration);
        
        requestAnimationFrame(() => this.animate());
    }
}

// 게임 시작
window.addEventListener('load', () => {
    const game = new DragonBallGame();
});
