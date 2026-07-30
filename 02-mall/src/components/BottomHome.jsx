import { FaIgloo, FaParachuteBox, FaVectorSquare, FaBoxOpen } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";



export default function BottomHome() {
    const location = useLocation();
    const path = location.pathname;

    return (
        <>
        <div className="btmMenu home">
            <ul>
                <li className={`${path === `/` ? "on" : ""}`}><Link to={`/`}><span><FaIgloo/></span>벙커</Link></li>
                <li className={`${path === `/category` ? "on" : ""}`}><Link to={`/category`}><span><FaVectorSquare/></span>무기고</Link></li>
                <li className={`${path === `/cart` ? "on" : ""}`}><Link to={`/cart`}><span><FaBoxOpen/></span>배낭</Link></li>
                <li className={`${path === `/map` ? "on" : ""}`}><Link to={`/map`}><span><FaParachuteBox/></span>지도</Link></li>
            </ul>
        </div>
        </>
    )
}