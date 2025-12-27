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

//배우, 모달 아이콘 클릭 이벤트

const chariconModal = document.querySelector("dialog");

let nowicon = ""; // actor-card 의 처음 기본값이 담긴 변수
let moadlicon = ""; // modalicon안에 아이콘 클릭시 정보

const iconclick = document.querySelectorAll(".actor-card-click");
iconclick.forEach((card) => {
  card.addEventListener("click", () => {
    const cardEl = card.querySelector("i");

    nowicon = {
      cardEl: card, //카드 div
      index: Number(card.dataset.index), // 카드순서
      iconEl: cardEl, // i태그
      iconType: card.dataset.icon, // i 어떤 표정인지
      iconClass: cardEl.className, // 현재 클라스이름
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
      modadEl: modal, //카드 div
      iconType: modal.dataset.icon, // i 어떤 표정인지
      iconClass: modalEl.className, // 현재 클라스이름
    };

    //카드의 i를 모달에서 고른 아이콘으로 교체
    // 카드 쪽에 fa-2x 유지
    nowicon.iconEl.className = `${moadlicon.iconClass} fa-2x`;

    // moadl 아이콘 선택 후 nowicon iconType 프로퍼티 변경 적용
    nowicon.cardEl.dataset.icon = moadlicon.iconType;

    nowicon.iconType = moadlicon.iconType;
    nowicon.iconClass = nowicon.iconEl.className;

    chariconModal.close();
  });
});

// 로컬스토리지 키
const STORAGE_KEY = "resite:edit";

//저장 버튼
const SaveBtn = document.querySelector(".savebtn");
const EditBtn = document.querySelector(".editbtn");
const editableElements = document.querySelectorAll("[contenteditable]");

//edit.html 처음 방문시 바로 편집 막기 코드
editableElements.forEach((el) => {
  el.setAttribute("contenteditable", "false");
  console.log("편집막힘");
});

// edit 버튼 클릭시 편집가능 코드
EditBtn.addEventListener("click", () => {
  editableElements.forEach((el) => {
    el.setAttribute("contenteditable", "true");
  });
  console.log("편집 모드 작동");
});

//저장 이벤트
SaveBtn.addEventListener("click", () => {
  const editableElements = document.querySelectorAll("[data-key]");
  const saveData = {};

  editableElements.forEach((el) => {
    const key = el.dataset.key;
    const value = el.textContent.trim();
    saveData[key] = value;
  });

  //로컬스토리지 저장
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  console.log("저장완료", saveData);
  // 로컬스토리지 저장 후 편집 잠금
  document.querySelectorAll("[contenteditable]").forEach((el) => {
    el.setAttribute("contenteditable", "false");
  });
  console.log("편집모드 꺼짐");
});
