


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


// 리뷰 작성
function applyReview() {
  const title = document.getElementById('review-title').value;
  const content = document.getElementById('review-content').value;
  const rate = 0;
  const serviceId = new URLSearchParams(window.location.search).get('serviceId');

  axios
    .post('api/reviews/create', {
      title: title,
      content: content,
      rate: rate,
      serviceId: serviceId,
    },{
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    });
}

// 사용자 정보 조회
function getSelf(callback) {
  axios
    .get('api/users/me', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      callback(response.data.user);
    })
    .catch((error) => {
      if (status == 401) {
        alert('로그인이 필요합니다.');
      } else {
        localStorage.clear();
        alert('알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.');
      }
      window.location.href = '/';
    });
}