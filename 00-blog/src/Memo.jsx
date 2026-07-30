import {memo, useState, useMemo} from 'react'


// memo 사용하지 않음 : 부모 컴포넌트가 재랜더링 되면, 종속되어있는 자식 컴포넌트까지 재랜더링된다.

function Child(){
  console.log('재렌더링됨')
  return <div>자식임</div>
}


// memo 사용 :  부모 컴포넌트가 재랜더링 되더라도, 자식 컴포넌트는 렌더링되지 않는다.

// let Child = memo( function(){
//   console.log('재렌더링됨')
//   return <div>자식임</div>
// })



function Memo(){ 

  let [count, setCount] = useState(0)
  let result = useMemo(()=>{ return 함수() }, [])

  return (
    <>
      <h3>메모 사용하기</h3>
        <Child />
        { count }
        <button onClick={()=>{ setCount(count+1) }}> + </button>
    </>
  )
}

export default Memo