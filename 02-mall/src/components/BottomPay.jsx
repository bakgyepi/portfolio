import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from '../store/index.jsx';
import { useNavigate } from 'react-router-dom';

export default function BottomPay() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);

    const handlePay = () => {
        dispatch(addOrder({ id: Date.now(), items: cart, status: '배송중' }));
        navigate('/drop');
    }
    return (
        <div className="btmMenu pay">
            <div className="canvas">
                <button onClick={handlePay}>결제하고 살아남기</button>
                <small>환불 불가 · 인류 멸망 시 보상 없음</small>
            </div>
        </div>
    )
}