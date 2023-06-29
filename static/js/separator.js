window.onload = () => {
    checkAccessToken2()
}

/**
 * 작성자 : 이준영
 * 내용 : 오디오 분리
 * 최초 작성일 : 2023.06.21
 */
async function separator() {
    var file = $('#audio-file_input')[0].files[0];
    var formData = new FormData();
    formData.append('file', file);

    try {
        $('#loadingSpinner').show();
        $('#uploadBtn').prop('disabled', true);
        $('.vocals-container').hide();
        $('.accompaniment-container').hide();

        const response = await fetch(`${backend_base_url}/separator/`, {
            method: 'POST',
            headers: {
                "Authorization": 'Bearer ' + localStorage.getItem("access_token")
            },
            body: formData
        });
        if (response.ok) {
            const data = await response.json();

            $('#vocals-audio').attr('src', data.files.vocals).css('display', 'block').prop('volume', 0.1).prop('preload', 'metadata');
            $('#accompaniment-audio').attr('src', data.files.accompaniment).css('display', 'block').prop('volume', 0.1).prop('preload', 'metadata');

            $('#vocals-download').removeClass('disabled');
            $('#accompaniment-download').removeClass('disabled');

            $('.vocals-container').show();
            $('.accompaniment-container').show();
        } else if (response.status === 400) {
            alert('Bad Request, 잘못된 요청입니다.');
        } else if (response.status === 401) {
            alert('토큰 만료! 재로그인해주세요!');
            handleLogout()
            window.location.href = '/login.html';
        } else if (response.status === 500) {
            alert('서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요.');
        } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }
    } catch (error) {
        alert(error);
    } finally {
        $('#loadingSpinner').hide();
    }
}

/**
 * 작성자 : 이준영
 * 내용 : 토큰 체크2
 * 최초 작성일 : 2023.06.17
 */
function checkAccessToken2() {
    var access_token = localStorage.getItem('access_token');
    if (!access_token) {
        alert('로그인 하셔야 됩니다.')
        window.location.replace(`../login.html`);
    }
};
