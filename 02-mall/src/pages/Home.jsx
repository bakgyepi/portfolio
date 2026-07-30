import { Button, Container, Row } from 'react-bootstrap';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import TopHome from '../components/TopHome.jsx';
import MainBn from '../components/MainBn';
import PrdList from '../components/PrdList.jsx';
import BottomHome from '../components/BottomHome';


const CATEGORY_ICONS = {
    'ALL': '🚨',
    '무기': '🪓',
    '생존·방어': '🦺',
    '의약·응급': '💊'
};


function Home() {

    let products = useSelector((state)=> state.products);
    let currency = useSelector((state)=>  state.currency );

    const cat = useMemo(() =>
        ['ALL', ...new Set(products.map(p => p.category))]
        .map(label => ({ label, icon: CATEGORY_ICONS[label] ?? null }))
    , [products]);

    // 카테고리 선택/미선택
    let [selected, setSelected] = useState(null)
    const filtered = useMemo(() =>
        selected ? products.filter(p => p.category === selected) : products
    , [products, selected]);

    return (
        <>
            <TopHome />
            <MainBn />
            <div className='inner'>
                <div className="main-category">
                    { cat.map((a, i)=> {
                        return (
                            <Button key={i} onClick={() => setSelected(a.label === 'ALL' ? null : a.label)}>
                                <span>{a.icon}</span>
                                {a.label}
                            </Button>
                        )
                    } ) }
                </div>
                <div className='prdList'>
                    {filtered.map((a, i) => {
                        return (
                            <PrdList key={i} currency={currency} products={filtered[i]} i={i} />
                        )
                    })}
                </div>
            </div>

            <BottomHome />
        </>
    )
}

export default Home