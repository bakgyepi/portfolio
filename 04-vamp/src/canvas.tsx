import { useEffect, useRef } from 'react';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. 플레이어의 상태를 레퍼런스(Ref)로 관리합니다. 
  // (게임은 1초에 60번 넘게 바뀌므로 useState를 쓰면 리렌더링 때문에 폭발합니다!)
  const player = useRef({
    x: 400,
    y: 300,
    size: 20,
    speed: 5,
  });

  // 누르고 있는 키보드 저장소
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 키보드 이벤트 등록
    const handleKeyDown = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 🌟 무한 반복되는 게임 루프 (초당 60번 실행)
    let animationFrameId: number;
    
    const gameLoop = () => {
      // 1. 플레이어 이동 로직
      if (keys.current['w'] || keys.current['arrowup']) player.current.y -= player.current.speed;
      if (keys.current['s'] || keys.current['arrowdown']) player.current.y += player.current.speed;
      if (keys.current['a'] || keys.current['arrowleft']) player.current.x -= player.current.speed;
      if (keys.current['d'] || keys.current['arrowright']) player.current.x += player.current.speed;

      // 2. 화면 화면 싹 지우기 (매 프레임마다 새로 그려야 하므로)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 3. 플레이어 캐릭터(초록색 네모) 그리기
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(
        player.current.x - player.current.size / 2,
        player.current.y - player.current.size / 2,
        player.current.size,
        player.current.size
      );

      // 다음 프레임 실행
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    // 루프 시작!
    gameLoop();

    // 컴포넌트가 화면에서 사라질 때(언마운트) 이벤트 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#222', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      <h1>Vampire Survivors React</h1>
      <p>WASD 또는 방향키로 움직여보세요!</p>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '4px solid #fff', background: '#111', borderRadius: '8px' }}
      />
    </div>
  );
}