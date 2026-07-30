import { useSelector, useDispatch } from "react-redux";
import { setPagetitle, setProfileImg, setDesc } from "../store";

function Setting() {
    const dispatch = useDispatch();
    const { pagetitle, profileImg, desc } = useSelector(state => state.profile);
    
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch(setProfileImg(reader.result));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="setting-component">
            <h1>설정</h1>
            <dl>
                <dt>아바타 변경</dt>
                <dd><input type="file" accept="image/*" onChange={handleImageChange} name="" id="" /></dd>
            </dl>
            <dl>
                <dt>이름 변경</dt>
                <dd><input type="text" value={pagetitle} onChange={e => dispatch(setPagetitle(e.target.value))} /></dd>
            </dl>
            <dl>
                <dt>소개 변경</dt>
                <dd><textarea value={desc} onChange={e => dispatch(setDesc(e.target.value))} /></dd>
            </dl>
        </div>
    )
}

export default Setting