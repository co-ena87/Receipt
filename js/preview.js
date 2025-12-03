//별점 스코어
const stars = document.querySelectorAll("#star-icons i");
const userScore = document.getElementById("user-score");
let rating = 0;

function setRating(n) {
  rating = n;

  //별 active
  stars.forEach((elm, i) => {
    elm.classList.toggle("active", i < n);
  });

  userScore.textContent = rating;
}
stars.forEach((elm, idx) => {
  // 마우스클릭
  elm.addEventListener("click", () => setRating(idx + 1));
});

//배우 아이콘 클릭시 모달 띄우기
const iconclick = document.getElementsByClassName("actor-card-click");
const chariconModal = document.querySelector("dialog");

[...iconclick].forEach((icon) => {
  icon.addEventListener("click", () => {
    chariconModal.showModal();
  });
});

const modaInclick = document.querySelectorAll(".icons-op i");
[...modaInclick].forEach((icon) => {
  icon.addEventListener("click", () => {
    console.log("클릭됨");
  });
});
