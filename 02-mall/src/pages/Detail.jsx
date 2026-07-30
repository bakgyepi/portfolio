import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 장바구니추가, hideModal, showModal } from './../store/index.jsx';
import { Modal, Button, Toast } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaRegHeart } from "react-icons/fa";

import { Context1 } from './../App.jsx'
import BottomDetail from './../components/BottomDetail.jsx'

function Detail() {
    let { id } = useParams();
    let navigate = useNavigate();
    let dispatch = useDispatch();

    // context api 보관함 해체
    //let { 재고 } = useContext(Context1)

    let currency = useSelector((state)=>  state.currency );
    let products = useSelector((state)=>  state.products );
    let product = products.find((s) => s.id === Number(id));

    if (!product) {
        return <div>상품을 찾을 수 없습니다.</div>;
    }

    let weight = product.weight / 1000;
    weight = weight.toLocaleString();


    //let [showModal, setShowModal] = useState(false);
    let isModal = useSelector((state) => state.modal);
    let [yellow, setYellow] = useState(true);

    useEffect(()=>{
        //여기 적은 코드는 컴포넌트 로드 & 업데이트 마다 실행됨
        let a = setTimeout(() => {
            console.log('2초 지남~');
            setYellow(false);

        }, 2000);

        return()=>{
            // unmount시 1회 코드 실행하고 싶으면 return
            // cleanup function은 mount시 실행 안되고, unmount시 실행된다.
            // useEffect가 실행되기 "전"에 뭘 실행하고 싶으면 return
            // 기존 타이머는 제거해주세요 라는 의미의 코드 넣으면 여러개의 타이머 생성을 막음
            clearTimeout(a);
            // 다른 예시 : 서버로 데이터 요청보내고 기다리는 중에 재 렌더링이 된다면? -> 기존 데이터 요청은 삭제해주세요
        }
    }, []); 
    // dependency array: 
    // 아무것도 안쓰면 -> 컴포넌트 렌더링 && 재렌더링 될때마다 실행
    // [] 빈 배열로 -> 컴포넌트 첫 렌더링(마운트) 때만 실행됨. 
    // [state] -> 이 state가 변경될때마다 실행

    // array자료.find(()=>{ return 조건식 }) 
    // 이렇게 쓰면 조건식에 맞는 자료를 찾아서 이 자리에 남겨줌.
    // 여기서 s는 shoes 배열을 순회할 때 각 요소 하나하나를 가리키는 임시 변수

    // shoes의 id와 URL에서 꺼낸 id가 같은 요소를 찾아 shoe 변수에 할당한다.
    // index로 접근할 경우, state의 배열이 달라질때마다(정렬하거나..) 원하는 상품이 보이지 않을 수도 있다. -> 되도록 id로 접근하는 것이 좋다.
    //console.log(id); //useParams()로 URL에서 꺼낸 값은 항상 문자열이라, Number()로 변환 해줘야한다.

    let [tab, setTab] = useState(0);
    let [fade, setFade] = useState('');

    useEffect(()=>{
        setTimeout(()=>{ setFade('end') }, 100);
    return ()=>{
        setFade('');
    }
    }, [tab])

    useEffect(()=>{
        let getWatched = JSON.parse(localStorage.getItem('watched'));
        let nowWatched = JSON.parse(id);
        getWatched.push(nowWatched);

        getWatched = new Set(getWatched); // 중복제거
        getWatched = Array.from(getWatched); // 다시 배열로 만들기
        localStorage.setItem('watched', JSON.stringify(getWatched));
        console.log("추가한 값 뭐야 : " + getWatched);
    },[])

    return (
        <>
    
        <Modal show={isModal} onHide={() => dispatch(hideModal())}>
            <Modal.Header closeButton>
                <Modal.Title>배낭에 추가되었습니다</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=> dispatch(hideModal()) }>더 쇼핑하기</Button>
                <Button variant="primary" onClick={()=>{ navigate('/cart') }}>배낭으로 이동</Button>
            </Modal.Footer>
        </Modal>

        <div className="inner detail">
            <div className="top">
                <Link to="/">
                    <FaArrowLeft />
                </Link>
                <button>
                    <FaRegHeart />
                </button>
            </div>
            <div className="imgBox">
                <img src={import.meta.env.BASE_URL + 'assets/products/prd_' + product.id + '.png'} width="100%" />
                <span>잔여 {product.stock}개</span>
            </div>
            <div className="textBox">
                <h6>{ product.category }</h6>
                <h3>{ product.title }</h3>
                <p className="review">
                    { product.review } <span>생존자 후기 { product.reviewCount }</span>
                </p>
                <p className="price">{ currency }{ product.price.toLocaleString() }</p>
                <p className="desc">{ product.content }</p>

                <ul className="summary">
                    <li>
                        { weight }kg
                        <span>무게</span>
                    </li>
                    <li>
                        ★★★★★
                        <span>내구도</span>
                    </li>
                    <li>
                        무소음
                        <span>소음도</span>
                    </li>
                </ul>

                <div className="disclaimer">
                    <h6>🚨 판매자 면책조항</h6>
                    <p>{ product.indemnity }</p>
                </div>
                
            </div>
        </div>
        <div className="inner">
            {/* <ButtonGroup aria-label="Basic example">
                <Button variant="outline-light" onClick={()=>{setTab(0);}}>Details</Button>
                <Button variant="outline-light" onClick={()=>{setTab(1);}}>Reviews</Button>
                <Button variant="outline-light" onClick={()=>{setTab(2);}}>Shipping</Button>
            </ButtonGroup>


            <div className={'start ' + fade }>
                {tab == 0 && <div>{재고[0]}</div>}
                {tab == 1 && <div>버튼2 내용</div>}
                {tab == 2 && <div>버튼3 내용</div>}
            </div> */}

        </div>

        <BottomDetail 장바구니추가={장바구니추가} product={product} showModal={showModal}/>

      </>
    )
}

export default Detail