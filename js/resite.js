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

console.log(userScore);
