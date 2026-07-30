import { createContext, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom';

import './App.scss'

import Home from './pages/Home';
import Category from './pages/Category';
import CategoryList from './pages/CategoryList';
import Detail from './pages/Detail';
import Cart from './pages/Cart';
import Pay from './pages/Pay';
import Drop from './pages/Drop';
import Map from './pages/Map';

export const Context1 = createContext();  // context는 state 보관함이다

function App() {
  useEffect(()=>{
    // 컴포넌트 첫 렌더링 시 실행
    localStorage.setItem('watched', JSON.stringify([]));
    console.log("초기 세팅 : " + localStorage.getItem('watched'));
  },[])

  let obj = {name : 'kim'}
  // localStorage.setItem('data', obj) <- 문법 오류, 로컬스토리지는 문자열만 저장 가능함~~
  localStorage.setItem('data', JSON.stringify(obj));
  let savedData = localStorage.getItem('data');
  let parsedData = JSON.parse(savedData);
  console.log(parsedData.name); // 콘솔에 'kim' 출력

  //let [shoes, setShoes] = useState(data);
  let [재고] = useState([10, 11, 13, 12, 14])

  return (
    <>
      <div className="ls-store">

        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/detail/:id" element={
            <Context1.Provider value={{ 재고 }}>
              <Detail/>
            </Context1.Provider>
          } /> 
          <Route path="/category" element={<Category />} />
          <Route path="/category/:label" element={<CategoryList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/drop" element={<Drop />} />
          <Route path="/map" element={<Map />} />
          <Route path="*" element={<div>no page!</div>} />
        </Routes>


        {/* <button onClick={() => {
          console.log('clickCount : ', clickCount);
          setClickCount(clickCount + 1);
          {
            clickCount < 3 ? 
            axios.get("https://codingapple1.github.io/shop/data2.json").then((result) => {
              console.log(result.data, ...result.data);
              // 기본값 : []
              // 변경 후 : [data1, data2, data3, data4, data5, data6]
              let copy = [...shoes, ...result.data];
              setShoes(copy);
            })
            .catch(()=>{
              console.log('실패함');
            })
            : alert('상품이 없습니다.')
          }

        }}>  더보기..</button> */}
      </div>
    </>
  )
}

export default App
