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

    init() {
      this.navbar = $('#navbar');
      this.navLinks = $$('.nav-link');
      this.sections = $$('section[id], footer[id]');

      // Scroll handler for navbar background
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
      
      // Initial check
      this.handleScroll();

      // Smooth scroll for anchor links
      $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href && href !== '#') {
            e.preventDefault();
            const target = $(href);
            if (target) {
              const offsetTop = target.offsetTop - 80;
              window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
              });
            }
          }
        });
      });
    },

    handleScroll() {
      const scrollY = window.scrollY;

      // Navbar background
      if (scrollY > 50) {
        this.navbar?.classList.add('scrolled');
      } else {
        this.navbar?.classList.remove('scrolled');
      }

      // Active section highlighting
      let currentSection = '';
      
      this.sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });

      this.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
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
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&q=80',
        title: 'Smart Pillow · Core',
        description: 'The Smart Pillow combines dual microphones, a pressure sensor matrix, and an IMU to capture sleep-relevant signals at the point of contact. It detects posture and head–neck support changes through pressure distribution, identifies turning and micro-movements via inertial sensing, and records breathing- and snoring-related acoustic patterns for event evidence and temporal correlation.\n\nKey Technical Features:\n• Dual microphones for snoring and breathing-event evidence\n• Pressure matrix for posture and pressure-distribution tracking\n• IMU for turning detection and motion timing alignment'
      },
      wristband: {
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=1200&q=80',
        title: 'Wristband · Plus',
        description: 'The Wristband provides continuous physiological monitoring using heart-rate and blood-oxygen sensing, combined with an IMU for activity context. It supports overnight trend tracking of cardiovascular dynamics and enables robust differentiation between sleep, wake, and movement-related artifacts through synchronized motion signals.\n\nKey Technical Features:\n• Heart-rate monitoring for overnight cardiovascular trends\n• SpO₂ sensing to support respiration-related screening signals\n• IMU for activity context and artifact reduction'
      },
      eyemask: {
        image: 'https://images.unsplash.com/photo-1519003300449-424ad0405076?w=1200&q=80',
        title: 'EEG Eye Mask · Pro',
        description: 'The EEG Eye Mask captures brain electrical activity to support objective sleep-stage inference. By providing neurophysiological evidence that complements peripheral signals, it strengthens interpretability for sleep architecture analysis, including transitions between stages and the continuity of restorative sleep periods.\n\nKey Technical Features:\n• EEG acquisition for objective neurophysiological evidence\n• Sleep-stage inference support for sleep architecture analysis\n• Complements peripheral signals for stronger interpretability'
      },
      // Team members
      noah: {
        image: 'assets/Noah.webp',
        title: 'Noah Huang · STEM Lead',
        description: 'Noah Huang is the founder and CEO of SomniSpectra.\n\nWithin SleepSpectra, Noah leads STEM development end-to-end—from hardware prototyping to software implementation. He is responsible for building and integrating the three-device setup, establishing reliable data acquisition and synchronization, and developing the app workflow for signal visualization, AI-driven analysis, and reporting.\n\nGood sleep, in Noah\'s view, should not be treated as a score to chase, but as a system that can be understood, measured, and continuously improved.'
      },
      alex: {
        image: 'assets/Alex.webp',
        title: 'Alex Zhou · Video Lead',
        description: 'Alex Zhou serves as the team\'s Chief Content Officer (CCO). In this project, he focuses on developing the team\'s core innovation ideas and shaping how they are communicated to both judges and broader audiences.\n\nHe is responsible for scriptwriting, presentation structure, and the overall narrative logic, ensuring that complex technical concepts are expressed with clarity, accuracy, and persuasion. He also leads the planning and coordination of the project video, aligning content flow, visual rhythm, and scene arrangement so that the final delivery is coherent, engaging, and memorable.\n\nAlex approaches communication as an extension of research itself, where ideas are assessed not only by technical soundness, but also by whether they can be articulated precisely and understood reliably. Through this lens, he helps the team present its work with both academic rigor and effective public-facing expression.'
      },
      jackie: {
        image: 'assets/Jackie.webp',
        title: 'Jackie Lin · Story & Information Lead',
        description: 'Jackie Lin serves as the team\'s Chief Information Officer (CIO). In this project, he is responsible for structuring the project\'s information framework and transforming raw data and ideas into a compelling, well-supported narrative.\n\nHis work encompasses scriptwriting, data research and analysis, resource integration, and the logical sequencing of the promotional video. He also contributes his voice for part of the voiceover and appears as an actor in the project\'s mini-drama, helping ensure the team\'s message is delivered with both clarity and creative impact.\n\nFor Jackie, organizing information is a strategic process: it is not simply about collecting data, but about designing how knowledge is accessed, understood, and remembered. By weaving together research, narrative, and multimedia elements, he helps the team present complex work with both intellectual rigor and engaging public appeal.'
      },
      rimon: {
        image: 'assets/Rimon.webp',
        title: 'Rimon · Product & Delivery Lead',
        description: 'Rimon serves as the team\'s Chief Product Officer (CPO). In SomniSpectra, he supports the definition and refinement of the product\'s overall direction, helping align what the system delivers with how users will experience and understand it.\n\nHe contributes to the project\'s final presentation through video editing and selected written materials, focusing on cohesion, pacing, and clarity across the team\'s outputs. Through iterative adjustments and review, he helps ensure that the project is communicated in a consistent, polished, and audience-appropriate manner.'
      },
      // Charity projects
      youth: {
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80',
        title: 'Youth Sleep Guardian Program',
        description: 'Youth sleep problems are becoming increasingly severe, with over 60% of high school students sleeping less than 7 hours per night. Sleep deprivation affects learning ability, emotional stability, and physical development.\n\nOur Youth Sleep Guardian Program aims to:\n• Provide free smart sleep monitoring devices to 100 schools\n• Conduct sleep health education seminars reaching 50,000+ students\n• Build student sleep databases to inform education policy\n• Train school nurses and counselors to identify student sleep issues\n\nWe have established partnerships with 35 schools in major cities.'
      },
      insomnia: {
        image: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=1200&q=80',
        title: 'Insomnia Relief Action',
        description: 'Chronic insomnia affects 10% of the global adult population, yet fewer than 30% of patients receive proper treatment. High medical costs and limited healthcare resources are major barriers.\n\nOur Insomnia Relief Action includes:\n• Partnerships with 50+ top-tier hospital sleep centers\n• Free devices and treatment for 5,000 chronic insomnia patients\n• Remote sleep monitoring platform to reduce follow-up costs\n• AI-based Cognitive Behavioral Therapy for Insomnia (CBT-I) programs\n\nWe believe technology can bring quality healthcare to everyone who needs it.'
      },
      community: {
        image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1200&q=80',
        title: 'Community Health Screening Project',
        description: 'Sleep disorders are often early warning signs of other health problems – for example, sleep apnea can lead to cardiovascular disease. However, many people are unaware they have sleep issues.\n\nOur Community Health Screening Project:\n• Establishes free screening points in 200 communities nationwide\n• Provides professional sleep health assessments and consultations\n• Identifies high-risk individuals and refers them to medical institutions\n• Builds community sleep health records for long-term improvement tracking\n\nThe project has covered 15 cities, completed 30,000+ screenings, and identified 2,000+ cases requiring intervention.'
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

      // Bind to charity projects
      $$('.charity-project').forEach(project => {
        project.addEventListener('click', () => {
          const key = project.dataset.charity;
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
