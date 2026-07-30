
import BottomHome from '../components/BottomHome';
import { useSelector } from 'react-redux';

function Map() {
    const orders = useSelector((state) => state.orders);
    const hasOrder = orders.length > 0;
    console.log('orders.length : ', orders.length )

    return (
        <>
            <div className="inner map">
                <div className="menuTitle">
                    <button onClick={() => navigate(-1)}>
                        &lt;
                    </button>
                    <h2>배송 추적</h2>
                </div>
                {hasOrder ? <DeliveryMap orders={orders} /> : <NoOrder />}
            </div>

            <BottomHome />

        </>
    )
}

function DeliveryMap({ orders }) {
    const latest = orders[orders.length - 1];

    return (
        <div className="delivery-map">
            <div className="bg"></div>
            <div className="circle1"></div>
            <div className="circle2"></div>
            <div className="yes-data">
                <div className="map-placeholder">
                    <svg viewBox="0 20 390 520" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                        <path d="M 70 460 C 140 380, 110 280, 190 220 S 300 120, 320 70" fill="none" stroke="#aaff00" strokeWidth="2" strokeDasharray="6 8" opacity="0.7" />
                    </svg>
                    <div className="you">
                        <span>📍</span>
                        <small>당신의 옥상</small>
                    </div>
                    <div className='drone'>
                        <span>🚁</span>
                        <small>{latest.status}</small>
                    </div>

                    <div className="me">
                        <span>📦</span>
                        <small>창고 SECTOR-7</small>
                    </div>
                </div>
            </div>
            <div className="order-info">
                <div className="drone-loc">
                    <div className="top">
                        <h6>
                            {latest.items.length === 1 ? (
                                <>
                                    <span>{latest.items[0].name}</span>
                                    <span>{latest.items[0].count}개</span>
                                </>
                            ) : (
                                <>
                                    <span>{latest.items[0].name}</span>
                                    <span>{latest.items[0].count}개</span>
                                    <span> 외 {latest.items.length - 1}개</span>
                                </>
                            )}
                        </h6>
                        <p>{latest.status}</p>
                    </div>
                    <div className="point">
                        <div className="home">
                            <span>●</span>
                            <small>창고</small>
                        </div>
                        <div className="line">
                            <div className="progress"></div>
                        </div>
                        <div className="drone">🚁</div>
                        <div className="line">
                        </div>
                        <div className="you">
                            <span>○</span>
                            <small>당신</small>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

function NoOrder() {
    return (
        <div className="delivery-map">
            <div className="bg"></div>
            <div className="circle1"></div>
            <div className="circle2"></div>
            <div className="no-data">
                <figure>🛰️</figure>
                <h2>추적 중인 보급이 <br /> 없습니다</h2>
                <p>아직 아무것도 주문 안 하셨네요. <br />그러다 죽어도 책임 안짐.</p>
            </div>
            
        </div>
    )
}

export default Map;
