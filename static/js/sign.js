window.onload = () => {
    checkAccessToken();
}

/**
 * 작성자 : 공민영
 * 내용 : 회원가입 버튼 클릭시 인증이메일 전송
 * 최초 작성일 : 2023.06.15
 * 수정자 : 이준영
 * 수정 내용 : 하드 코딩 되어 있는 url을 backend_base_url로 수정
 * 업데이트 일자 : 2023.06.28
 */
async function saveMail() {
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const password_check = document.getElementById("password_check").value;

    const error = document.getElementById("error");

    const response = await fetch(`${backend_base_url}/user/signup/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "nickname": nickname,
            "email": email,
            "password": password,
        })
    })

    // 에러메시지
    const response_json = await response.json();
    const err = response_json.message;

    /*비밀번호 확인*/
    if (password != password_check) {
        alert("비밀번호가 맞지않습니다");
    } else if (password === password_check) {
        // 이메일 인증 되어있는지 확인
        if (response.status == 201) {
            alert("email 발송! email 확인하여 인증 성공 시 가입 완료");
            handleLogout();
            window.location.replace('login.html');
        } else {
            alert(err);
        }
    }
}

/**
 * 작성자 : 공민영
 * 내용 : 로그인 버튼 함수
 * 최초 작성일 : 2023.06.15
 * 수정자 : 이준영
 * 수정 내용 : 하드 코딩 되어 있는 url을 backend_base_url로 수정
 * 업데이트 일자 : 2023.06.28
 */
async function handleLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(backend_base_url);
    const response = await fetch(`${backend_base_url}/user/login/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    })
    if (response.status == 200) {
        //response를 json화해서 access,refresh 가져옴
        const response_json = await response.json();

        localStorage.setItem("access_token", response_json.access);
        localStorage.setItem("refresh_token", response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        // 인증되어있는지 확인
        localStorage.setItem("payload", jsonPayload);
        const payload = localStorage.getItem("payload");
        const is_active = JSON.parse(payload).is_active;
        if (is_active) {
            alert("환영합니다.");
            window.location.replace('index.html');
        }
    } else {
        alert("인증이 완료되지않았거나 가입되지않은 이메일입니다.");
    }
}

/**
 * 작성자 : 이준영
 * 내용 : 토큰 체크0
 * 최초 작성일 : 2023.06.17
 */
function checkAccessToken() {
    var access_token = localStorage.getItem('access_token');
    if (access_token === undefined) {
        alert("엑세스 토큰 undefined")
        handleLogout();
        window.location.replace(`../login.html`)
    } else if (access_token) {
        // document.getElementById('login_container').style.display = 'none';
        window.location.replace(`../index.html`);
    }
};

// 카카오 로그인 ###############################################
function loginWithKakao() {
    /**
     * 작성자 : 이준영
     * 내용 : kakao_code 가져오고 임시 주소로 이동.
     * 최초 작성일 : 2023.06.14
     * 수정 내용 : sign.js로 통합, 토큰 확인하여 반복 로그인 방지
     * 업데이트일 : 2023.06.17
     */
    var access_token = localStorage.getItem('access_token');

    if (!access_token) {
        Kakao.Auth.authorize({
            redirectUri: `${frontend_base_url}/temp.html`,
        });
    }
    else {
        alert('이미 로그인 중입니다!');
        window.location.replace(`../index.html`);
    }
}

async function loginWithGoogle() {
    // 구글 로그인 ###############################################
    /** 작성자 :김은수
      * 내용 : 토큰 체크
      * 최초 작성일 : 2023.06.17
      **/
    var access_token = localStorage.getItem("access_token");

    if (!access_token) {
        const response = await fetch(`${backend_base_url}/user/google/`, {
            method: "GET",
        });
        const google_id = await response.json();
        const redirect_uri = `${frontend_base_url}/temp.html`;
        const scope =
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
        const param = `scope=${scope}&include_granted_scopes=true&response_type=token&state=pass-through value&prompt=consent&client_id=${google_id}&redirect_uri=${redirect_uri}`;
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${param}`;
    } else {
        alert("이미 로그인 중입니다!");
        window.location.replace(`../index.html`);
    }
}
