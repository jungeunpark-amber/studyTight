const inputBar = document.querySelector("#comment-input");
const rootDiv = document.querySelector("#comments");
const btn = document.querySelector("#submit");
const mainCommentCount = document.querySelector('#count');

function generateTime() { const date = new Date(); const year = date.getFullYear(); const month = date.getMonth(); const wDate = date.getDate(); const hour = date.getHours(); const min = date.getMinutes(); const sec = date.getSeconds(); const time = year + '-' + month + '-' + wDate + ' ' + hour + ':' + min + ':' + sec; return time; }

function generateUserName() {
    return '최시언';

} //이후 이름으로 처리

function numberCount(event) {
    console.log(event.target);
    if (event.target === voteUp) { console.log("2"); return voteUp.innerHTML++; } else if (event.target === voteDown) { return voteDown.innerHTML++; }
}

function generateImage() {
    return;
}

function deleteComments(event) {
    const btn = event.target;
    const list = btn.parentNode.parentNode.parentNode;
    rootDiv.removeChild(list);
}

function showComment(comment) {
    var userimage = document.createElement('img');
    userimage.src = 'media/person_gray.png'; // 이미지 경로 설정 (랜덤)
    const inputBox = document.createElement('div');
    var hzRule = document.createElement('hr'); // make a hr
    const userName = document.createElement('div');
    const inputValue = document.createElement('span');
    const showTime = document.createElement('div');
    const countSpan = document.createElement('span');
    const commentList = document.createElement('div');
    const onlycommend = document.createElement('div');
    const delBtn = document.createElement('button');
    hzRule.id = "myroom-line";
    delBtn.className = "deleteComment";
    delBtn.innerHTML = "삭제";
    inputBox.className = "inputbox";
    commentList.className = "eachComment";
    onlycommend.className = "onlycommend";
    userName.className = "name";
    userimage.className = "mini_image"
    userimage.innerHTML = generateImage(); //이후 이미지 삽입.
    inputValue.className = "inputValue";
    showTime.className = "time";
    userName.innerHTML = generateUserName(); //여기에 이후 유저네임 삽입.
    userName.appendChild(delBtn);
    inputValue.innerText = comment;
    showTime.innerHTML = generateTime();
    countSpan.innerHTML = 0;
    delBtn.addEventListener("click", deleteComments);
    commentList.appendChild(userimage);
    commentList.appendChild(inputBox);
    //commentList.after(hzRule); //댓글을 구분지어주는 코드
    inputBox.appendChild(userName);
    inputBox.appendChild(inputValue);
    inputBox.appendChild(showTime);
    rootDiv.prepend(hzRule);
    rootDiv.prepend(commentList);
}
//이게 마지막에 다 더한 리스트를 추가하는것.

function pressBtn() {
    const currentVal = inputBar.value;
    if (!currentVal.length) { alert("댓글을 입력해주세요!"); } else {
        showComment(currentVal);
        inputBar.value = '';
    }
}

btn.onclick = pressBtn;