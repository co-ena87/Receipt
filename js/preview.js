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
iconclick.forEach((card) => {
  card.addEventListener("click", () => {
    const cardEl = card.querySelector("i");

    nowicon = {
      cardEl: card, //DOM div i 클릭이벤트
      index: Number(card.dataset.index), // 카드순서
      iconEl: cardEl, // DOM i 태그 조작대상
      iconType: card.dataset.icon, // i 상태 값, 데이터
      iconClass: cardEl.className, // 현재 화면에 적용된 스타일
    };

    chariconModal.showModal();
  });
});

const modaInclick = document.querySelectorAll(".icons-op i");
modaInclick.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (!event.target.matches("i")) return;
    if (!nowicon) {
      alert("배우 아이콘 선택해주세요.");
    }

    const modalEl = event.target;

    moadlicon = {
      modadEl: modal, //DOM
      iconType: modal.dataset.icon, // i 상태 값 , 데이터
      iconClass: modalEl.className, //현재 화면에 적용된 스타일
    };

    // actor-card 클릭시 아이콘 교체 -> 유저 화면에 보이기 코드

    // 모달 아이콘 선택 후 -> actor-card 에 반영하기 fa-2x 적용시키기
    nowicon.iconEl.className = `${moadlicon.iconClass} fa-2x`;

    // moadl 아이콘 선택 후 -> noowicon 상태 (데이터) 변경
    nowicon.cardEl.dataset.icon = moadlicon.iconType;

    //유저 화면 적용
    nowicon.iconType = moadlicon.iconType;
    nowicon.iconClass = nowicon.iconEl.className;

    chariconModal.close();
  });
});
