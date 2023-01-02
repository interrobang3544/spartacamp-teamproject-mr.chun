const container = document.querySelector(".container"),
        pwShowHide = document.querySelectorAll(".showHidePw"),
        pwFields = document.querySelectorAll(".password"),
        signUp = document.querySelectorAll(".signup-link"),
        login = document.querySelectorAll(".login-link");

//비밀번호 가리기/보이기 + 아이콘 바뀌기
        pwShowHide.forEach(eyeIcon => {
            eyeIcon.addEventListener("click", () => {

                pwFields.forEach(pwField => {
                    if(pwField.type ==="password") {
                        pwField.type = "text";

                        pwShowHide.forEach(icon => {
                            icon.classList.replace("uil-eye-slash", "uil-eye");
                        })
                    }else{
                        pwField.type = "password";

                        pwShowHide.forEach(icon => {
                            icon.classList.replace("uil-eye", "uil-eye-slash");
                        })
                    }
                })
            })
        })

// // 회원가입, 로그인 폼 나오게 하기
        $(document).on('click', '#signupform', function(){
            container.classList.add("active");
        });
        $(document).on('click', '#loginform', function(){
            container.classList.remove("active");
        });