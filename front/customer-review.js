if (localStorage.getItem('token')) {
  getSelf(function (response) {
    if (response.userType !== 0) {
      window.location.replace('/index.html');
    }
    getReview();
  });
  document.getElementsByClassName('login-btn')[0].style.display = 'none';
}

// 로그아웃
function logout() {
  localStorage.clear();
  window.location.href = '/';
}

// 모달창
const myModal = new bootstrap.Modal('#alertModal');
function customAlert(text, confirmCallback) {
  document.getElementById('modal-text').innerHTML = text;
  myModal.show();
  if (confirmCallback) {
    $('#alertModal .btn-confirm').click(confirmCallback);
  }
}

const btn = document.querySelector('button');
const post = document.querySelector('.post');
const widget = document.querySelector('.star-widget');
const editBtn = document.querySelector('.edit');
btn.onclick = () => {
  widget.style.display = 'none';
  post.style.display = 'block';

  editBtn.onclick = () => {
    widget.style.display = 'block';
    post.style.display = 'none';
  };
  return false;
};

// 리뷰 작성
let rate = 0;
document.getElementById('star1').addEventListener('click', function () {
  rate = 1;
});
document.getElementById('star2').addEventListener('click', function () {
  rate = 2;
});
document.getElementById('star3').addEventListener('click', function () {
  rate = 3;
});
document.getElementById('star4').addEventListener('click', function () {
  rate = 4;
});
document.getElementById('star5').addEventListener('click', function () {
  rate = 5;
});

function applyReview() {
  const title = document.getElementById('review-title').value;
  const content = document.getElementById('review-content').value;
  const serviceId = new URLSearchParams(window.location.search).get(
    'serviceId'
  );

  axios
    .post(
      'api/reviews/create',
      {
        title: title,
        content: content,
        rate: rate,
        serviceId: serviceId,
      },
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    .then((response) => {
      console.log(response);
      window.location.replace(`customer-review.html?serviceId=${serviceId}`);
    })
    .catch((error) => {
      console.log(error);
    });
}

// 리뷰 조회
function getReview() {
  const serviceId = new URLSearchParams(window.location.search).get(
    'serviceId'
  );
  axios
    .get(`api/reviews/customer/${serviceId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      const { data } = response.data;
      document.getElementById('btn').style.display = 'none';
      document.getElementById('modify-btn').style.display = 'block';
      document.getElementById('main-title').innerHTML =
        '작성한 리뷰가 있습니다';
      document.getElementById('review-title').value = data.title;
      document.getElementById('review-content').value = data.content;
      document.getElementById(`star${data.rate}`).click();
    })
    .catch((error) => {
      console.log(error);
    });
}

// 리뷰 수정
function updateReview() {
  const title = document.getElementById('review-title').value;
  const content = document.getElementById('review-content').value;
  const serviceId = new URLSearchParams(window.location.search).get(
    'serviceId'
  );
  axios
    .put(
      `api/reviews/customer/${serviceId}`,
      {
        title: title,
        content: content,
        rate: rate,
      },
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    .then((response) => {
      window.location.replace(`customer-review.html?serviceId=${serviceId}`);
    })
    .catch((error) => {
      console.log(error);
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
