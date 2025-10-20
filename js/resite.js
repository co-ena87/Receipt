
// edit.html 페이지로 이동 
const resite = document.getElementById('new-res-go');

clicknext = () => {
    window.location.href='edit.html'
};
resite.addEventListener('click', clicknext);

//별점 스코어

const staricons = document.getElementById('#star-icons i');
console.log('staricons')