const container = document.querySelector(".container"),
        pwShowHide = document.querySelectorAll(".showHidePw"),
        pwFields = document.querySelectorAll(".password");
        signUp = document.querySelectorAll(".signup-link");
        login = document.querySelectorAll(".login-link");

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

        //나타내기
        signUp.addEventListener("click", () => {
            container.classList.add("active");
        })
        login.addEventListener("click", () => {
            container.classList.remove("active");
        })