import { useMemo } from 'react'

function 함수(){
  return 반복문10억번돌린결과
}

function UseMemo(){ 

  let [count, setCount] = useState(0)
  let result = useMemo(()=>{ return 함수() }, [])

    // useMemo는 컴포넌트 로드시 1회만 실행하고 싶은 코드가 있으면 거기 담는다.

  // 반복문을 10억번 돌려야하는 경우 -> 그 함수를 useMemo 안에 넣어두면 컴포넌트 로드시 1회만 실행
  // 그럼 재렌더링마다 동작안하니까 좀 효율적으로 동작함!
  // useEffect 처럼 dependency도 넣을 수 있어서 특정 state, props가 변할 때만 실행할 수도~

  return (
    <>
        <Child />
        { count }
        <button onClick={()=>{ setCount(count+1) }}> + </button>
    </>
  )
}

export default UseMemo