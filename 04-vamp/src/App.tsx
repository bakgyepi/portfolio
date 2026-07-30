import { useEffect, useRef } from 'react';

interface GameObject {
  x: number;
  y: number;
  size: number;
  speed: number;
  hp?: number;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. 플레이어 데이터
  const player = useRef<GameObject>({
    x: 400,
    y: 300,
    size: 20,
    speed: 4,
  });

  const playerDirection = useRef<'up' | 'down' | 'left' | 'right'>('down');

  // 2. 몬스터들과 총알들을 담을 저장소 (Ref)
  const enemies = useRef<GameObject[]>([]);
  const bullets = useRef<GameObject[]>([]);
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // --- 타이머 설정 (몬스터 스폰 & 자동 공격) ---
    // 1초마다 몬스터 스폰
    const spawnInterval = setInterval(() => {
      // 화면 바깥 임의의 위치에서 스폰되도록 배치
      const angle = Math.random() * Math.PI * 2;
      const distance = 500; // 화면 중앙에서 500픽셀 떨어진 바깥 구역
      const spawnX = player.current.x + Math.cos(angle) * distance;
      const spawnY = player.current.y + Math.sin(angle) * distance;

      enemies.current.push({
        x: spawnX,
        y: spawnY,
        size: 16,
        speed: 1.5, // 플레이어보다 느리게 추격
      });
    }, 1000);

    // 0.8초마다 가장 가까운 적에게 총알 발사
    const shootInterval = setInterval(() => {
      if (enemies.current.length === 0) return;

      // 가장 가까운 적 찾기
      let closestEnemy = enemies.current[0];
      let minDst = Infinity;

      enemies.current.forEach((enemy) => {
        const dst = Math.hypot(enemy.x - player.current.x, enemy.y - player.current.y);
        if (dst < minDst) {
          minDst = dst;
          closestEnemy = enemy;
        }
      });

      // 적을 향한 각도 계산 (수학 삼각함수 단골 손님!)
      const angle = Math.atan2(closestEnemy.y - player.current.y, closestEnemy.x - player.current.x);

      bullets.current.push({
        x: player.current.x,
        y: player.current.y,
        size: 6,
        speed: 7, // 총알은 빠르게!
        // 이동 방향 벡터를 미리 계산해서 넣어둡니다
        hp: angle, // 임시로 hp 공간에 각도(angle)를 저장해둡니다.
      });
    }, 800);

    // 무한 도전 무야호
    let animationFrameId: number;

    const frameX = useRef(0);
    const gameTick = useRef(0);
    gameTick.current++;
    if (gameTick.current % 10 === 0) { // 10프레임마다 다음 동작으로 전환 (속도 조절)
      frameX.current = (frameX.current + 1) % 4; // 4칸짜리 애니메이션인 경우 (0, 1, 2, 3 반복)
    }

    const gameLoop = () => {
      // [1] 플레이어 이동
      if (keys.current['w'] || keys.current['arrowup']) {
        player.current.y -= player.current.speed;
        playerDirection.current = 'up';
      }
      if (keys.current['s'] || keys.current['arrowdown']) {
        player.current.y += player.current.speed;
        playerDirection.current = 'down';
      }
      if (keys.current['a'] || keys.current['arrowleft']) {
        player.current.x -= player.current.speed;
        playerDirection.current = 'left';
      }
      if (keys.current['d'] || keys.current['arrowright']) {
        player.current.x += player.current.speed;
        playerDirection.current = 'right';
      }

      // [2] 총알 이동
      bullets.current.forEach((bullet) => {
        const angle = bullet.hp!; // 저장해둔 각도 꺼내기
        bullet.x += Math.cos(angle) * bullet.speed;
        bullet.y += Math.sin(angle) * bullet.speed;
      });

      // [3] 몬스터 이동 (플레이어를 향해 방향 계산)
      enemies.current.forEach((enemy) => {
        const angle = Math.atan2(player.current.y - enemy.y, player.current.x - enemy.x);
        enemy.x += Math.cos(angle) * enemy.speed;
        enemy.y += Math.sin(angle) * enemy.speed;
      });

      // 💥 [4] 충돌 체크 (핵심 로직!)
      // 총알과 몬스터가 부딪혔는지 검사
      bullets.current.forEach((bullet, bIdx) => {
        enemies.current.forEach((enemy, eIdx) => {
          // 두 점 사이의 거리 계산 (피타고라스 정리)
          const distance = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
          
          // 두 객체의 반지름 합보다 거리가 가까우면 부딪힌 것!
          if (distance < (bullet.size / 2 + enemy.size / 2)) {
            // 부딪혔다면 배열에서 제거 대상 마킹 (여기서는 일단 즉시 제거)
            enemies.current.splice(eIdx, 1);
            bullets.current.splice(bIdx, 1);
          }
        });
      });

      // 화면 청소
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- 그리기 작업 ---
      // 1. 플레이어 (초록 네모)
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(player.current.x - player.current.size/2, player.current.y - player.current.size/2, player.current.size, player.current.size);

      // 2. 총알 (노란 원)
      ctx.fillStyle = '#ffeb3b';
      bullets.current.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. 몬스터 (빨간 네모)
      ctx.fillStyle = '#f44336';
      enemies.current.forEach(e => {
        ctx.fillRect(e.x - e.size/2, e.y - e.size/2, e.size, e.size);
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // 청소 구역
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(spawnInterval);
      clearInterval(shootInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#222', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      <h1>Vampire Survivors React</h1>
      <p>가만히 있으면 자동으로 가장 가까운 적에게 총알이 발사됩니다!</p>
      <canvas ref={canvasRef} width={800} height={600} style={{ border: '4px solid #fff', background: '#111', borderRadius: '8px' }} />
    </div>
  );
}