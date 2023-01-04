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

function loadFile(input) {
  console.log("input:", input.files[0])
  axios
    .post('api/services/uploadImage')
    .then((response) => {
      console.log('response:', response);
    })
    .catch((error) => {
      alert('알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.');
    });

  //선택된 파일 가져오기
  const file = input.files[0];

  //미리 만들어 놓은 div에 text(파일 이름) 추가
  // var name = document.getElementById('fileName');
  // name.textContent = file.name;

  //새로운 이미지 div 추가
  // var newImage = document.createElement("img");
  // newImage.setAttribute("class", 'img');

  //이미지 source 가져오기
  // newImage.src = URL.createObjectURL(file);

  // newImage.style.width = "70%";
  // newImage.style.height = "70%";
  // newImage.style.visibility = "hidden";   //버튼을 누르기 전까지는 이미지를 숨긴다
  // newImage.style.objectFit = "contain";

  //이미지를 image-show div에 추가
  // var container = document.getElementById('image-show');
  // container.appendChild(newImage);
}
