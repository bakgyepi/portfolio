

// 리액트 18버전부터 생긴 기능 : automatic batching

  // setCount(1) 
  // setName(2) 
  // setValue(3)   //여기서 1번만 재렌더링됨

// state변경함수를 연달아서 3개 사용하면 재렌더링도 원래 3번 되어야하지만 
// 리액트는 똑똑하게도 재렌더링을 마지막에 1회만 처리해준다.
// 일종의 쓸데없는 재렌더링 방지기능이고 batching이라고 합니다.




// 문제는 ajax요청이나 setTimeout안에 state변경함수가 있는 경우 batching이 일어나지 않음.
// 리액트 17버전까진 그런 식으로 일관적이지 않게 동작했는데
// 18버전 이후 부터는 어디 있든 간에 재렌더링은 마지막에 1번만 된다.

    // fetch().then(() => {
    //     setCount(1)   //재렌더링됨
    //     setName(2)   //재렌더링됨
    // }) 

// batching 되는게 싫고 state변경함수 실행마다 재렌더링시키고 싶으면 flushSync라는 함수를 쓰자.


import { useState, useTransition } from 'react'

let a = new Array(10000).fill(0)

// 데이터가 10000개 들어있는 array자료를 하나 만들고, 그 갯수만큼 <div>를 생성(map)




function UseTransition(){ 
  let [name, setName] = useState('')

// 유저가 <input>에 타이핑하면 그 글자를 <div> 1만개안에 집어넣어줘야하는데
// <div> 1만개 렌더링해주느라 <input>도 많은 지연시간이 발생합니다.
// 타이핑한 결과가 바로바로 반응이 안옵니다.

  let [isPending, startTransition] = useTransition()
  
  return (
    <div>
      {/* <input type="text" onChange={ (e)=>{ setName(e.target.value) }}/> */}

      {/* 
        useTransition() 쓰면 그 자리에 [변수, 함수]가 남는다
        startTransition() 함수로 state변경함수 같은걸 묶으면 다른 코드들보다 나중에 처리해준다 

        처리에 오래걸리는 함수는 useTransition 써라~~~
      */}

      <input onChange={ (e)=>{ 
        startTransition(()=>{
          setName(e.target.value) 
        })
      }}/>


      {
        isPending ? "로딩중기다리셈" :
        a.map(()=>{
          return <div>{name}</div>
        })
      } 
    </div>
  )
}

export default UseTransition