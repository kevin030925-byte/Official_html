/**
 * 대학생 개인 웹사이트 인터랙션 및 기능 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollSpy();
  initProjectFilter();
  initProjectModal();
  initResumeModal();
  initEmailCopy();
  initBackToTop();
  
  // Lucide Icons 초기화
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/* ==========================================================================
   1. 테마 모드 제어 (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const userTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // 초기 테마 설정
  if (userTheme === 'dark' || (!userTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // 테마 토글 버튼 이벤트
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      
      // 아이콘 업데이트
      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  });

  // 시스템 테마 변경 감지
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
}

/* ==========================================================================
   2. 모바일 메뉴 (Drawer)
   ========================================================================== */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('flex');
    } else {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
    }
  });

  // 링크 클릭 시 모바일 메뉴 자동 닫기
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
    });
  });

  // 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
    }
  });
}

/* ==========================================================================
   3. 스크롤 스파이 (현재 섹션 네비게이션 하이라이트)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-primary-600', 'dark:text-primary-400', 'font-semibold');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-primary-600', 'dark:text-primary-400', 'font-semibold');
      }
    });
  });
}

/* ==========================================================================
   4. 프로젝트 & 자료 필터링
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // 버튼 활성화 스타일 업데이트
      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
      });
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');

      // 카드 필터링 처리
      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.classList.add('flex');
        } else {
          card.classList.add('hidden');
          card.classList.remove('flex');
        }
      });
    });
  });
}

/* ==========================================================================
   5. 프로젝트 상세 모달
   ========================================================================== */
