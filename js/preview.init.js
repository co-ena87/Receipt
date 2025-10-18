// 프리뷰: 보기 전용
document.addEventListener('DOMContentLoaded', () => {
  StarRating.mount('.star-score', {
    storageKey: 'resite:v1',
    field: 'rating',
    interactive: false,  // 조작 X
    step: 0.5
  });
});