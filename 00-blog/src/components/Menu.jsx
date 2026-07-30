import { Link } from 'react-router-dom'

function Menu(){
    return(
        <div className="menu-container">
            <nav>
                <ul>
                <li>
                    <Link to="/">홈</Link>
                </li>
                <li>
                    <Link to="/profile">프로필</Link>
                </li>
                <li>
                    <Link to="/guestbook">방명록</Link>
                </li>
                <li>
                    <Link to="/setting">설정</Link>
                </li>
                </ul>
            </nav>
        </div>
    )
}

export default Menu