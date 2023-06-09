$(document).on("headerLoaded", function () {
    loginChanger();
});


// const frontend_base_url = "http://127.0.0.1:5500"
// const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "https://claid.kr"
const backend_base_url = "https://cdn.claid.kr"

/**
 * 작성자 : 이준영
 * 내용 : 상대시간을 동적으로 해주는 함수
 * 최초 작성일 : 2023.06.17
 * 관련 링크 : https://beolog.tistory.com/125
 */
function timeago(date) {
    var t = new Date(date);
    var seconds = Math.floor((new Date() - t.getTime()) / 1000);
    if (seconds > 86400) return t.toISOString().substring(0, 10);
    if (seconds > 3600) return Math.floor(seconds / 3600) + "시간 전";
    if (seconds > 60) return Math.floor(seconds / 60) + "분 전";
    return "방금";
}

/**
 * 작성자 : 공민영
 * 내용 : 로그아웃
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("payload");
    location.reload();
}

/**
 * 작성자 : 공민영
 * 내용 : 로그인 로그아웃 시 버튼 바꾸기
 * 최초 작성일 : 2023.06.15
 * 수정자 : 이준영
 * 수정 내용 :유동 header로 인해 제이쿼리로 바꿈
 * 업데이트 일자 : 2023.06.23
 * 수정자 : 공민영
 * 수정 내용 : 관리자계정인지 확인 후 아닌경우 관리자페이지버튼 안보이게 수정
 * 업데이트 일자 : 2023.07.04
 */
function loginChanger() {
    var access_token = localStorage.getItem('access_token');

    if (access_token) {
        // alert('login-state');
        $('#login-btn').hide();
        $('#logout-btn').show();
        $('#profile-btn').show();
        $('#manager-btn').hide();
        managerChanger();
    } else {
        $('#logout-btn').hide();
        $('#profile-btn').hide();
        $('#login-btn').show();
        $('#manager-btn').hide();
    }
};

/**
 * 작성자 : 공민영
 * 내용 : 관리자계정일 경우에만 관리자 페이지 버튼 보이게
 * 작성일 : 2023.07.04
 */
function managerChanger() {
    const payload = localStorage.getItem('payload');
    const payload_json = JSON.parse(payload)
    const is_admin = payload_json.is_admin
    if (is_admin) {
        $('#manager-btn').show();
    }
}