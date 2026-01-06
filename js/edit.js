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
      modadEl: modal, //모달
      iconType: modal.dataset.icon, // i 어떤 표정인지
      iconClass: modalEl.className, // 현재 클라스이름
    };

    //카드의 i를 모달에서 고른 아이콘으로 교체 -> 카드 아이콘 사이즈 fa-2x 유지
    nowicon.iconEl.className = `${moadlicon.iconClass} fa-2x`;

    // moadl 아이콘 선택 후 카드 쪽 data-set 갱신
    nowicon.cardEl.dataset.icon = moadlicon.iconType;

    // 새로 선택한 아이콘 기준으로 데이터 모델 갱신
    nowicon.iconType = moadlicon.iconType;

    // 최종 클래스 상태를 데이터 모델에 기록
    nowicon.iconClass = nowicon.iconEl.className;

    chariconModal.close();
  });
});

// 로컬스토리지 키
const STORAGE_KEY = "resite:edit";

//저장 버튼
const SaveBtn = document.querySelector(".savebtn");

//편집 버튼
const EditBtn = document.querySelector(".editbtn");

// contenteditable 작성된 요소들 가져오기 UI 요소들
const editableEls = document.querySelectorAll("[contenteditable]");

// 편집 모드 플래그
let isEditMode = false;

//edit.html 처음 방문시 바로 편집 막기 코드
editableEls.forEach((el) => {
  el.setAttribute("contenteditable", "false");
  console.log("편집막힘");
});
isEditMode = false;

// edit 버튼 클릭시 편집가능 코드
EditBtn.addEventListener("click", () => {
  isEditMode = true;

  editableEls.forEach((el) => {
    el.setAttribute("contenteditable", "true");
  });
  console.log("편집 모드 작동");
});

// 편집모드 전환  -> 첫 포커스 되면 기존 previe.html text 지우기
document.querySelectorAll('[data-clear-on-focus="true"]').forEach((box) => {
  box.addEventListener("focusin", () => {
    if (box.dataset.cleared === "true") return;
    box.dataset.cleared = "true";
    //box 내용만 지우기
    box.textContent = "";

    //커서 들어갈 수 있게 최소 1줄 확보
    box.innerHTML = "<p><br></p>";
  });
});

//저장 이벤트
SaveBtn.addEventListener("click", () => {
  const dataEls = document.querySelectorAll("[data-key]"); // 저장대상 데이터 요소
  const saveData = {};

  dataEls.forEach((el) => {
    const key = el.dataset.key;
    const value = el.textContent.trim();
    saveData[key] = value;
  });

  //로컬스토리지 저장
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  console.log("저장완료", saveData);

  // 저장 후 편집 잠금
  document.querySelectorAll("[contenteditable]").forEach((el) => {
    el.setAttribute("contenteditable", "false");
  });
  isEditMode = false;
  console.log("편집모드 꺼짐", saveData);
});

//Tag - control;
const tagContainer = document.querySelector(".move-tag-list");
const tagplus = document.querySelectorAll(".tag-plus");
const tagmin = document.querySelectorAll(".tag-min");

//tag-control '+' 클릭 이벤트
const plusclick = document.querySelector(".tag-plus i");

plusclick.addEventListener("click", () => {
  if (!isEditMode) return;
  addTage();
});

//tag-control '-' 클릭 이벤트
const minusclick = document.querySelector(".tag-min i");

minusclick.addEventListener("click", () => {
  if (!isEditMode) return;
  removeTag();
});

// 태그 숫자 카운트
function getTagCount() {
  return tagContainer.querySelectorAll(":scope > div").length;
}

//tagContainer div 생성 기준 최대/ 최소
const tagMin = 2;
const tagMax = 10;

// tag 의 div 추가 시키는 코드
function addTage() {
  const div = document.createElement("div");

  const count = getTagCount();
  if (count >= tagMax) {
    alert(`태그는 최대 ${tagMax}까지 추가 가능합니다.`);
    return;
  }

  div.textContent = "#";
  tagContainer.appendChild(div);

  console.log("태그 추가됨 / 현재 개수:", getTagCount());
}

//tag 의 div 삭제 시키는 코드
function removeTag() {
  if (!isEditMode) return;

  const count = getTagCount();
  if (count <= tagMin) {
    alert(`태그는 최소 ${tagMin}개 까지입니다.`);
    return;
  }

  const last = tagContainer.lastElementChild;
  if (!last) return; // 안전장치

  tagContainer.removeChild(last);

  console.log("태그 삭제됨 / 현재 개수:", getTagCount());
}
