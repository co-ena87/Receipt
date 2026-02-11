//로그인 id 저장
const loginBtn = document.querySelector("#login_btn");
const userIDinput = document.querySelector("#userID");
const userPWinput = document.querySelector("#userPW");
const loginform = document.querySelector(".login-form");

//form sumbit 막기
loginform.addEventListener("submit", (e) => {
  e.preventDefault();

  // 사용자 ID 저장
  const userID = userIDinput.value.trim();
  localStorage.setItem("loginUser", userID);

  // 중복 클릭 방지
  loginBtn.disabled = true;

  const go = () => (window.location.href = "./preview.html");

  function onEnd(evt) {
    if (evt.target === document.body) go();
  }
  document.body.addEventListener("animationend", onEnd, { once: true });

  //애니메이션 이벤트 못잡을시 대비용
  document.body.classList.add("page-leave");
  setTimeout(go, 2000);
});
