import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { 수량감소, 수량증가, 수량삭제, selectTotalWeight, selectTotalPay, hideModal, showModal } from './../store/index.jsx'

import BottomCart from '../components/BottomCart.jsx';

// redux 사용하면 컴포넌트들이 props 없이 state 공유 가능

function Cart(){
    const navigate = useNavigate();
    let dispatch = useDispatch(); // store.js에 요청을 보내주는 함수가 dispatch

    useEffect(() => {
        dispatch(hideModal());
    }, []);



    // 아무 컴포넌트에서 useSelector((state) => { return state } ) 쓰면 store에 있던 모든 state가 그 자리에 남음.
    //let a = useSelector((state)=>  state )

    let cart = useSelector((state)=>  state.cart );
    let currency = useSelector((state)=>  state.currency );
    let isModal = useSelector((state) => state.modal);
    let [deleteId, setDeleteId] = useState(null);  // 삭제할 id 저장
    let weight = useSelector(selectTotalWeight);
    weight = weight / 1000;

    const bgWidth = Math.min(weight / 12 * 100, 100) + "%";
    
    let totalPay = useSelector(selectTotalPay);

    return(
        <>


        {isModal && (
            // React Bootstrap의 Modal : 
            // 일반 컴포넌트는 조건부 렌더링만으로 충분하지만, 
            // Modal은 애니메이션 때문에 내부적으로 show prop을 기준으로 표시 여부를 제어함.
            <Modal show={isModal} onHide={() => dispatch(hideModal())}>
                <Modal.Header closeButton>
                    <Modal.Title>삭제하시겠습니까?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=> dispatch(hideModal()) }>아니오</Button>
                    <Button variant="primary" onClick={()=>{ dispatch(수량삭제(deleteId)); dispatch(hideModal()); }}>삭제하기</Button>
                </Modal.Footer>
            </Modal>
        )}


        <div className="inner cart">
            <div className="menuTitle">
                <button onClick={() => navigate(-1)}>
                    &lt;
                </button>
                <h2>내 배낭</h2>
                <p>
                    총 <span>{cart.length}</span>개 · { weight } kg
                </p>
            </div>
            <div className="canvas">
                <div className="weightBar">
                    <div className="desc">
                        <h6>적재하중</h6>
                        <p>{ weight } kg / 12kg</p>
                    </div>
                    <div className='weight'>
                        <div className='on' style={{width: bgWidth}}></div>
                        <div className='bg'></div>
                    </div>
                </div>

                <table>
                    <tbody>
                        {cart.length < 1
                            ? <tr><td colSpan="4">
                                <p className="no-data">
                                    <span>배낭에 담긴 상품이 없습니다.</span>
                                    <Link to="/">배낭 채우고 살아남기</Link>
                                </p> 
                                
                                </td></tr>
                            : cart.map((b) =>{
                                return(
                                    <tr key={b.id}>
                                        <td>
                                            <img src={import.meta.env.BASE_URL + 'assets/products/prd_' + b.id + '.png'} width="100%" />
                                        </td>
                                        <td>
                                            <p>{ b.name }</p>
                                            <span className='price'>{currency} { b.price.toLocaleString() }</span>
                                        </td>
                                        <td>
                                            <div className="btn-wrap">

                                                <span className='btn-del' onClick={()=>{dispatch(showModal()); setDeleteId(b.id);}}>삭제</span>
                                                <div className="btn-count">
                                                    <button onClick={()=>{dispatch(수량감소(b.id))}}> - </button>
                                                    <span>{ b.count }</span>
                                                    <button onClick={()=>{dispatch(수량증가(b.id))}}> + </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                        )
                                
                        }
                    </tbody>
                </table>
            </div>
        </div>
        <BottomCart currency={currency} totalPay={totalPay}/>
        </>
    )
}

export default Cart