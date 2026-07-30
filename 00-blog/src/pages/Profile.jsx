function Profile() {
    return (
        <div className="profile-component">
            <div className="inner">
                <h2>Profile</h2>
                <dl>
                    <dt>Name</dt>
                    <dd><input type="text" value="박계피" readOnly /></dd>
                    <dt>Birth</dt>
                    <dd><input type="text" value="1991.10.09" readOnly /></dd>
                </dl>
                <dl>
                    <dt>Gender</dt>
                    <dd><input type="text" value="여성" readOnly /></dd>
                    <dt>Address</dt>
                    <dd><input type="text" value="서울특별시 마포구" readOnly /></dd>
                </dl>
                <dl>
                    <dt>Job</dt>
                    <dd><input type="text" value="프론트엔드 개발자, UI 디자이너" readOnly /></dd>
                </dl>
            </div>
            <div className="inner">
                <h2>Career description</h2>
                <div className="table-wrap">
                    <table>
                        <colgroup>
                            <col width="29%"/>
                            <col width="*"/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>기간</th>
                                <th>프로젝트명 & 기술</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>2026.04 ~ 2026.07</td>
                            <td>수자원공사 디지털플랫폼 구축사업 <br/> 프론트엔드</td>
                            </tr>
                            <tr>
                            <td>2025.07 ~ 2026.03</td>
                            <td>롯테카드 띵 콘텐츠 운영 <br/> 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2024.10 ~ 2025.01</td>
                            <td>SK MNS 베네피아 프로모션 마케팅 운영 <br/>피그마, 자바스크립트</td>
                            </tr>
                            <tr>
                            <td>2024.04 ~ 2024.10</td>
                            <td>대웅제약 CGBIO 프로모션 마케팅 운영 <br/>마케팅 콘텐츠 디자인</td>
                            </tr>
                            <tr>
                            <td>2024.01 ~ 2024.03</td>
                            <td>동서식품 MES 대시보드 화면 구축 <br/> UI 디자인, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2023.04 ~ 2023.12</td>
                            <td>신세계백화점 APP 운영 <br/>퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2022.05 ~ 2023.01</td>
                            <td>신한라이프 사이버창구 운영 <br/> 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2022.05 ~ 2022.06</td>
                            <td>엑소메라 브랜드 페이지 구축 <br/>UI 디자인, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2022.01 ~ 2022.04</td>
                            <td>신한라이프 사이버창구 운영 <br/>퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2021.10 ~ 2021.12</td>
                            <td>투썸플레이스 투썸하트 어플리케이션 고도화 <br/>퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2021.07 ~ 2021.09</td>
                            <td>국세청 국세상담센터 TM 시스템 구축 <br/> UI 디자인, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2021.04 ~ 2021.06</td>
                            <td>SK 행복재단 자연이랑 쇼핑몰 웹 구축 <br/>UI 디자인</td>
                            </tr>
                            <tr>
                            <td>2021.01 ~ 2021.03</td>
                            <td>OCUBE: 근태관리시스템 웹 구축 <br/>UI 디자인</td>
                            </tr>
                            <tr>
                            <td>2020.07 ~ 2020.11</td>
                            <td>SK 행복재단 자연이랑 쇼핑몰 모바일 구축 <br/>UI 디자인, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2020.01 ~ 2020.06</td>
                            <td>가천대길병원 홈페이지 웹&모바일 구축 <br/>UI 디자인, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2019.11 ~ 2019.11</td>
                            <td>AXA 내부 TM시스템 구축 <br/>UI 디자인, 넥사크로</td>
                            </tr>
                            <tr>
                            <td>2019.10 ~ 2019.10</td>
                            <td>CHUBB 생명 e-smart 내부시스템 구축 <br/>UI 디자인, 넥사크로</td>
                            </tr>
                            <tr>
                            <td>2018.06 ~ 2018.07</td>
                            <td>"생활 속 곤충찾기" 모바일 앱 리뉴얼 <br/>UI 디자인</td>
                            </tr>
                            <tr>
                            <td>2018.04 ~ 2018.07</td>
                            <td>르노삼성자동차 e-Contract 웹 & 모바일 구축 <br/>UI 디자인</td>
                            </tr>
                            <tr>
                            <td>2017.10 ~ 2017.12</td>
                            <td>비트코인 거래소 COINX 다국어 반응형 웹 구축 <br/>UI 디자인 80%, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2017.09 ~ 2017.10</td>
                            <td>위너스엔토 모바일 웹 구축 <br/>UI 디자인, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2017.06 ~ 2017.09</td>
                            <td>현대파워텍 설비관리 하이브리드 앱 구축 <br/>UI 디자인, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2017.04 ~ 2017.10</td>
                            <td>트리플스트리트 반응형 웹 & 하이브리드 앱 구축 <br/>UI 디자인 50%, 퍼블리싱 100%</td>
                            </tr>
                            <tr>
                            <td>2016.09 ~ 2016.10</td>
                            <td>비손메디칼 웹 홈페이지 구축 <br/>UI 디자인, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2016.07 ~ 2016.08</td>
                            <td>북가좌발전위원회 웹 홈페이지 구축 <br/>UI 디자인, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2016.04 ~ 2016.06</td>
                            <td>영컴출판사 웹 홈페이지 구축 및 운영 <br/>UI 디자인, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2016.03 ~ 2016.05</td>
                            <td>실리콘뱅크 웹 홈페이지 구축 <br/>UI 디자인, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2015.11 ~ 2016.01</td>
                            <td>래미안건설 웹 홈페이지 구축 <br/>UI 디자인, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2015.08 ~ 2015.10</td>
                            <td>호식이두마리치킨 웹 홈페이지 구축 <br/>UI 디자인, 퍼블리싱</td>
                            </tr>
                            <tr>
                            <td>2015.04 ~ 2015.07</td>
                            <td>북촌손만두 웹 홈페이지 구축 <br/>UI 디자인, 퍼블리싱</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    )
}

export default Profile