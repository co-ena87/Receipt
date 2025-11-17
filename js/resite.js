// edit.html 페이지로 이동
const resite = document.getElementById("new-res-go");

clicknext = () => {
  window.location.href = "edit.html";
};
resite.addEventListener("click", clicknext);

//별점 스코어

const stars = document.querySelectorAll("#star-icons i");
let rating = 0;

function setRating(n) {
  rating = n;
  stars.forEach((elm, i) => {
    elm.classList.toggle("active", i < n);
  });
}
stars.forEach((elm, idx) => {
  // 마우스클릭
  elm.addEventListener("click", () => setRating(idx + 1));
});
