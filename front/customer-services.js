if (localStorage.getItem('token')) {
  document.getElementsByClassName('login-btn')[0].style.display = 'none';
} else {
  document.getElementsByClassName('logout-btn')[0].style.display = 'none';
  document.getElementsByClassName('logout-btn')[1].style.display = 'none';
}

// 로그아웃
function logout() {
  localStorage.clear();
  window.location.href = '/';
}

getService()
// 손님 서비스 조회
function getService() {
  const userId = new URLSearchParams(window.location.search).get('userId');
  axios
    .get(`api/services/customer`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      const { data } = response.data
      console.log(data)
      for (let i=0; i<data.length; i++) {
        const temp = document.createElement('div');
        temp.setAttribute('class', 'container');
        temp.innerHTML = `
        <div>
          <header>주문 확인</header>
          <div class="progress-bar">
            <div class="step">
              <p>대기 중</p>
              <div class="bullet">
                <span id="span${i}-1">1</span>
              </div>
            </div>
            <div class="step">
              <p>수거 중</p>
              <div class="bullet">
                <span id="span${i}-2">2</span>
              </div>
            </div>
            <div class="step">
              <p>수거 완료</p>
              <div class="bullet">
                <span id="span${i}-3">3</span>
              </div>
            </div>
            <div class="step">
              <p>배송 중</p>
              <div class="bullet">
                <span id="span${i}-4">4</span>
              </div>
            </div>
            <div class="step">
              <p>배송 완료</p>
              <div class="bullet">
                <span id="span${i}-5">5</span>
              </div>
            </div>
          </div>
          <div class="form-outer">
            <form action="#">
              <div class="page slide-page">
                <div class="title">고객님의 주문</div>
                <div class="field">
                  <div class="label">서비스 신청 일시</div>
                  <input type="text" placeholder="날짜: ${data[i].createdAt.split('.')[0].split('T').join("  시간: ")}" readonly />
                </div>
                <div class="field">
                  <div class="label">요청사항</div>
                  <input type="text" placeholder="${data[i].customerRequest}" readonly />
                </div>
                <div class="title">담당 사장님</div>
                <div class="field">
                  <div class="label">닉네임</div>
                  <input type="text" placeholder="${data[i].ownerNickname}" readonly />
                </div>
                <div class="field">
                  <div class="label">전화번호</div>
                  <input type="text" placeholder="${data[i].ownerPhoneNumber}" readonly />
                </div>
                <div class="field">
                  <div class="label">주소</div>
                  <input type="text" placeholder="${data[i].ownerAddress}" readonly />
                </div>
              </div>
            </form>
          </div>
        </div>`;
        document.getElementById('container-list').append(temp);

        let status = data[i].status
        if (status === "대기 중") {
          status = 1
        } else if (status === "수거 중") {
          status = 2
        } else if (status === "수거 완료") {
          status = 3
        } else if (status === "배송 중") {
          status = 4
        } else if (status === "배송 완료") {
          status = 5
        }
        for (j=0; j<status; j++) {
          document.getElementById(`span${i}-${j+1}`).innerHTML = "✓"
        }
      }
    })
    .catch((error) => {
      console.log(error)
    });
}