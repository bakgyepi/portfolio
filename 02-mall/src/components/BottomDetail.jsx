import { FaRegHeart } from "react-icons/fa";
import { Toast } from 'react-bootstrap';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { 장바구니추가, selectTotalWeight, showModal } from './../store/index.jsx'

export default function BottomDetail({product }) {
    let dispatch = useDispatch();
    let weight = useSelector(selectTotalWeight);

    const cartItem = useSelector((state) =>
        state.cart.find((i) => i.id === product.id)
    );
    const cartCount = cartItem ? cartItem.count : 0;

    const [toast, setToast] = useState({ show: false, msg: '' })
    const showToast = (msg) => {
        setToast({ show: true, msg });
        setTimeout(() => setToast({ show: false, msg: '' }), 3000);
    };

    return (
        <>

        {toast.show && (
            <div className="ui-toast">
                <p><span>{toast.msg}</span></p>
            </div>
        )}

        <div className="btmMenu">
            <div className="btn-detail">
                <button className='heart'>
                    <FaRegHeart />
                </button>
                <button className='order'
                onClick={()=>{
                    if ( weight + product.weight > 12000) {
                        showToast('배낭 무게 12kg를 초과했습니다.');
                        return;
                    }
                    if ( product.stock < 1 ) {
                        showToast('재고가 없습니다.');
                        return;
                    }
                    if ( cartCount >= product.stock ) {
                        showToast('재고가 부족합니다!');
                        return;
                    }
                    dispatch(장바구니추가({ id: product.id, name: product.title, count: 1, stock: product.stock, weight: product.weight, price: product.price}))
                    dispatch(showModal());
                }}
                >배낭에 담기</button>
            </div>
        </div>
        </>
    )
}