// 프로젝트 샘플 데이터
const projectData = {
  1: {
    title: "스마트 캠퍼스 길찾기 & 강의실 예약 웹앱",
    category: "팀 프로젝트",
    date: "2024.03 - 2024.06 (1학기)",
    description: "신입생 및 재학생을 위한 캠퍼스 건물 내 실내 지도 및 비어있는 강의실 실시간 예약 시스템입니다. GPS 및 실내 비콘 연동 기술을 연구하고, 직관적인 UI로 구현하여 학과 캡스톤 디자인 경진대회 최우수상을 수상했습니다.",
    tags: ["React", "Node.js", "Express", "Tailwind CSS", "MongoDB"],
    links: {
      github: "https://github.com",
      demo: "https://example.com",
      drive: "https://drive.google.com",
      notion: "https://notion.so"
    },
    highlights: [
      "반응형 웹 디자인으로 모바일/태블릿/PC 전 기기 완벽 지원",
      "복잡한 강의동 내부 층별 길찾기 알고리즘 구현 (A* 알고리즘 적용)",
      "동시 예약 충돌 방지를 위한 트랜잭션 처리 최적화"
    ]
  },
  2: {
    title: "운영체제 가상 메모리 시뮬레이터",
    category: "전공 과제",
    date: "2024.04 (운영체제 전공과목)",
    description: "운영체제 수업의 핵심 과제로, 페이지 교체 알고리즘(LRU, FIFO, OPT, LFU)의 동작 원리를 가시화하고 페이지 폴트(Page Fault) 발생률을 비교 분석한 시뮬레이션 프로젝트입니다.",
    tags: ["C++", "Qt", "Data Structures", "Algorithms"],
    links: {
      github: "https://github.com",
      drive: "https://drive.google.com"
    },
    highlights: [
      "LRU, FIFO, OPT 알고리즘별 성능 벤치마크 차트 자동 생성",
      "메모리 프레임 크기(3~10)에 따른 Belady's Anomaly 현상 실증 분석",
      "과제 만점(A+) 및 교수님 우수 과제 선정"
    ]
  },
  3: {
    title: "대학생 스터디 매칭 & 자료 공유 플랫폼",
    category: "개인 프로젝트",
    date: "2024.07 - 2024.08 (여름방학)",
    description: "교내 학생들이 관심사나 전공 스터디원을 손쉽게 모집하고 과제/시험 족보 및 요약 노트를 공유할 수 있는 커뮤니티 플랫폼입니다. Firebase 기반 인증 및 실시간 채팅을 구현했습니다.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    links: {
      github: "https://github.com",
      demo: "https://example.com",
      notion: "https://notion.so"
    },
    highlights: [
      "실시간 스터디 모집 현황 및 필터링 기능 (온/오프라인, 학년, 학과별)",
      "Firebase Firestore를 활용한 실시간 알림 및 채팅방 구현",
      "Markdown 에디터 탑재로 학습 자료 포스팅 및 코드 하이라이팅 지원"
    ]
  },
  4: {
    title: "컴퓨터 네트워크 소켓 기반 파일 전송 시스템",
    category: "전공 과제",
    date: "2023.11 (컴퓨터 네트워크)",
    description: "TCP/IP 소켓 프로그래밍을 활용한 멀티스레드 기반의 안정적인 파일 업로드/다운로드 클라이언트-서버 시스템입니다. 패킷 손실 및 전송 체크섬 검증을 직접 구현했습니다.",
    tags: ["Python", "Socket", "Multi-threading", "TCP/IP"],
    links: {
      github: "https://github.com",
      drive: "https://drive.google.com"
    },
    highlights: [
      "대용량 파일(1GB+) 분할 스트리밍 전송 및 MD5 무결성 검증",
      "동시 다중 접속 처리를 위한 스레드 풀 구조 설계",
      "전송 진행률 표시 및 CLI 프로그레스 바 구현"
    ]
  },
  5: {
    title: "알고리즘 및 코딩테스트 핵심 풀이 노트",
    category: "학습자료 & 연구",
    date: "2023.09 - 진행 중",
    description: "백준(BOJ) 골드 이상, 프로그래머스 레벨 3~4 난이도의 알고리즘 문제 풀이 및 핵심 테크닉(DP, Dijkstra, Segment Tree, Union-Find 등)을 체계적으로 정리한 Notion 워크스페이스입니다.",
    tags: ["Algorithm", "Notion", "Python", "Problem Solving"],
    links: {
      notion: "https://notion.so",
      github: "https://github.com"
    },
    highlights: [
      "유형별 문제 150+개 풀이 및 접근 전략 상세 수록",
      "시간/공간 복잡도 최적화 팁 및 빈출 반례 모음집",
      "외부 스터디 그룹원 20여 명에게 공유 및 활용 중"
    ]
  },
  6: {
    title: "머신러닝 기반 캠퍼스 분실물 이미지 검색 AI",
    category: "팀 프로젝트",
    date: "2023.09 - 2023.12 (인공지능 실습)",
    description: "학생들이 캠퍼스에서 잃어버린 물건(지갑, 무선이어폰, 학생증 등) 사진을 올리면 유사한 분실물 습득 공고를 Vision AI 모델이 매칭해주는 서비스 프로토타입입니다.",
    tags: ["PyTorch", "ResNet", "FastAPI", "React"],
    links: {
      github: "https://github.com",
      drive: "https://drive.google.com",
      demo: "https://youtube.com"
    },
    highlights: [
      "ResNet50 기반의 특징 벡터 추출 및 코사인 유사도 검색",
      "FastAPI를 통한 경량 임베딩 서버 구축 및 0.3초 내 검색 결과 반환",
      "유튜브 데모 시연 영상 및 최종 결과 보고서 완료"
    ]
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const openBtns = document.querySelectorAll('.open-project-modal');

  if (!modal) return;

  function openModal(id) {
    const data = projectData[id];
    if (!data) return;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-category').textContent = data.category;
    document.getElementById('modal-date').textContent = data.date;
    document.getElementById('modal-description').textContent = data.description;

    // 태그 렌더링
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = data.tags.map(tag => 
      `<span class="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">${tag}</span>`
    ).join('');

    // 핵심 성과 렌더링
    const highlightsContainer = document.getElementById('modal-highlights');
    highlightsContainer.innerHTML = data.highlights.map(item => 
      `<li class="flex items-start text-sm text-slate-600 dark:text-slate-300">
        <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0"></i>
        <span>${item}</span>
      </li>`
    ).join('');

    // 링크 버튼들 렌더링
    const linksContainer = document.getElementById('modal-links');
    let linksHtml = '';
    
    if (data.links.github) {
      linksHtml += `<a href="${data.links.github}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 transition">
        <i data-lucide="github" class="w-4 h-4"></i> GitHub 저장소
      </a>`;
    }
    if (data.links.demo) {
      linksHtml += `<a href="${data.links.demo}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition">
        <i data-lucide="external-link" class="w-4 h-4"></i> 실시간 데모
      </a>`;
    }
    if (data.links.drive) {
      linksHtml += `<a href="${data.links.drive}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 transition">
        <i data-lucide="file-text" class="w-4 h-4"></i> 발표자료 / 보고서
      </a>`;
    }
    if (data.links.notion) {
      linksHtml += `<a href="${data.links.notion}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition">
        <i data-lucide="book-open" class="w-4 h-4"></i> Notion 정리글
      </a>`;
    }

    linksContainer.innerHTML = linksHtml;

    // 아이콘 갱신
    if (window.lucide) {
      window.lucide.createIcons();
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      openModal(id);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. 이력서 (CV) 미리보기 및 인쇄 모달
   ========================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtns = document.querySelectorAll('.open-resume-modal');
  const closeResumeBtn = document.getElementById('resume-modal-close');
  const resumeBackdrop = document.getElementById('resume-backdrop');
  const printResumeBtn = document.getElementById('print-resume-btn');

  if (!resumeModal) return;

  function openResume() {
    resumeModal.classList.remove('hidden');
    resumeModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  }

  function closeResume() {
    resumeModal.classList.add('hidden');
    resumeModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResume();
    });
  });

  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);
  if (resumeBackdrop) resumeBackdrop.addEventListener('click', closeResume);
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !resumeModal.classList.contains('hidden')) {
      closeResume();
    }
  });
}

/* ==========================================================================
   7. 이메일 원클릭 복사 및 Toast 알림
   ========================================================================== */
function initEmailCopy() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailSpan = document.getElementById('email-address');

  if (!copyBtn || !emailSpan) return;

  copyBtn.addEventListener('click', () => {
    const email = emailSpan.textContent.trim();
    navigator.clipboard.writeText(email).then(() => {
      showToast('이메일 주소가 클립보드에 복사되었습니다! 🎉');
    }).catch(err => {
      console.error('클립보드 복사 실패:', err);
      showToast('이메일 복사에 실패했습니다. 수동으로 복사해주세요.');
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3000);
}

/* ==========================================================================
   8. 맨 위로 가기 버튼 (Back to top)
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

