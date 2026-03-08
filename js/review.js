// 로그인 가드: 미로그인 → 로그인 페이지로
(() => {
  const user = localStorage.getItem("loginUser");
  if (!user) {
    location.replace("login.html");
  }
})();

//별점 스코어
const stars = document.querySelectorAll(".star-icons i");
const userScore = document.getElementById("user-score");
let rating = 0;

//<h1> username
const username = document.getElementById("username");
const loginUser = localStorage.getItem("loginUser");

if (username) {
  username.textContent = loginUser ?? "unknown";
}

//starScore 레이팅
function setRating(n) {
  rating = n;

  //별 아이콘 클릭시 toggle 활성화 + 별점 카운트
  stars.forEach((elm, i) => {
    elm.classList.toggle("active", i < n);
  });

  if (userScore) userScore.textContent = rating;
}

stars.forEach((elm, idx) => {
  // 편집 모드에서만 작동 클릭작동
  elm.addEventListener("click", () => {
    if (!isEditMode) return;
    setRating(idx + 1);
  });
});

//배우, 모달 아이콘 클릭 이벤트
const chariconModal = document.querySelector("dialog");

let nowicon = null; // actor-card 의 처음 기본값이 담긴 변수
let modalIcon = null; // modalicon안에 아이콘 클릭시 정보

const iconclick = document.querySelectorAll(".actor-card-click");
iconclick.forEach((card) => {
  card.addEventListener("click", () => {
    if (!isEditMode) return;
    const cardEl = card.querySelector("i");

    nowicon = {
      cardEl: card, //카드 div
      index: Number(card.dataset.index), // 카드순서
      iconEl: cardEl, // i태그
      iconType: card.dataset.icon, // i 어떤 표정인지
      iconClass: cardEl.className, // 현재 클라스이름
    };

    if (chariconModal) chariconModal.showModal();
  });
});

const modaInclick = document.querySelectorAll(".icons-op i");
modaInclick.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (!event.target.matches("i")) return;
    if (!nowicon) return;

    const modalEl = event.target;

    modalIcon = {
      iconType: modal.dataset.icon, // i 어떤 표정인지
      iconClass: modalEl.className, // 현재 클라스이름
    };

    //카드의 i를 모달에서 고른 아이콘으로 교체 -> 카드 아이콘 사이즈 fa-2x 유지
    nowicon.iconEl.className = `${modalIcon.iconClass} fa-2x`;

    // moadl 아이콘 선택 후 카드 쪽 data-set 갱신
    nowicon.cardEl.dataset.icon = modalIcon.iconType;

    // 새로 선택한 아이콘 기준으로 데이터 모델 갱신
    nowicon.iconType = modalIcon.iconType;

    // 최종 클래스 상태를 데이터 모델에 기록
    nowicon.iconClass = nowicon.iconEl.className;

    if (chariconModal) chariconModal.close();
  });
});

// 로컬스토리지 키
const STORAGE_KEY = "resite:edit";

//저장 버튼
const SaveBtn = document.querySelector(".savebtn");

//편집 버튼
const EditBtn = document.querySelector(".editbtn");

// 날짜 input
const dateInput = document.querySelector(".DateInput");
toggleDateEditable(false); //페이지 진입시 잠그기

// contenteditable 작성된 요소들 가져오기 UI 요소들
const editableEls = document.querySelectorAll("[contenteditable]");

// 편집 모드 플래그
let isEditMode = false;

//edit.html 처음 방문시 바로 편집 막기 코드
editableEls.forEach((el) => {
  el.setAttribute("contenteditable", "false");
});
isEditMode = false;

// edit 버튼 클릭시 편집가능 코드
EditBtn.addEventListener("click", () => {
  isEditMode = true;
  document.body.classList.add("editing");
  unlockTags();

  editableEls.forEach((el) => {
    el.setAttribute("contenteditable", "true");
  });
  toggleDateEditable(true);
});

// disabled 토글 헬퍼 (프로퍼티 + 속성 모두 제어)
function toggleDateEditable(isEdit) {
  if (!dateInput) return;
  if (isEdit) {
    dateInput.disabled = false; // 프로퍼티
    dateInput.removeAttribute("disabled"); // 속성
  } else {
    dateInput.disabled = true; // 프로퍼티
    dateInput.setAttribute("disabled", ""); // 속성
  }
}

// 편집 모드 palceholder
document.querySelectorAll('[data-clear-on-focus="true"]').forEach((box) => {
  box.addEventListener("focusin", () => {
    if (!isEditMode) return;
    if (box.dataset.cleared === "true") return;
    box.dataset.cleared = "true";

    const p = box.querySelector(".review-content");
    if (!p) return;

    // p만 비우면 DOM 구조 유지 + placeholder 동작
    p.textContent = "";
  });
});

