//로그인 id 저장
const loginBtn = document.querySelector("#login_btn");
const userIDinput = document.querySelector("#userID");
const userPWinput = document.querySelector("#userPW");
const loginform = document.querySelector(".login-form");

//form sumbit 막기
loginform.addEventListener("submit", (e) => {
  e.preventDefault();

  const userID = userIDinput.value.trim();
  const userPW = userPWinput.value.trim();

  localStorage.setItem("loginUser", userID);

  document.body.classList.add("page-leave");
  loginBtn.disabled = true;

  setTimeout(() => (window.location.href = "./preview.html"), 2000);
});
