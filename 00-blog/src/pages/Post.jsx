import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {Link} from 'react-router-dom';

function Post() {
    const { posts } = useSelector(state => state.post);
    const { id } = useParams();
    const post = posts.find((post) => post.id === Number(id));
    
    if (!post) {
        return <div>Post not found</div>;
    }
    
    return(
        <div className="post-component">
            <div className="post-title">
                <Link to="/" className="back">←</Link>
                <h1>{post.title} <span className="date">{post.date}</span></h1>
            </div>
            <img src={post.img} alt={post.title} />
            <p className="description">{post.desc}</p>
        </div>
    )
}

export default Post;
