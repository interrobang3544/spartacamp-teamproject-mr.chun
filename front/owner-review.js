if (localStorage.getItem('token')) {
  document.getElementsByClassName('login-btn')[0].style.display = 'none';
} else {
  document.getElementsByClassName('logout-btn')[0].style.display = 'none';
  document.getElementsByClassName('logout-btn')[1].style.display = 'none';
}

getReview();

// 로그아웃
function logout() {
  localStorage.clear();
  window.location.href = '/';
}

// 사장님 리뷰 조회
function getReview() {
  const userId = new URLSearchParams(window.location.search).get('userId');
  axios
    .get(`api/reviews/owner/${userId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      const { data } = response.data

      for (let i=0; i<data.length; i++) {
        const temp = document.createElement('div');
        temp.setAttribute('class', 'testimonial-box');
        temp.innerHTML = `
        <div class="box-top">
            <div class="profile">
                <div class="name-user">
                    <strong>${data[i].customerNickname}</strong>
                </div>
            </div>
  
            <div class="reviews">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-regular fa-star"></i>
            </div>
        </div>
  
        <div class="client-comment">
            <p>${data[i].content}</p>
        </div>`;
        document.getElementById('testimonial-box-container').append(temp);
      }
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
