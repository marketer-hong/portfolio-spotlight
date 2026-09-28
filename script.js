document.addEventListener("DOMContentLoaded", function () {
    // --- 1. Fade-in Observer ---
    const fadeElements = document.querySelectorAll(".fade-in");
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => observer.observe(element));


    // --- 2. Story Section Carousel Slider ---
    const track = document.querySelector(".story-carousel-track");
    const slides = document.querySelectorAll(".story-slide");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const dotsContainer = document.querySelector(".carousel-dots");

    if (track && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;

        // 동적 인디케이터 Dot 생성
        slides.forEach((_, index) => {
            const dot = document.createElement("div");
            dot.classList.add("carousel-dot");
            if (index === 0) dot.classList.add("active");
            dot.addEventListener("click", () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll(".carousel-dot");

        function updateSlidePosition() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateSlidePosition();
        }

        prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
            updateSlidePosition();
        });

        nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
            updateSlidePosition();
        });

        // 윈도우 리사이즈 시 트랙 위치 재조정
        window.addEventListener("resize", updateSlidePosition);

        // 터치 스와이프 제스처 지원 (모바일 환경)
        let startX = 0;
        let endX = 0;
        const minSwipeDistance = 50; // 스와이프로 인식할 최소 거리(px)

        track.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener("touchend", (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const diffX = startX - endX;
            if (Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    // 왼쪽으로 스와이프 -> 다음 슬라이드
                    currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
                } else {
                    // 오른쪽으로 스와이프 -> 이전 슬라이드
                    currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
                }
                updateSlidePosition();
            }
        }
    }


    // --- 3. Case Studies Counter Animation ---
    const budgetCard = document.querySelector(".budget-summary-card");
    let animated = false;

    if (budgetCard) {
        const budgetObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    
                    // Counter 애니메이션
                    const counter = document.querySelector(".budget-counter");
                    if (counter) {
                        const target = +counter.getAttribute("data-target");
                        const duration = 2000;
                        const stepTime = 20;
                        const steps = duration / stepTime;
                        const increment = target / steps;
                        let current = 0;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                counter.textContent = target.toLocaleString();
                                clearInterval(timer);
                            } else {
                                counter.textContent = Math.floor(current).toLocaleString();
                            }
                        }, stepTime);
                    }
                }
            });
        }, { threshold: 0.2 }); // 카드 요소의 20%만 보이면 즉시 애니메이션 시작

        budgetObserver.observe(budgetCard);
    }
    
    // --- 4. Case Studies Graphs & Badges Animation ---
    const caseCards = document.querySelectorAll(".case-card");
    const caseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
                // Case 1: ROAS 그래프 애니메이션
                const roasFill = entry.target.querySelector(".roas-fill");
                if (roasFill) {
                    roasFill.classList.add("animate");
                }
                
                // Case 2: 다중 KPI 그래프 길이 애니메이션
                const kpiFills = entry.target.querySelectorAll(".kpi-fill");
                kpiFills.forEach(fill => {
                    fill.style.width = fill.getAttribute("data-width");
                });

                // Case 3 & 4: Growth / Improvement 수치 카운트업
                const animCounters = entry.target.querySelectorAll(".anim-counter");
                animCounters.forEach(counter => {
                    if (!counter.classList.contains("animated")) {
                        counter.classList.add("animated");
                        const target = +counter.getAttribute("data-target");
                        const duration = 1500;
                        const stepTime = 20;
                        const steps = duration / stepTime;
                        const increment = target / steps;
                        let current = 0;
                        
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                counter.textContent = target;
                                clearInterval(timer);
                            } else {
                                counter.textContent = Math.floor(current);
                            }
                        }, stepTime);
                    }
                });
            }
        });
    }, { threshold: 0.3 }); // 카드가 30% 보이면 애니메이션 시작

    caseCards.forEach(card => caseObserver.observe(card));

    // --- 5. Floating Contact Button Observer (Contact 섹션 감지 시 숨김) ---
    const floatingBtn = document.getElementById("floating-btn");
    const contactSection = document.getElementById("contact");

    if (floatingBtn && contactSection) {
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Contact 섹션이 화면에 15% 이상 들어오면 플로팅 버튼 숨김
                if (entry.isIntersecting) {
                    floatingBtn.classList.add("hidden");
                } else {
                    floatingBtn.classList.remove("hidden");
                }
            });
        }, { threshold: 0.15 });

        contactObserver.observe(contactSection);
    }
    
    // --- 6. 이메일 주소 복사 및 토스트 알림 기능 ---
    const copyEmailBtn = document.getElementById("copy-email-btn");
    const toastAlert = document.getElementById("toast-alert");
    let toastTimeout;

    if (copyEmailBtn && toastAlert) {
        copyEmailBtn.addEventListener("click", function () {
            const email = "musseolchin@gmail.com";

            navigator.clipboard.writeText(email).then(() => {
                // 연속 클릭 시 기존 타이머 초기화
                clearTimeout(toastTimeout);

                // 말풍선 알림 표시
                toastAlert.classList.add("show");

                // 2.5초 후 말풍선 알림 서서히 숨기기
                toastTimeout = setTimeout(() => {
                    toastAlert.classList.remove("show");
                }, 2500);
            }).catch(err => {
                console.error("클립보드 복사 실패:", err);
            });
        });
    }
    
    // --- 7. Navigation Scrollspy (스크롤 위치 감지 네비게이션 하이라이트) ---
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    if (sections.length > 0 && navLinks.length > 0) {
        const spyObserverOptions = {
            root: null,
            rootMargin: "-20% 0px -65% 0px", // 화면 상단 기준 인식 범위 조정
            threshold: 0
        };

        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach(link => {
                        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                    });
                }
            });
        }, spyObserverOptions);

        sections.forEach(section => spyObserver.observe(section));
    }

});