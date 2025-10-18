
// edit.html 페이지로 이동 
const resite = document.getElementById('new-res-go');

clicknext = () => {
    window.location.href='edit.html'
};
resite.addEventListener('click', clicknext);




document.addEventListener('DOMContentLoaded', () => {
  const starbox = document.querySelector('.star-score');
  if (!starbox) {
    console.warn('star-score div box서칭 실패');
    return;
  }

  // 장식이 클릭 막지 않게
  const overlay = starbox.querySelector('.top-box-dot-line');
  if (overlay) overlay.style.pointerEvents = 'none';

  // 화면에서의 x좌표(왼→오)로 정렬한 리스트 만들기
  const starsByX = [...starbox.querySelectorAll('span[data-score]')]
    .sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);

  starbox.addEventListener('pointerdown', (e) => {
    const span = e.target.closest('span[data-score]');
    if (!span || !starbox.contains(span)) return;

    // 보이는 순서 기준 1~5 점수
    const score = starsByX.indexOf(span) + 1;
    console.log('점수:', score);
  });
});


    