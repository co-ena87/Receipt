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
  //기존 editableEls ture 는 유지
  unlockTags();

  editableEls.forEach((el) => {
    el.setAttribute("contenteditable", "true");
  });
  console.log("편집 모드 작동");
});

// 편집 모드 palceholder
document.querySelectorAll('[data-clear-on-focus="true"]').forEach((box) => {
  box.addEventListener("focusin", () => {
    if (!isEditMode) return;
    if (box.dataset.cleared === "true") return;
    box.dataset.cleared = "true";

    const p = box.querySelector(".review-content");
    if (!p) return;

    // ✅ p만 비우면 DOM 구조 유지 + placeholder 동작
    p.textContent = "";
  });
});

//저장 이벤트
SaveBtn.addEventListener("click", () => {
  const dataEls = document.querySelectorAll("[data-key]"); // 저장대상 데이터 요소
  const saveData = {};
  // 저장 클릭시 기존 tag 저장 로직 유지
  isEditMode = false;
  lockTags();

  dataEls.forEach((el) => {
    const key = el.dataset.key;

    const value =
      el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
        ? el.value.trim()
        : el.textContent.trim();
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

  //date
  dataEls.forEach((el) => {
    const key = el.dataset.key;

    // ✅ input/textarea면 value로 저장
    const value =
      el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
        ? el.value.trim()
        : el.textContent.trim();

    saveData[key] = value;
  });
});

//Tag - control
const tagContainer = document.querySelector(".move-tag-list");
const plusclick = document.querySelector(".tag-plus i");
const minusclick = document.querySelector(".tag-min i");

//tagContainer div 생성 기준 최대/ 최소
const tagMin = 2;
const tagMax = 10;

// ✅ 태그 숫자 카운트
function getTagCount() {
  return tagContainer.querySelectorAll(":scope > .tag").length;
}

// ✅ 편집 잠금(저장모드/초기 진입)
function lockTags() {
  // 컨테이너 자체는 항상 편집 금지
  tagContainer.setAttribute("contenteditable", "false");

  // 태그 텍스트도 잠금
  tagContainer.querySelectorAll(".tag-text").forEach((t) => {
    t.setAttribute("contenteditable", "false");
  });
}

// ✅ 편집 모드에서: "클릭한 태그만" 편집 열기
function unlockTags() {
  // 컨테이너는 계속 잠금 유지
  tagContainer.setAttribute("contenteditable", "false");

  // 기존에 열려있던 tag-text 전부 닫기
  tagContainer.querySelectorAll(".tag-text").forEach((t) => {
    t.setAttribute("contenteditable", "false");
  });
}

// ✅ 처음 로드시 태그 잠금
lockTags();

// ✅ 태그 클릭하면 편집 열기 (편집모드일 때만)
tagContainer.addEventListener("click", (e) => {
  if (!isEditMode) return;

  const textEl = e.target.closest(".tag-text");
  if (!textEl) return;

  // 전부 잠그고
  tagContainer.querySelectorAll(".tag-text").forEach((t) => {
    t.setAttribute("contenteditable", "false");
  });

  // 클릭한 것만 열기
  textEl.setAttribute("contenteditable", "true");
  textEl.focus();
});

// ✅ 태그 편집 끝나면 다시 잠금
tagContainer.addEventListener("focusout", (e) => {
  const textEl = e.target.closest(".tag-text");
  if (!textEl) return;
  textEl.setAttribute("contenteditable", "false");
});

// ✅ Backspace로 '#' 지우는 거 방지 + Enter 줄바꿈 방지
tagContainer.addEventListener("keydown", (e) => {
  const textEl = e.target.closest(".tag-text");
  if (!textEl) return;

  // Enter 방지
  if (e.key === "Enter") {
    e.preventDefault();
    textEl.blur();
    return;
  }
});

// ✅ + 버튼
plusclick.addEventListener("click", () => {
  if (!isEditMode) return;
  addTag();
});

// ✅ - 버튼
minusclick.addEventListener("click", () => {
  if (!isEditMode) return;
  removeTag();
});

// ✅ 태그 추가
function addTag() {
  const count = getTagCount();
  if (count >= tagMax) {
    alert(`태그는 최대 ${tagMax}개까지 추가 가능합니다.`);
    return;
  }

  const tag = document.createElement("div");
  tag.className = "tag";

  const span = document.createElement("span");
  span.className = "tag-text";
  span.textContent = "";
  span.setAttribute("contenteditable", "false"); // 클릭할 때만 열리게

  tag.appendChild(span);
  tagContainer.appendChild(tag);

  console.log("태그 추가됨 / 현재 개수:", getTagCount());
}

// ✅ 태그 삭제
function removeTag() {
  const count = getTagCount();
  if (count <= tagMin) {
    alert(`태그는 최소 ${tagMin}개는 유지해야 합니다.`);
    return;
  }

  const last = tagContainer.querySelector(":scope > .tag:last-child");
  if (!last) return;

  last.remove();

  console.log("태그 삭제됨 / 현재 개수:", getTagCount());
}
