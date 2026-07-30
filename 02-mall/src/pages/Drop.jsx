import { Link } from "react-router-dom";

export default function Drop(){
    return (
        <div className="completeMsg canvas">
            <div className="drone-msg">
                <figure><span>🪂</span></figure>
                <h3>보급요청<br />접수완료</h3>
                <p>
                    드론이 당신의 옥상으로 출발했습니다. <br />
                    부디 살아서 받으세요.
                </p>
                <small>예상 투하: 14분 · 주문번호 #LM-2026-0612</small>
            </div>
            <div className="drone-loc">
                <div className="top">
                    <span>드론 추적</span>
                    <small>● 비행 중</small>
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
            <Link to="/map" className="btn-loc">배송 실시간 위치 추적</Link>
        </div>
    )
}