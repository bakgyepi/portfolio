import { Link } from 'react-router-dom';

export default function BottomCart(props) {
    let tot = Number(props.totalPay) + 9900
    return (
        <div className="btmMenu cart">
            <div className="canvas">
                <table>
                    <tbody>
                        <tr>
                            <th>소계</th>
                            <td>{ props.currency } { props.totalPay.toLocaleString() }</td>
                        </tr>
                        <tr>
                            <th>드론 배송비</th>
                            <td>{ props.currency } 9,900</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>합계</th>
                            <td>{ props.currency } {tot.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
                <Link to="/pay">결제 - 살아서 받기</Link>
            </div>
        </div>
    )
}