// 페이지 로딩 완료 시
$(document).ready(function () {
  getUser();
  showService();
});

// GET - 회원 정보 조회 - 완료
function getUser() {
  $.ajax({
    type: 'GET',
    url: '/api/users/',
    data: {},
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      console.log(response);
      const data = response.data;
      console.log(data);
      $('#user-nickname').text(data.nickname);
      $('#user-phone-number').text(data.phoneNumber);
      $('#user-address').text(data.address);
      $('#user-point').text(data.point);
    },
    error: function (xhr, status, error) {
      if (status === 401) {
        customAlert('로그인이 필요합니다');
      } else {
        localStorage.clear();
        customAlert(error.responseJSON.errorMessage);
      }
      window.location.href = '/';
      // window.location.replace('/'); // 둘이 다른 점??
    },
  });
}

// PUT - 회원 정보 수정 - 인풋값 받아오기 진행중
function modifyUser(status) {
  const phoneNumber = $('#service-id').attr('data-service-id');
  $.ajax({
    type: 'PUT',
    url: `/api/users`,
    data: JSON.stringify({
      phoneNumber: phoneNumber,
      address: address,
      // password: password,
      // confirm: confirm
    }),
    contentType: 'application/json; charset=UTF-8',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      customAlert(response.message);
    },
    error: function (xhr) {
      // console.log(xhr.responseJSON.errorMessage);
      customAlert(xhr.responseJSON.errorMessage);
    },
  });
}

// DELETE - 회원 정보 삭제 - 확인 메세지 창 진행중
function modifyUser(status) {
  // 탈퇴 버튼 클릭시 '정말 탈퇴하시겠습니까?
  // 정보가 지워지고 복구 불가능합니다.' 메세지 띄우기
  $.ajax({
    type: 'DELETE',
    url: `/api/users`,
    data: {},
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      customAlert(response.message);
    },
    error: function (xhr) {
      customAlert(xhr.responseJSON.errorMessage);
    },
  });
}

// GET - 서비스 하나 조회(사장님 마이페이지에서)
function showService() {
  // const serviceId = 1 // '현재 서비스 중'인 서비스를 어떻게 얻어올 수 있을까?
  axios
    .get('api/services/owner/mypage', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      console.log(response);
      const data = response.data.data;
      // $('.changed').text(data.serviceId); => .text = ...
      // $('.changed').html('<p>New text</p>'); => .innerHTML = ...과 같음
      //
      $('#service-id').text(`${data.serviceId}번 세탁물`); // .text .attr
      $('#service-id').attr('data-service-id', data.serviceId); // .text .attr
      $('#customer-nickname').text(data.customerNickname);
      $('#image').text(data.image);
      $('#customer-request').html(data.customerRequest);
      $('#customer-address').text(data.customerAddress);
      $('#customer-phone-number').text(data.customerPhoneNumber);
      $('#status').text(data.status);
      $('#created-at').text(data.createdAt);
      $('#updated-at').text(data.updatedAt);
      $('#owner-nickname').html(data.ownerNickname);
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status === 404) {
        // $('.message').text('현재 진행중인 세탁 서비스가 없습니다.');
        $('.message').text(error.response.data.errorMessage);
      } else {
        customAlert(error.response.data.errorMessage);
      }
    });
  // $.ajax({
  //     type: 'GET',
  //     url: '/api/services/owner/mypage',
  //     data: {},
  //     headers: {
  //         authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //     success: function(response) {
  //         console.log(response);
  //         const data = response.data;
  //         // $('.changed').text(data.serviceId); => .text = ...
  //         // $('.changed').html('<p>New text</p>'); => .innerHTML = ...과 같음
  //         //
  //         $('#service-id').text(data.serviceId); // .text .attr
  //         $('#customer-nickname').text(data.customerNickname);
  //         $('#image').text(data.image);
  //         $('#customer-request').html(data.customerRequest);
  //         $('#customer-address').text(data.customerAddress);
  //         $('#customer-phone-number').text(data.customerPhoneNumber);
  //         $('#status').text(data.status);
  //         $('#created-at').text(data.createdAt);
  //         $('#updated-at').text(data.updatedAt);
  //         $('#owner-nickname').html(data.ownerNickname);
  //         // $('#inputNickname').attr('placeholder', `${data.ownerNickname}`)
  //     },
  //     error: function(xhr, status, error) {
  //         console.log("status: ", status)
  //         if (status === 401) {
  //             customAlert('로그인이 필요합니다');
  //         } else if (status === 404) {
  //             // 내가 보내는 status는 'error'라고만 오기 때문에 문제가 있음.
  //             $('.message').text('현재 진행중인 세탁 서비스가 없습니다.')
  //             // $('.service-detail').css('display', 'none');
  //         } else {
  //             customAlert(error.responseJSON.errorMessage);
  //             // customAlert(error.response.data.errorMessage);
  //         }
  //         window.location.href = '/';
  //         // window.location.replace('/'); // 둘이 다른 점??
  //     }
  // })
}

// PUT - 서비스 수정(사장님 마이페이지에서)
function modifyService(status) {
  const serviceId = $('#service-id').attr('data-service-id');
  $.ajax({
    type: 'PUT',
    url: `/api/services/${serviceId}/mypage`,
    data: JSON.stringify({ status: status }),
    contentType: 'application/json; charset=UTF-8',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      customAlert(response.message);
    },
    error: function (xhr) {
      // console.log(xhr.responseJSON.errorMessage);
      customAlert(xhr.responseJSON.errorMessage);
    },
  });
}

// 모달창
const myModal = new bootstrap.Modal('#alertModal', {
  keyboard: true,
});

function customAlert(text) {
  document.getElementById('modal-text').innerHTML = text;
  myModal.show();
}
// function customAlert(text, confirmCallback) {
//   $('#alertText').text(text);
//   $('#alertModal').modal('show');
// }
