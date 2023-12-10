'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

//--- Modal window ---//

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (value, indx) {
  value.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//------- my work -------//

//--- btn 'learn more' scroll to section 1 with smooth behavior scroll
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const coordsSc1 = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: coordsSc1.left + window.pageXOffset,
  //   top: coordsSc1.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

//--- page navigation link smooth scroll

const navLinks = document.querySelector('.nav__links');
const navLinkAll = document.querySelectorAll('.nav__link');

navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const herf = e.target.getAttribute('href');
    document.querySelector(herf).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

//--- tabs move

const tabsContainer = document.querySelector('.operations__tab-container');
const tabsAll = document.querySelectorAll('.operations__tab');
const contentAll = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // move tabs
  tabsAll.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // move content
  contentAll.forEach(cont =>
    cont.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//--- opacity nav fade animetion

const nav = document.querySelector('.nav');

// callback function opacity
const headerOpacity = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    const sblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');

    sblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });

    logo.style.opacity = this;
  }
};
// passing arguments by bind
nav.addEventListener('mouseover', headerOpacity.bind(0.5));
nav.addEventListener('mouseout', headerOpacity.bind(1));

//--- sticky nav when scroll down

// **not efficient:
// const sec1Acrood = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   if (this.scrollY > sec1Acrood.y) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// api intersection more efficient:
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const callbackObs = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const observer = new IntersectionObserver(callbackObs, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
observer.observe(header);

//--- revelaing sections

const sectionsAll = document.querySelectorAll('.section');

const callSecObs = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(callSecObs, {
  root: null,
  threshold: 0.15,
});

// sectionsObserver.observe(sectionsAll); Rong: we want select 1 element
sectionsAll.forEach(el => {
  el.classList.add('section--hidden');
  sectionsObserver.observe(el);
});

//--- lazy image

const lazyImg = document.querySelectorAll('.lazy-img');

const lazyCallback = function (entrey, observer) {
  const [ent] = entrey;
  if (!ent.isIntersecting) return;

  ent.target.src = ent.target.dataset.src;

  ent.target.addEventListener('load', function () {
    ent.target.classList.remove('lazy-img');
    observer.unobserve(ent.target);
  });
};

const observLazyImg = new IntersectionObserver(lazyCallback, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

lazyImg.forEach(el => observLazyImg.observe(el));

//--- slider with dots

// part *: selectors
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const slidesAll = document.querySelectorAll('.slide');
const dotsCountainer = document.querySelector('.dots');

const slider = function () {
  // counters
  let currentSlid = 0;
  const maxSlide = slidesAll.length;

  // part 0: function
  const goToSlide = function (sldParmeter) {
    slidesAll.forEach(function (value, index) {
      value.style.transform = `translateX(${(index - sldParmeter) * 100}%)`;
    });
  };
  goToSlide(0);

  // create dots dynamc by length slides
  const creatDot = function () {
    slidesAll.forEach(function (_, i) {
      dotsCountainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  creatDot();

  // which active dot
  const dotsAll = document.querySelectorAll('.dots__dot');
  const activeDot = function (slide) {
    // .dots__dot--active

    dotsAll.forEach(el => el.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };
  activeDot(0);

  const nextSlide = function () {
    if (currentSlid === maxSlide - 1) {
      currentSlid = 0;
    } else {
      currentSlid++;
    }
    goToSlide(currentSlid);
    activeDot(currentSlid);
  };

  const breviosSlide = function () {
    if (currentSlid === 0) {
      currentSlid = maxSlide - 1;
    } else {
      currentSlid--;
    }
    goToSlide(currentSlid);
    activeDot(currentSlid);
  };

  // part 1: move slides
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', breviosSlide);

  // go left and right by arrow key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') breviosSlide();
  });

  // part 2: move dot
  dotsCountainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      goToSlide(e.target.dataset.slide);
      currentSlid = +e.target.dataset.slide;
      activeDot(currentSlid);
    }
  });
};
slider();
