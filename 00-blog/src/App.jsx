import { useState } from 'react'
import { useSelector } from "react-redux";
import { useLocation } from 'react-router-dom'
import Router from './router'
import './App.scss'
import Menu from './components/Menu.jsx'
import Profile from './components/Profile.jsx'

function App() {
  const location = useLocation()
  const { pagetitle } = useSelector(state => state.profile);

  let [modal, setModal] = useState(false);
  let [alert, setAlert] = useState("");

  return (
    <>
      <div className='main'>
        <div className='page'>
          <div className="page-title">
            <p>{ pagetitle }의 공간</p>
            <button className="btn-box-wh" onClick={() => setAlert("안 닫히지롱")}>X</button>
          </div>
          <Menu />
          <div className="page-inner">
            {location.pathname !== '/setting' && <Profile /> }
            <Router />
          </div>
        </div>
        { modal && <Modal setModal={setModal}/> }
        { alert && <Alert message={alert} onClose={() => setAlert("")} /> }
      </div>
    </>
  )
}

function Modal(props) {
  return (
    <div className='modal-background' onClick={() => props.setModal(false)}>
      <div className="modal">
        나와쪼
      </div>
    </div>
  )
}

export default App