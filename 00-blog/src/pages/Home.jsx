import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Home() {
  const { posts } = useSelector(state => state.post);
  const navigate = useNavigate();

    return (
        <div className='list-container'>
            {posts.map(function (a, i) {
              return (
                <div className="list" key={i}>
                  <img src={a.img} alt="{a.title}" onClick={() => navigate(`/post/${a.id}`)} />
                  <div className='list-content'>
                    <h4 onClick={() => navigate(`/post/${a.id}`)}>
                      {a.title}
                      <span className='btn-box-wh' onClick={(e) => {
                        e.stopPropagation();
                        let copy = [...posts];
                        copy[i] = { ...copy[i], like: a.like + 1 };
                        setPosts(copy);
                      }}>👍🏻 {a.like}</span> 
                    </h4>
                    <p>{a.date}</p>
                  </div>
                </div>
              )
            })}
        </div>
    )
}

export default Home