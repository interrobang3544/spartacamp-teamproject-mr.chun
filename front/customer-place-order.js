if (localStorage.getItem('token')) {
  getSelf(function (response) {
    if (response.userType !== 0) {
      window.location.replace('/');
    }
    document.getElementById('inputNickname').value = response.nickname;
    document.getElementById('inputPhoneNumber').value = response.phoneNumber;
    document.getElementById('inputAddress').value = response.address;
  });
} else {
  window.location.replace('/');
}

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

// 모달창
const myModal = new bootstrap.Modal('#alertModal');
function customAlert(text, confirmCallback) {
  document.getElementById('modal-text').innerHTML = text;
  myModal.show();
  if (confirmCallback) {
    $('#alertModal .btn-confirm').click(confirmCallback);
  }
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

// 서비스 신청
function applyService() {
  const phoneNumber = document.getElementById('inputPhoneNumber').value;
  const address = document.getElementById('inputAddress').value;
  const image = `./uploadImages/${imageSrc.name}`;
  const customerRequest = document.getElementById('inputCustomerRequest').value;

  getSelf(function (response) {
    if (phoneNumber !== response.phoneNumber || address !== response.address) {
      // 유저 정보 수정
      customAlert('정보 수정')
    }
  })

  axios
    .post('api/services', {
      image: image,
      customerRequest: customerRequest,
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

let imageSrc = ""

function loadFile(input) {
  console.log("input:", input.files[0])
  imageSrc = input.files[0];
  let file = input.files[0];

  let newImage = document.getElementById("image");
  newImage.src = URL.createObjectURL(file);

  newImage.style.width = "100%";
  newImage.style.height = "100%";
  newImage.style.objectFit = "contain";
}
