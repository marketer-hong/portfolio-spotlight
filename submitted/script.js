document.addEventListener("DOMContentLoaded", function () {
    // 랜딩 페이지 카드가 부드럽게 상승하며 나타나는 애니메이션 효과
    const thanksCard = document.getElementById("thanksCard");

    if (thanksCard) {
        // 브라우저 렌더링 준비 후 실행되도록 미세한 지연(50ms) 부여
        setTimeout(() => {
            thanksCard.classList.add("visible");
        }, 50);
    }
});