//저장 이벤트
SaveBtn.addEventListener("click", () => {
  const dataEls = document.querySelectorAll(
    '[data-key]:not([data-key="starScore"])', //starScore 일반 텍스트로 읽지 않도록 제외시킴
  );
  const saveData = {};
  // 저장 클릭시 기존 tag 저장 로직 유지
  isEditMode = false;
  lockTags();

  toggleDateEditable(false);

  dataEls.forEach((el) => {
    const key = el.dataset.key;

    // 태그는 배열로 저장
    if (key === "movieTagList") {
      const tags = [...el.querySelectorAll(".tag-text")]
        .map((tag) => tag.innerText.replace(/\u00A0/g, " ").trim())
        .filter(Boolean);

      saveData[key] = tags;
      return;
    }

    let raw;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      raw = el.value; // input/textarea
    } else {
      raw = el.innerText ?? ""; // contenteditable/일반 엘리먼트
    }

    // 공통 정리(개행/nbsp 정규화)
    raw = raw.replace(/\r\n?/g, "\n").replace(/\u00A0/g, " ");

    //리뷰만 줄바꿈 유지, 나머지는 한 줄 정리
    const clean =
      key === "writeReview"
        ? raw
            .split("\n")
            .map((line) => line.trimEnd())
            .join("\n")
            .trim()
        : raw
            .replace(/\n+/g, " ")
            .replace(/[ \t]+/g, " ")
            .trim();

    saveData[key] = clean;
  });

  // 아이콘 상태 저장
  saveData.actorIconOne =
    document.querySelector(".actor-card-one .actor-card-click")?.dataset.icon ??
    "";

  saveData.actorIconTwo =
    document.querySelector(".actor-card-two .actor-card-click")?.dataset.icon ??
    "";

  saveData.actorIconThree =
    document.querySelector(".actor-card-three .actor-card-click")?.dataset
      .icon ?? "";

  //로컬스토리지 저장
  saveData.starScore = rating; //1~5 숫자 점수로 저장
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));

  // DEBUG PANEL 출력
  const debug = document.getElementById("debug-data");
  if (debug) debug.textContent = JSON.stringify(saveData, null, 2);

  // 저장 후 편집 잠금
  document.querySelectorAll("[contenteditable]").forEach((el) => {
    el.setAttribute("contenteditable", "false");
  });
  isEditMode = false;
  document.body.classList.remove("editing");
});

//Tag - control
const tagContainer = document.querySelector(".move-tag-list");
const plusclick = document.querySelector(".tag-plus i");
const minusclick = document.querySelector(".tag-min i");

//tagContainer div 생성 기준 최대/ 최소
const tagMin = 2;
const tagMax = 10;

// 태그 숫자 카운트
function getTagCount() {
  return tagContainer.querySelectorAll(":scope > .tag").length;
}

// 편집 잠금(저장모드/초기 진입)
function lockTags() {
  // 컨테이너 자체는 항상 편집 금지
  tagContainer.setAttribute("contenteditable", "false");

  // 태그 텍스트도 잠금
  tagContainer.querySelectorAll(".tag-text").forEach((t) => {
    t.setAttribute("contenteditable", "false");
  });
}

// 편집 모드에서: "클릭한 태그만" 편집 열기
function unlockTags() {
  // 컨테이너는 계속 잠금 유지
  tagContainer.setAttribute("contenteditable", "false");

  // 기존에 열려있던 tag-text 전부 닫기
  tagContainer.querySelectorAll(".tag-text").forEach((t) => {
    t.setAttribute("contenteditable", "false");
  });
}

// 처음 로드시 태그 잠금
lockTags();

// 태그 클릭하면 편집 열기 (편집모드일 때만)
tagContainer.addEventListener("mousedown", (e) => {
  if (!isEditMode) return;

  const textEl = e.target.closest(".tag-text");
  if (!textEl) return;

  tagContainer.querySelectorAll(".tag-text").forEach((t) => {
    if (t !== textEl) {
      t.setAttribute("contenteditable", "false");
    }
  });
  textEl.setAttribute("contenteditable", "true");
});

//  Backspace로 '#' 지우는 거 방지 + Enter 줄바꿈 방지
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

// + 버튼
plusclick.addEventListener("click", () => {
  if (!isEditMode) return;
  addTag();
});

// - 버튼
minusclick.addEventListener("click", () => {
  if (!isEditMode) return;
  removeTag();
});

// 태그 추가
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
  span.setAttribute("contenteditable", "false");
  tag.appendChild(span);
  tagContainer.appendChild(tag);

  // 새로 추가된 태그는 바로 입력 가능하게 열어주기
  if (isEditMode) {
    tagContainer.querySelectorAll(".tag-text").forEach((t) => {
      t.setAttribute("contenteditable", "false");
    });

    span.setAttribute("contenteditable", "true");
    span.focus();

    const range = document.createRange();
    range.selectNodeContents(span);
    range.collapse(false);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

// 태그 삭제
function removeTag() {
  const count = getTagCount();
  if (count <= tagMin) {
    alert(`태그는 최소 ${tagMin}개는 유지해야 합니다.`);
    return;
  }

  const last = tagContainer.querySelector(":scope > .tag:last-child");
  if (!last) return;

  last.remove();
}

// 편집 / 저장 모드 알림창
function toast(msg, ms = 1500) {
  const el = document.createElement("div");
  el.className = "rin-toast";
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, ms);
}

EditBtn.addEventListener("click", () => {
  isEditMode = true;
  toast("편집모드 ON 💡");
});
SaveBtn.addEventListener("click", () => {
  isEditMode = false;
  toast("저장완료 ☑️ ");
});
