import { Link } from 'react-router-dom';

function PrdList(props){
  // 상위파일인 Home.jsx에서 redux로 받음 -> PrdList.jsx에서 props로 받음
  return (
    <div className='item' key={ props.products.id }>
      <Link to={`/detail/${props.products.id}`}>
        <img src={import.meta.env.BASE_URL + 'assets/products/prd_' + props.products.id + '.png'} width="100%" />
      </Link>
      <h6>{ props.products.title }</h6>
      <p>{props.currency} { props.products.price.toLocaleString() }</p>
    </div>
  )
}

export default PrdList