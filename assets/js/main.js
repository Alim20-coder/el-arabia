// Master JavaScript for Arabia Building Co. (الشركة العربية للمنازل للتجارة العامة والمقاولات)
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Dropdown Click Handler (Desktop + Mobile)
  const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
  dropdownItems.forEach(item => {
    const triggerLink = item.querySelector('.nav-link');
    if (triggerLink) {
      triggerLink.addEventListener('click', (e) => {
        e.preventDefault(); // منع القفز إلى #services
        e.stopPropagation();

        // إغلاق أي قوائم منسدلة أخرى مفتوحة
        dropdownItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });

        // فتح / إغلاق القائمة من النص عند الضغط
        item.classList.toggle('active');
      });
    }

    // التعامل مع روابط الخدمات داخل القائمة
    const dropdownMenu = item.querySelector('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.addEventListener('click', (e) => {
        const clickedLink = e.target.closest('.dropdown-link');
        if (clickedLink) {
          // عند الضغط على أي خدمة يتم إغلاق القائمة بعد التنقل
          if (window.innerWidth <= 992 && navMenu) {
            navMenu.classList.remove('active');
          }
          item.classList.remove('active');
        } else {
          e.stopPropagation();
        }
      });
    }
  });

  // إغلاق القائمة عند النقر خارجها في أي مكان بالصفحة
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item-dropdown')) {
      dropdownItems.forEach(item => item.classList.remove('active'));
    }
  });

  // Accordion (FAQ - Matches Screenshot 10)
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other accordion items in the same container
      const parentContainer = item.closest('.faq-card') || document;
      parentContainer.querySelectorAll('.accordion-item').forEach(other => {
        other.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Stats Counters Animation
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = Math.ceil(target / 40);
          
          const counter = setInterval(() => {
            count += speed;
            if (count >= target) {
              el.innerText = `${prefix}${target.toLocaleString()}${suffix}`;
              clearInterval(counter);
            } else {
              el.innerText = `${prefix}${count.toLocaleString()}${suffix}`;
            }
          }, 35);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(num => observer.observe(num));
  }

  // Filter Tabs in Projects Gallery
  const filterBtns = document.querySelectorAll('.filter-btn');
  const mediaCards = document.querySelectorAll('.media-card[data-category]');
  if (filterBtns.length > 0 && mediaCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        mediaCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (filter === 'all' || cardCat.includes(filter)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox Modal for Photos & Videos
  const modal = document.getElementById('mediaModal');
  const modalHolder = document.getElementById('modalMediaHolder');
  const modalTitle = document.getElementById('modalTitle');
  const modalWhatsapp = document.getElementById('modalWhatsapp');
  const modalClose = document.getElementById('modalClose');

  if (modal && modalHolder) {
    // Open modal on image click
    document.querySelectorAll('.open-image-lightbox').forEach(imgWrap => {
      imgWrap.addEventListener('click', () => {
        const imgSrc = imgWrap.getAttribute('data-src') || imgWrap.querySelector('img')?.src;
        const title = imgWrap.getAttribute('data-title') || 'مشروع تصميم وتشطيب فاخر';
        
        modalHolder.innerHTML = `<img src="${imgSrc}" alt="${title}" style="max-width:100%; max-height:75vh; border-radius:12px; object-fit:contain;">`;
        if (modalTitle) modalTitle.innerText = title;
        if (modalWhatsapp) {
          modalWhatsapp.href = `https://wa.me/96565600310?text=${encodeURIComponent('مرحباً، أود الاستفسار عن هذا المشروع المعروض في موقعكم: ' + title)}`;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Open modal on video click
    document.querySelectorAll('.open-video-lightbox').forEach(vidWrap => {
      vidWrap.addEventListener('click', () => {
        const vidSrc = vidWrap.getAttribute('data-src');
        const title = vidWrap.getAttribute('data-title') || 'فيديو توثيقي لأعمال التشطيب والتنفيذ';
        
        modalHolder.innerHTML = `
          <video controls autoplay style="width:100%; max-height:75vh; border-radius:12px; outline:none;">
            <source src="${vidSrc}" type="video/mp4">
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        `;
        if (modalTitle) modalTitle.innerText = title;
        if (modalWhatsapp) {
          modalWhatsapp.href = `https://wa.me/96565600310?text=${encodeURIComponent('مرحباً، شاهدت فيديو المشروع في موقعكم وأرغب باستشارة مجانية: ' + title)}`;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close modal function
    const closeModal = () => {
      modal.classList.remove('active');
      modalHolder.innerHTML = '';
      document.body.style.overflow = '';
    };

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Inquiry Form Handler
  const inquiryForms = document.querySelectorAll('form.inquiry-form');
  inquiryForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'جاري الإرسال...';
      submitBtn.disabled = true;

      setTimeout(() => {
        const nameInput = form.querySelector('[name="name"]');
        const phoneInput = form.querySelector('[name="phone"]');
        const serviceInput = form.querySelector('[name="service"]');
        const notesInput = form.querySelector('[name="notes"]');
        
        const name = nameInput ? nameInput.value : '';
        const phone = phoneInput ? phoneInput.value : '';
        const service = serviceInput ? serviceInput.value : '';
        const notes = notesInput ? notesInput.value : '';

        form.innerHTML = `
          <div style="text-align:center; padding: 2.5rem 1rem;">
            <div style="width:64px; height:64px; background:rgba(37,211,102,0.15); border:2px solid #25d366; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 1.2rem; color:#25d366; font-size:2rem;">✓</div>
            <h3 style="color:#fff; margin-bottom:0.8rem; font-size:1.4rem;">تم استلام طلبك بنجاح!</h3>
            <p style="color:#9da8c3; font-size:0.95rem; margin-bottom:1.5rem;">شكراً لتواصلك مع الشركة العربية للمنازل. سيقوم مهندسنا التنفيذي بالاتصال بك على الرقم <strong>${phone}</strong> لتقديم الاستشارة وتحديد موعد المعاينة المجانية.</p>
            <a href="https://wa.me/96565600310?text=${encodeURIComponent(`السلام عليكم، قمت بإرسال طلب استشارة للخدمة (${service})، اسمي: ${name}، ورقمي: ${phone}. التفاصيل: ${notes}`)}" target="_blank" class="btn btn-gold" style="display:inline-flex;">تواصل معنا فوراً عبر واتساب</a>
          </div>
        `;
      }, 700);
    });
  });

  // ====================================================
  // HERO BACKGROUND SLIDESHOW LOGIC
  // ====================================================
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroPrev = document.querySelector('.hero-arrow.prev');
  const heroNext = document.querySelector('.hero-arrow.next');
  let currentHeroSlide = 0;
  let heroTimer = null;

  function showHeroSlide(index) {
    if (!heroSlides.length) return;
    if (index >= heroSlides.length) currentHeroSlide = 0;
    else if (index < 0) currentHeroSlide = heroSlides.length - 1;
    else currentHeroSlide = index;

    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentHeroSlide);
    });

    heroDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentHeroSlide);
    });
  }

  function nextHeroSlide() {
    showHeroSlide(currentHeroSlide + 1);
  }

  function prevHeroSlide() {
    showHeroSlide(currentHeroSlide - 1);
  }

  function startHeroTimer() {
    if (heroSlides.length > 1) {
      clearInterval(heroTimer);
      heroTimer = setInterval(nextHeroSlide, 4500);
    }
  }

  if (heroSlides.length > 0) {
    startHeroTimer();

    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showHeroSlide(i);
        startHeroTimer();
      });
    });

    if (heroPrev) {
      heroPrev.addEventListener('click', () => {
        prevHeroSlide();
        startHeroTimer();
      });
    }

    if (heroNext) {
      heroNext.addEventListener('click', () => {
        nextHeroSlide();
        startHeroTimer();
      });
    }
  }

  // ====================================================
  // SHORTS CAROUSEL INTERACTION (SCREENSHOT 4)
  // ====================================================
  const trackWrap = document.querySelector('.shorts-track-wrap');
  const carouselItems = document.querySelectorAll('.carousel-card-item');
  const carouselPrevBtn = document.querySelector('.carousel-nav-btn.prev-btn');
  const carouselNextBtn = document.querySelector('.carousel-nav-btn.next-btn');

  if (trackWrap && carouselItems.length > 0) {
    // Arrow buttons navigation
    if (carouselPrevBtn) {
      carouselPrevBtn.addEventListener('click', () => {
        trackWrap.scrollBy({ left: 260, behavior: 'smooth' });
      });
    }
    if (carouselNextBtn) {
      carouselNextBtn.addEventListener('click', () => {
        trackWrap.scrollBy({ left: -260, behavior: 'smooth' });
      });
    }

    // Drag to scroll
    let isDown = false;
    let startX;
    let scrollLeft;

    trackWrap.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - trackWrap.offsetLeft;
      scrollLeft = trackWrap.scrollLeft;
    });

    trackWrap.addEventListener('mouseleave', () => {
      isDown = false;
    });

    trackWrap.addEventListener('mouseup', () => {
      isDown = false;
    });

    trackWrap.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - trackWrap.offsetLeft;
      const walk = (x - startX) * 1.5;
      trackWrap.scrollLeft = scrollLeft - walk;
    });

    // Update center featured item on scroll
    function updateFeaturedCard() {
      const wrapRect = trackWrap.getBoundingClientRect();
      const centerX = wrapRect.left + wrapRect.width / 2;

      let closestItem = null;
      let minDistance = Infinity;

      carouselItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.abs(centerX - itemCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestItem = item;
        }
      });

      carouselItems.forEach(item => item.classList.remove('featured'));
      if (closestItem) {
        closestItem.classList.add('featured');
      }
    }

    trackWrap.addEventListener('scroll', updateFeaturedCard);
    // Initial call
    setTimeout(updateFeaturedCard, 200);
  }

  // Handle click on all Shorts cards to open in video modal
  document.querySelectorAll('.open-shorts-video').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if dragging
      const videoSrc = card.getAttribute('data-video');
      const title = card.getAttribute('data-title') || 'فيديو مشروع من أعمالنا في الكويت';

      if (videoSrc && modal && modalHolder) {
        modalHolder.innerHTML = `
          <video controls autoplay playsinline style="max-width:100%; max-height:80vh; border-radius:12px; outline:none; background:#000;">
            <source src="${videoSrc}" type="video/mp4">
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        `;
        if (modalTitle) modalTitle.innerText = title;
        if (modalWhatsapp) {
          modalWhatsapp.href = `https://wa.me/96565600310?text=${encodeURIComponent('مرحباً، شاهدت فيديو المشروع (' + title + ') في موقعكم وأرغب باستشارة مجانية')}`;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // ====================================================

  // HERO PURE SLIDER (FULL-WIDTH CHANGING PHOTOS)
  // ====================================================
  const pureSlides = document.querySelectorAll('.hero-pure-slide');
  const pureDots = document.querySelectorAll('.hero-pure-dot');
  const purePrev = document.querySelector('.hero-pure-arrow.prev');
  const pureNext = document.querySelector('.hero-pure-arrow.next');
  let currentPureSlide = 0;
  let pureTimer = null;

  function showPureSlide(index) {
    if (!pureSlides.length) return;
    if (index >= pureSlides.length) currentPureSlide = 0;
    else if (index < 0) currentPureSlide = pureSlides.length - 1;
    else currentPureSlide = index;

    pureSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentPureSlide);
    });

    pureDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentPureSlide);
    });
  }

  function nextPureSlide() {
    showPureSlide(currentPureSlide + 1);
  }

  function prevPureSlide() {
    showPureSlide(currentPureSlide - 1);
  }

  if (pureSlides.length > 0) {
    pureTimer = setInterval(nextPureSlide, 4000);

    pureDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(pureTimer);
        showPureSlide(i);
        pureTimer = setInterval(nextPureSlide, 4000);
      });
    });

    if (purePrev) {
      purePrev.addEventListener('click', () => {
        clearInterval(pureTimer);
        prevPureSlide();
        pureTimer = setInterval(nextPureSlide, 4000);
      });
    }

    if (pureNext) {
      pureNext.addEventListener('click', () => {
        clearInterval(pureTimer);
        nextPureSlide();
        pureTimer = setInterval(nextPureSlide, 4000);
      });
    }
  }
});
