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

//클릭이벤트

const chariconModal = document.querySelector("dialog");

let nowicon = ""; // actor-card 의 처음 기본값이 담긴 변수
let moadlicon = ""; // modalicon안에 아이콘 클릭시 정보

const iconclick = document.querySelectorAll(".actor-card-click");
iconclick.forEach((icon) => {
  icon.addEventListener("click", () => {
    const iconEl = icon.querySelector("i");
    const iconType = icon.dataset.icon;
    const clickdIndex = Number(icon.dataset.index);
    nowicon = icon;

    nowicon = {
      index: clickdIndex,
      iconEl: nowicon,
      iconType: iconType,
      iconClass: iconTarget,
    };

    chariconModal.showModal();
  });
});

const modaInclick = document.querySelectorAll(".icons-op i");
modaInclick.forEach((icon) => {
  icon.addEventListener("click", () => {
    const modaltTarget = icon.querySelector("i");
    const iconEl = icon.querySelector("i");
    const modalType = icon.dataset.icon;
    const clickdIndex = Number(icon.dataset.index);
    moadlicon = icon;

    moadlicon = {
      index: clickdIndex,
      iconEl: iconEl,
      modalType: modalType,
      modalClass: modaltTarget,
    };

    if (!nowicon) {
      alert("아이콘을 선택해주세요!");
      return;
    }
    const newIconClass = moadlicon.modalType;
    const newIconType = moadlicon.modaltTarget;

    nowicon.iconType = newIconType;
    nowicon.iconClass = newIconClass;

    nowicon.iconEl.Clas;
  });
});
