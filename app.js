/**
 * SomniSpectra - Main Application Script
 * =====================================
 * Modules:
 * - Carousel
 * - Mobile Menu
 * - Scroll Animations
 * - Navigation Highlight
 * - Modal
 * - Contact Form Validation
 * - Toast Notifications
 */

(function() {
  'use strict';

  // ==================== DOM Elements ====================
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // ==================== Carousel Module ====================
  const Carousel = {
    currentSlide: 0,
    slides: null,
    dots: null,
    autoplayInterval: null,
    autoplayDelay: 5000,
    touchStartX: 0,
    touchEndX: 0,

    init() {
      this.slides = $$('.carousel-slide');
      this.dots = $$('.carousel-dot');
      
      if (this.slides.length === 0) return;

      // Bind events
      $('.carousel-prev')?.addEventListener('click', () => this.prev());
      $('.carousel-next')?.addEventListener('click', () => this.next());
      
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.goTo(index));
      });

      // Touch events for mobile swipe
      const carousel = $('#heroCarousel');
      if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
          this.touchStartX = e.changedTouches[0].screenX;
          this.pauseAutoplay();
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
          this.touchEndX = e.changedTouches[0].screenX;
          this.handleSwipe();
          this.startAutoplay();
        }, { passive: true });
      }

      // Pause on hover
      carousel?.addEventListener('mouseenter', () => this.pauseAutoplay());
      carousel?.addEventListener('mouseleave', () => this.startAutoplay());

      this.startAutoplay();
    },

    goTo(index) {
      this.slides[this.currentSlide].classList.remove('active');
      this.dots[this.currentSlide].classList.remove('active');
      
      this.currentSlide = (index + this.slides.length) % this.slides.length;
      
      this.slides[this.currentSlide].classList.add('active');
      this.dots[this.currentSlide].classList.add('active');
    },

    next() {
      this.goTo(this.currentSlide + 1);
    },

    prev() {
      this.goTo(this.currentSlide - 1);
    },

    handleSwipe() {
      const threshold = 50;
      const diff = this.touchStartX - this.touchEndX;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    },

    startAutoplay() {
      this.pauseAutoplay();
      this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
    },

    pauseAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    }
  };

  // ==================== Hero Product Stack Module ====================
  const HeroProductStack = {
    slides: null,
    currentIndex: 0,
    autoplayInterval: null,
    autoplayDelay: 3000,

    init() {
      this.slides = $$('.hero-product-slide');
      if (this.slides.length === 0) return;

      this.updateSlides();
      this.startAutoplay();

      // Click to navigate
      this.slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
          this.goTo(index);
        });
      });

      // Pause on hover
      const stack = $('.hero-product-stack');
      if (stack) {
        stack.addEventListener('mouseenter', () => this.pauseAutoplay());
        stack.addEventListener('mouseleave', () => this.startAutoplay());
      }
    },

    goTo(index) {
      if (index === this.currentIndex) return;
      this.pauseAutoplay();
      this.currentIndex = index;
      this.updateSlides();
      this.startAutoplay();
    },

    updateSlides() {
      const total = this.slides.length;
      this.slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev', 'next');
        
        if (index === this.currentIndex) {
          slide.classList.add('active');
        } else if (index === (this.currentIndex - 1 + total) % total) {
          slide.classList.add('prev');
        } else if (index === (this.currentIndex + 1) % total) {
          slide.classList.add('next');
        }
      });
    },

    next() {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.updateSlides();
    },

    startAutoplay() {
      this.pauseAutoplay();
      this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
    },

    pauseAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    }
  };

  // ==================== Mobile Menu Module ====================
  const MobileMenu = {
    hamburger: null,
    menu: null,
    overlay: null,
    links: null,

    init() {
      this.hamburger = $('#hamburger');
      this.menu = $('#mobileMenu');
      this.overlay = $('#mobileMenuOverlay');
      this.links = $$('.mobile-nav-link, .mobile-cta');

      if (!this.hamburger || !this.menu) return;

      this.hamburger.addEventListener('click', () => this.toggle());
      this.overlay?.addEventListener('click', () => this.close());
      
      this.links.forEach(link => {
        link.addEventListener('click', () => this.close());
      });

      // Close on ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      });
    },

    isOpen() {
      return this.menu.classList.contains('active');
    },

    toggle() {
      if (this.isOpen()) {
        this.close();
      } else {
        this.open();
      }
    },

    open() {
      this.hamburger.classList.add('active');
      this.hamburger.setAttribute('aria-expanded', 'true');
      this.menu.classList.add('active');
      this.overlay.classList.add('active');
      document.body.classList.add('menu-open');
    },

    close() {
      this.hamburger.classList.remove('active');
      this.hamburger.setAttribute('aria-expanded', 'false');
      this.menu.classList.remove('active');
      this.overlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  };

  // ==================== Scroll Animations Module ====================
  const ScrollAnimations = {
    elements: null,
    observer: null,

    init() {
      this.elements = $$('.animate-on-scroll');
      
      if (this.elements.length === 0) return;

      const options = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer.unobserve(entry.target);
          }
        });
      }, options);

      this.elements.forEach(el => this.observer.observe(el));
    }
  };

  // ==================== Navigation Module ====================
  const Navigation = {
    navbar: null,
    navLinks: null,
    sections: null,
    indicator: null,
    isScrollingByClick: false,
    scrollEndTimeout: null,
    safetyTimeout: null,

    init() {
      this.navbar = $('#navbar');
      this.navLinks = $$('.nav-link');
      this.sections = $$('section[id], footer[id]');
      this.indicator = $('#navIndicator');

      // Scroll handler for navbar background
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
      
      // Resize handler for indicator position
      window.addEventListener('resize', () => this.updateIndicator(), { passive: true });
      
      // Block user scroll during click-triggered scroll
      this.blockScrollHandler = (e) => {
        if (this.isScrollingByClick) {
          e.preventDefault();
        }
      };
      window.addEventListener('wheel', this.blockScrollHandler, { passive: false });
      window.addEventListener('touchmove', this.blockScrollHandler, { passive: false });
      
      // Initial check
      this.handleScroll();
      
      // Update indicator after layout settles
      setTimeout(() => this.updateIndicator(), 100);

      // Smooth scroll for anchor links
      $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href && href !== '#') {
            e.preventDefault();
            const target = $(href);
            if (target) {
              const offsetTop = target.offsetTop - 80;
              const currentScrollY = window.scrollY;
              const scrollDistance = Math.abs(currentScrollY - offsetTop);
              
              // Check if already at target position (within 50px tolerance)
              const isAlreadyAtTarget = scrollDistance < 50;
              
              // Find and activate the corresponding nav link
              const targetNavLink = $(`.nav-link[href="${href}"]`);
              if (targetNavLink) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                targetNavLink.classList.add('active');
                this.updateIndicator();
              }
              
              // Only lock if actually need to scroll a significant distance
              if (!isAlreadyAtTarget) {
                this.isScrollingByClick = true;
                
                // Safety timeout: unlock after max expected scroll duration
                // Based on scroll distance, estimate max duration (roughly 1ms per pixel + 500ms buffer)
                const maxDuration = Math.min(Math.max(scrollDistance, 300), 1500);
                clearTimeout(this.safetyTimeout);
                this.safetyTimeout = setTimeout(() => {
                  this.isScrollingByClick = false;
                }, maxDuration);
                
                window.scrollTo({
                  top: offsetTop,
                  behavior: 'smooth'
                });
              }
            }
          }
        });
      });
    },

    updateIndicator() {
      const activeLink = $('.nav-link.active');
      if (!activeLink || !this.indicator) return;

      const navMenu = $('#navMenu');
      if (!navMenu) return;

      const menuRect = navMenu.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      
      const left = linkRect.left - menuRect.left;
      const width = linkRect.width;
      
      this.indicator.style.left = `${left}px`;
      this.indicator.style.width = `${width}px`;
    },

    handleScroll() {
      const scrollY = window.scrollY;

      // Navbar background
      if (scrollY > 50) {
        this.navbar?.classList.add('scrolled');
      } else {
        this.navbar?.classList.remove('scrolled');
      }

      // Detect scroll end and unlock indicator updates
      if (this.isScrollingByClick) {
        clearTimeout(this.scrollEndTimeout);
        this.scrollEndTimeout = setTimeout(() => {
          this.isScrollingByClick = false;
          clearTimeout(this.safetyTimeout); // Clear safety timeout when scroll ends normally
        }, 150);
        return;
      }

      // Check if at page bottom (for small footer)
      const isAtBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 50);

      // Active section highlighting
      let currentSection = '';
      
      if (isAtBottom) {
        // If at bottom, highlight contact/footer
        currentSection = 'contact';
      } else {
        this.sections.forEach(section => {
          const sectionTop = section.offsetTop - 150;
          const sectionHeight = section.offsetHeight;
          
          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
          }
        });
      }

      let activeChanged = false;
      this.navLinks.forEach(link => {
        const wasActive = link.classList.contains('active');
        const shouldBeActive = link.getAttribute('href') === `#${currentSection}`;
        
        if (wasActive !== shouldBeActive) {
          activeChanged = true;
        }
        
        link.classList.remove('active');
        if (shouldBeActive) {
          link.classList.add('active');
        }
      });

      // Update indicator only when active section changes
      if (activeChanged) {
        this.updateIndicator();
      }
    }
  };

  // ==================== Modal Module ====================
  const Modal = {
    overlay: null,
    modal: null,
    closeBtn: null,
    image: null,
    title: null,
    description: null,
    previousActiveElement: null,

    // Team member keys for portrait style
    teamMembers: ['noah', 'alex', 'jackie', 'rimon'],

    // Content data for different items
    content: {
      // Products
      pillow: {
        image: 'assets/pillow.webp',
        title: 'Smart Pillow',
        description: 'The Smart Pillow combines dual microphones, a pressure sensor matrix, and an IMU to capture sleep-relevant signals at the point of contact. It detects posture and head–neck support changes through pressure distribution, identifies turning and micro-movements via inertial sensing, and records breathing- and snoring-related acoustic patterns for event evidence and temporal correlation.\n\nKey Technical Features:\n• Dual microphones for snoring and breathing-event evidence\n• Pressure matrix for posture and pressure-distribution tracking\n• IMU for turning detection and motion timing alignment'
      },
      wristband: {
        image: 'assets/wristband.webp',
        title: 'Wristband',
        description: 'The Wristband provides continuous physiological monitoring using heart-rate and blood-oxygen sensing, combined with an IMU for activity context. It supports overnight trend tracking of cardiovascular dynamics and enables robust differentiation between sleep, wake, and movement-related artifacts through synchronized motion signals.\n\nKey Technical Features:\n• Heart-rate monitoring for overnight cardiovascular trends\n• SpO₂ sensing to support respiration-related screening signals\n• IMU for activity context and artifact reduction'
      },
      eyemask: {
        image: 'assets/Eyemask.webp',
        title: 'EEG Eye Mask',
        description: 'The EEG Eye Mask captures brain electrical activity to support objective sleep-stage inference. By providing neurophysiological evidence that complements peripheral signals, it strengthens interpretability for sleep architecture analysis, including transitions between stages and the continuity of restorative sleep periods.\n\nKey Technical Features:\n• EEG acquisition for objective neurophysiological evidence\n• Sleep-stage inference support for sleep architecture analysis\n• Complements peripheral signals for stronger interpretability'
      },
      // Team members
      noah: {
        image: 'assets/Noah.webp',
        title: 'Noah Huang',
        description: 'Noah Huang is the founder and CEO of SomniSpectra.\n\nWithin SleepSpectra, Noah leads STEM development end-to-end—from hardware prototyping to software implementation. He is responsible for building and integrating the three-device setup, establishing reliable data acquisition and synchronization, and developing the app workflow for signal visualization, AI-driven analysis, and reporting.\n\nGood sleep, in Noah\'s view, should not be treated as a score to chase, but as a system that can be understood, measured, and continuously improved.'
      },
      alex: {
        image: 'assets/Alex.webp',
        title: 'Alex Zhou',
        description: 'Alex Zhou serves as the team\'s Chief Content Officer (CCO). In this project, he focuses on developing the team\'s core innovation ideas and shaping how they are communicated to both judges and broader audiences.\n\nHe is responsible for scriptwriting, presentation structure, and the overall narrative logic, ensuring that complex technical concepts are expressed with clarity, accuracy, and persuasion. He also leads the planning and coordination of the project video, aligning content flow, visual rhythm, and scene arrangement so that the final delivery is coherent, engaging, and memorable.\n\nAlex approaches communication as an extension of research itself, where ideas are assessed not only by technical soundness, but also by whether they can be articulated precisely and understood reliably. Through this lens, he helps the team present its work with both academic rigor and effective public-facing expression.'
      },
      jackie: {
        image: 'assets/Jackie.webp',
        title: 'Jackie Lin',
        description: 'Jackie Lin serves as the team\'s Chief Information Officer (CIO). In this project, he is responsible for structuring the project\'s information framework and transforming raw data and ideas into a compelling, well-supported narrative.\n\nHis work encompasses scriptwriting, data research and analysis, resource integration, and the logical sequencing of the promotional video. He also contributes his voice for part of the voiceover and appears as an actor in the project\'s mini-drama, helping ensure the team\'s message is delivered with both clarity and creative impact.\n\nFor Jackie, organizing information is a strategic process: it is not simply about collecting data, but about designing how knowledge is accessed, understood, and remembered. By weaving together research, narrative, and multimedia elements, he helps the team present complex work with both intellectual rigor and engaging public appeal.'
      },
      rimon: {
        image: 'assets/Rimon.webp',
        title: 'Rimon Zhao',
        description: 'Rimon Zhao serves as the team\'s Chief Product Officer (CPO). In SomniSpectra, he supports the definition and refinement of the product\'s overall direction, helping align what the system delivers with how users will experience and understand it.\n\nHe contributes to the project\'s final presentation through video editing and selected written materials, focusing on cohesion, pacing, and clarity across the team\'s outputs. Through iterative adjustments and review, he helps ensure that the project is communicated in a consistent, polished, and audience-appropriate manner.'
      },
      // Charity programs
      sponsorship: {
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
        title: 'Sleep Essentials Sponsorship',
        description: 'For each SomniSpectra kit sold, we allocate a fixed contribution in the purchaser\'s name to support a "sleep essentials" package for students in under-resourced communities.\n\nThe package prioritizes simple, evidence-informed materials such as:\n• A sleep journal booklet\n• A basic sleep-hygiene guide\n• Low-cost items that help reduce common nighttime distractions\n\nDistribution is coordinated through partner schools or youth organizations to ensure transparent delivery and consistent documentation.'
      },
      workshop: {
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
        title: 'School Sleep Education Workshops',
        description: 'We provide a structured, school-ready workshop that explains sleep fundamentals in a scientifically accurate and accessible way.\n\nTopics include:\n• Circadian rhythm basics\n• The impact of light and screens\n• Stress and recovery\n• Common warning signs of persistent sleep disruption\n\nWhen appropriate, we introduce the idea of multi-signal monitoring at a conceptual level—without collecting personal data—so students learn to interpret sleep information responsibly rather than chasing a single score.'
      },
      screening: {
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
        title: 'Community Screening Support',
        description: 'In collaboration with local partners, we support non-diagnostic screening and early-risk awareness through short, standardized questionnaires and guided interpretation.\n\nThe objective is to:\n• Reduce barriers to early attention\n• Help individuals understand when professional support may be appropriate\n• Establish clear referral pathways to school counselors, community clinics, or sleep centers\n\nWhere feasible, we work with partners to ensure follow-up support is accessible and well-documented.'
      }
    },

    init() {
      this.overlay = $('#modalOverlay');
      this.modal = $('#modal');
      this.closeBtn = this.overlay?.querySelector('.modal-close');
      this.image = $('#modalImage');
      this.title = $('#modalTitle');
      this.description = $('#modalDescription');

      if (!this.overlay) return;

      // Close button
      this.closeBtn?.addEventListener('click', () => this.close());

      // Click outside to close
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });

      // ESC to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      });

      // Bind to product cards
      $$('.product-card').forEach(card => {
        card.addEventListener('click', () => {
          const key = card.dataset.product;
          if (key && this.content[key]) {
            this.open(this.content[key]);
          }
        });
      });

      // Bind to team cards
      $$('.team-card').forEach(card => {
        card.addEventListener('click', () => {
          const key = card.dataset.member;
          if (key && this.content[key]) {
            this.open(this.content[key], true); // Pass true for portrait style
          }
        });
      });

      // Bind to charity program cards
      $$('.program-card').forEach(card => {
        card.addEventListener('click', () => {
          const key = card.dataset.charity;
          if (key && this.content[key]) {
            this.open(this.content[key]);
          }
        });
      });
    },

    isOpen() {
      return this.overlay?.classList.contains('active');
    },

    open(content, isPortrait = false) {
      if (!content) return;

      this.previousActiveElement = document.activeElement;
      
      this.image.src = content.image;
      this.image.alt = content.title;
      this.title.textContent = content.title;
      this.description.textContent = content.description;

      // Apply portrait style for team members
      if (isPortrait) {
        this.modal.classList.add('modal-portrait');
      } else {
        this.modal.classList.remove('modal-portrait');
      }

      this.overlay.classList.add('active');
      this.overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');

      // Focus trap
      this.closeBtn?.focus();
    },

    close() {
      this.overlay?.classList.remove('active');
      this.overlay?.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');

      // Restore focus
      this.previousActiveElement?.focus();
    }
  };

  // ==================== Video Module ====================
  const Video = {
    init() {
      const overlay = $('#videoOverlay');
      const video = $('.product-video');

      if (!overlay || !video) return;

      overlay.addEventListener('click', () => {
        overlay.classList.add('hidden');
        video.play();
      });

      video.addEventListener('pause', () => {
        if (video.currentTime === 0 || video.ended) {
          overlay.classList.remove('hidden');
        }
      });

      video.addEventListener('ended', () => {
        overlay.classList.remove('hidden');
      });
    }
  };

  // ==================== Toast Module ====================
  const Toast = {
    element: null,
    message: null,
    timeout: null,

    init() {
      this.element = $('#toast');
      this.message = $('#toastMessage');
    },

    show(text, duration = 3000) {
      if (!this.element) return;

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.message.textContent = text;
      this.element.classList.add('active');

      this.timeout = setTimeout(() => {
        this.element.classList.remove('active');
      }, duration);
    }
  };

  // ==================== Initialize ====================
  document.addEventListener('DOMContentLoaded', () => {
    Carousel.init();
    HeroProductStack.init();
    MobileMenu.init();
    ScrollAnimations.init();
    Navigation.init();
    Modal.init();
    Video.init();
    Toast.init();
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    Carousel.pauseAutoplay();
  });

})();

