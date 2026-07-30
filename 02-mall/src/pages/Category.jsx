import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import TopCategory from '../components/TopCategory.jsx';
import BottomHome from '../components/BottomHome.jsx';


const CATEGORY_ICONS = {
    'ALL': '🚨',
    '무기': '🪓',
    '생존·방어': '🦺',
    '의약·응급': '💊'
};

function Category(){

    let products = useSelector((state)=> state.products);

    const cat = useMemo(() =>
        [...new Set(products.map(p => p.category))]
        .map(label => ({ 
            label, 
            icon: CATEGORY_ICONS[label] ?? null,
            stock: products
                .filter(p => p.category === label)
                .reduce((sum, p) => sum + p.stock, 0)
        }))
    , [products]);



    return(
        <>
            <TopCategory />
            <div className="inner category canvas">
                <div className='warning'>
                    <div className="badge">
                        ☣
                    </div>
                    <div className="desc">
                        <small>위협 등급: 심각 (RED)</small>
                        <p>반경 2km 내 감염체 47기. 보급 서두르세요.</p>
                    </div>
                </div>

                <h3>보급 카테고리</h3>
                <ul>
                    { cat.map((a, i)=> {
                        return (
                            <li key={i}>
                                <Link to={`/category/${a.label}`}>   
                                    <span>{a.icon}</span>
                                    {a.label}
                                    <small>남은 재고 {a.stock}</small>
                                </Link>
                            </li>
                        )
                    } ) }
                </ul>
                <div className="btn-wrap">
                    <a href="" className='btn-green'>긴급 보급 패키지 확인</a>
                </div>



            </div>

            <BottomHome />
        </>
    )
}

export default Category;