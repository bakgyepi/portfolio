import { useSelector } from "react-redux";
import defaultImg from './../asset/profile.png';


export default function Profile() {
    const { pagetitle, profileImg, desc } = useSelector(state => state.profile);

    return(
        <div className="profile-container">
            <header>
                <div className='profile-img'>
                    <img src={ profileImg || defaultImg } alt={pagetitle} />
                </div>
                <div className='profile-text'>
                    <label htmlFor="">Name</label>
                    <p className="title">{ pagetitle }</p>
                    <label htmlFor="">Description</label>
                    <p className="subtitle">{ desc }</p>
                </div>
            </header>
        </div>
    )
}