window.onload = () => {
    showName();
}

/**
 * 작성자 : 공민영
 * 내용 : 게시글 작성하기
 * 최초 작성일 : 2023.06.15
 * 최종 수정자 : 이준영
 * 수정내용 : 작성완료 시 오류 나면 초기화하는 문제
 * => 전송요청 후 체크가 아니라 체크 후 전송하도록 바꿈.
 * 업데이트 일자 : 2023.06.17
 */
async function postArticle() {
    console.log("게시글 작성 눌림");
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const article_image = document.getElementById("article_image").files[0];
    const song = document.getElementById("song").files[0];

    const formdata = new FormData();

    formdata.append('title', title);
    formdata.append('content', content);
    formdata.append('article_image', article_image);
    formdata.append('song', song);

    let access_token = localStorage.getItem("access_token");

    if (title == "" || content == "" || song == null) {
        alert("제목, 내용, 음악파일은 필수입니다.");
        return;
    } else {
        const response = await fetch(`${backend_base_url}/article/`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${access_token}`
            },
            body: formdata
        })
        if (response.status == 201) {
            alert("작성완료!");
            window.location.replace('index.html');
        } else {
            alert(response.statusText);
            location.reload();
        }
    }
}

/**
 * 작성자 : 공민영
 * 내용 : 게시글 가져오기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function getArticles() {
    const response = await fetch('http://127.0.0.1:8000/article/');

    if (response.status == 200) {
        const response_json = await response.json();
        return response_json
    } else {
        alert("게시글을 불러오는데 실패했습니다.");
    }
}

/**
 * 작성자 : 공민영
 * 내용 : 게시글 상세보기 url
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
function articleDetail(articleId) {
    console.log(articleId);
    window.location.href = `${frontend_base_url}/article_detail.html?article_id=${articleId}`
}

//작성 이미지 미리보기
function showPreview(event) {
    if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        var preview = document.getElementById("preview");
        preview.src = src;
        preview.style.display = "block";
    }
}

/**
 * 작성자 : 공민영
 * 내용 : 닉네임 가져와서 보여줌
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function showName() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    console.log(payload_parse);

    const intro = document.getElementById("intro");


    // payload 에서 가져온 정보를 html에 보이게하기(id 이용)
    intro.innerText = payload_parse.nickname;
}

/**
 * 작성자 : 공민영
 * 내용 : 로그인 로그아웃 시 버튼 바꾸기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
document.addEventListener('DOMContentLoaded', function () {
    var access_token = localStorage.getItem('access_token');
    if (access_token) {
        document.getElementById('login_container').style.display = 'none';
    } else {
        document.getElementById('logged_in_container').style.display = 'none';
    }
});

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