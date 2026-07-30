import main1 from '../assets/main/main1.png'
import main2 from '../assets/main/main2.png'
import main3 from '../assets/main/main3.png'

function MainBn() {
    return (
        <div className="banner">
            <div className="main-bg">
                <div className="percent">-72%</div>
                <div className="textBox">
                    <h6>금주의 생존 특가</h6>
                    <h4>물려도  <span>안 죽어요</span> <br/>생존세트</h4>
                    <p>방검복 + 도끼 + 항생제까지, 한번에 챙기자 - 두번은 없으니까.</p>
                </div>
                <div className="imgBox">
                    <img src={main1} alt="" />
                    <img src={main2} alt="" />
                    <img src={main3} alt="" />
                </div>
            </div>
        </div>
    )
}

export default MainBn