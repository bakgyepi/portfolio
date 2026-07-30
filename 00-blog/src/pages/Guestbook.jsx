import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import Alert from "../components/Alert.jsx";
import { createPortal } from "react-dom";

function Guestbook() {
    const [entries, setEntries] = useState([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchEntries = async () => {
        const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "guestbook", id));
        setEntries(entries.filter(e => e.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        setLoading(true);
        await addDoc(collection(db, "guestbook"), {
            name,
            message,
            createdAt: new Date()
        });
        setName("");
        setMessage("");
        await fetchEntries();
        setLoading(false);
    };
 

    return (
        <>

            <div className="guestbook-component">
                <h1>Guest Book</h1>
                <h2>방명록을 자유롭게 쓰세요. <br />자기 자신에게 하듯, 좋은 말만 남기세요.</h2>
                <ul className="guestbook-list">
                    {entries.map(entry => (
                        <li key={entry.id}>
                            <button onClick={()=>setDeleteTarget(entry.id)}>X</button>
                            <span>😮 {entry.name}</span>
                            <div>{entry.message}</div>
                        </li>
                    ))}
                </ul>

                <form onSubmit={handleSubmit}>
                    <div className="form-box">
                        <dl>
                            <dt>이름</dt>
                            <dd>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="이름"
                                />
                            </dd>
                        </dl>
                        <dl>
                            <dt>내용</dt>
                            <dd>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="메시지를 남겨주세요"
                                />
                            </dd>
                        </dl>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "등록 중..." : "등록"}
                    </button>
                </form>
            </div>
            { deleteTarget && createPortal(
            <Alert
                message={<>정말 삭제할까요?<br />다른 사람의 글을 삭제할 수도 있어요!</>}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                handleDelete(deleteTarget);  // deleteTarget에 저장된 id로 삭제
                setDeleteTarget(null);       // 알럿 닫기
                }}
            />, document.body
            )}
        </>


    );
}

export default Guestbook;
