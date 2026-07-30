import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';


const CATEGORY_ICONS = {
    'ALL': '🚨',
    '무기': '🪓',
    '생존·방어': '🦺',
    '의약·응급': '💊'
};

function Category(){
    const { label } = useParams();
    const navigate = useNavigate();

    let currency = useSelector((state)=> state.currency);
    let dispatch = useDispatch();
    
    let products = useSelector((state)=> state.products);

    const filtered = useMemo(() =>
        products.filter(p => p.category === label)
    , [products, label]);


    return(
        <>
        <div className="inner categoryList">
            <div className="menuTitle">
                <button onClick={() => navigate(-1)}>
                    &lt;
                </button>
                <h2>{label}</h2>
                <p>
                    {filtered.length}개 품목
                </p>
            </div>

            <div className="canvas">
                <ul>
                    {filtered.map(item => (
                    <li key={item.id}>
                        <Link to={`/detail/${item.id}`}>
                        <figure>
                            <img src={`../src/assets/products/prd_${item.id}.png`} />
                        </figure>
                        <div className="productInfo">
                            <p>{item.title}</p>
                            <div className='chips'>
                                <small>무게 {item.weight}g</small>
                                <small className={item.stock < 5 ? 'low' : ''}>재고 {item.stock}개</small>
                            </div>
                            <span className="price">{currency} {item.price.toLocaleString()}</span>
                        </div>
                        </Link>
                        {/* <button
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(addCart(item));
                        }}
                        >
                        장바구니에 담기
                        </button> */}
                    </li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    )
}

export default Category;