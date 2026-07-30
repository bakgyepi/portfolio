import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { selectTotalPay } from './../store/index.jsx'

import BottomPay from '../components/BottomPay';

function Pay (){
    const navigate = useNavigate();
    let currency = useSelector((state)=>  state.currency );
    let cart = useSelector((state)=>  state.cart );
    let totalPay = useSelector(selectTotalPay);
    let TT = 0;
    if (totalPay > 20000) {
        TT = totalPay - 20000;
    }else {
        TT = 0;
    }

    const [payment, setPayment] = useState('payment1');
    const [delivery, setDelivery] = useState('delivery1');

    return(
        <>
            <div className="inner pay">
                <div className="menuTitle">
                    <button onClick={() => navigate(-1)}>
                        &lt;
                    </button>
                    <h2>결제</h2>
                </div>
                <div className="canvas">
                    <h4>투하 지점</h4>
                    <div className="points">
                        <ul>
                            <li><input type="radio" name="delivery" id="delivery1" 
                            checked={delivery === 'delivery1'}
                            onChange={() => setDelivery('delivery1')} /> <label htmlFor="delivery1">옥상 헬리패드 · 안전가옥 B동</label></li>
                            <li><input type="radio" name="delivery" id="delivery2" 
                            checked={delivery === 'delivery2'}
                            onChange={() => setDelivery('delivery2')} /> <label htmlFor="delivery2">지하 벙커 입구</label></li>
                        </ul>
                        <small>⚠ 투하 후 30초 내 회수 요망. 소음에 몰려옴.</small>
                    </div>
                    <h4>결제 수단</h4>
                    <div className="payment">
                        <ul>
                            <li>
                                <input type="radio" name="payment" id="payment1" 
                                checked={payment === 'payment1'}
                                onChange={() => setPayment('payment1')} /> 
                                <label htmlFor="payment1">배급 포인트</label>
                            </li>
                            <li>
                                <input type="radio" name="payment" id="payment2" 
                                checked={payment === 'payment2'}
                                onChange={() => setPayment('payment2')} /> 
                                <label htmlFor="payment2">물물교환 (통조림·탄약)</label>
                            </li>
                            <li>
                                <input type="radio" name="payment" id="payment3" 
                                checked={payment === 'payment3'}
                                onChange={() => setPayment('payment3')} /> 
                                <label htmlFor="payment3">금/귀금속</label>
                            </li>
                        </ul>
                    </div>

                    <div className="totalPrice">
                        <table>
                            <tbody>
                                <tr>
                                    <th>상품 총 {cart.length}개</th>
                                    <td>{ currency } { totalPay.toLocaleString() }</td>
                                </tr>
                                <tr>
                                    <th>드론 배송비</th>
                                    <td>{ currency } 9,900</td>
                                </tr>
                                <tr>
                                    <th>생존자 할인</th>
                                    <td>- { currency } 20,000</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>최종결제금액</th>
                                    <td>{ currency } { TT.toLocaleString() }</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                </div>
            </div>
            <BottomPay />
        </>
    )
}

export default Pay