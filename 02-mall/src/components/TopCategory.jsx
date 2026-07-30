import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaBoxOpen, FaCog } from "react-icons/fa";

function Menu(){

  // redux : 장바구니에 담긴 상품 수량 표시
  let cart = useSelector((state)=>  state.cart )

  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };

    tick(); // 마운트 시 즉시 실행
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer); // 언마운트 시 정리
  }, []);

    return(
    <>
      <div className='top-info'>
        <span>{time}</span>
        <small>생존자 1,204명 접속</small>
      </div>
      <Navbar expand="lg">
          <Navbar.Brand as={Link} to="/">LAST STORAGE</Navbar.Brand>
          <Navbar id="basic-navbar-nav"  className="justify-content-end">
            <Nav className="justify-content-end">
              <Nav.Item>
                <Nav.Link as={Link} to="/cart"><FaBoxOpen /><span className='cart-num'>{cart.length}</span></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/my"><FaCog /></Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar>
      </Navbar>
    </>
    )
}

export default Menu