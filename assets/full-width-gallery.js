const lerp = (a, b, n) => (1 - n) * a + n * b;

class FullWidthGallery extends HTMLElement {
  constructor() {
    super();

    const SPEED = 0.1;
    
    this.cursorPosition = { x: 0, y: 0 };
    this.cursorTarget = { x: 0, y: 0 };
    this.hovered = false;
    this.currentScale = 0.3;
    this.targetScale = 1;

    this.gallery = this.querySelector('.full-width-gallery__carousel')

    this.flkty = new Flickity(this.gallery, {
      wrapAround: true,
      prevNextButtons: false,
      pageDots: window.innerWidth <= 768,
      freeScroll: false,
      resize: false,
    })

    this.addEventListener('click', (e) => {
      console.log(e.pageX)
      if(e.pageX > (window.innerWidth / 2)) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    })

    this.cursor = document.querySelector('.full-width-gallery__controls .cursor')
    this.nextButton = document.querySelector('.full-width-gallery__controls .next')
    this.previousButton = document.querySelector('.full-width-gallery__controls .previous')
    this.slides = document.querySelectorAll('.full-width-gallery__image')
    this.paginationItems = document.querySelectorAll('.full-width-gallery .pagination__item')
    this.activeIndex = 0;

    const calculateMousePercentage = (event) => {
      const { pageX, pageY} = event;
      const offsetTop = this.offsetTop
      const offset = this.getBoundingClientRect().top
      const offsetLeft = this.offsetLeft
      const width = this.offsetWidth
      const height = this.offsetHeight
      const x = pageX - offsetLeft
      const y = (pageY - offsetTop) + (offset - 40)
      const xPerc = (x / width) * 100
      const yPerc = (y / height) * 100
      return {
        x: xPerc,
        y: yPerc
      }
    }

    this.addEventListener('mouseenter', () => {
      const { x, y } = calculateMousePercentage(event)
      this.cursor.classList.add('active')
      this.hovered = true
      this.cursorTarget = { x, y }
      this.cursorPosition = { x, y }
    })

    this.addEventListener('mouseleave', () => {
      this.cursor.classList.remove('active')
      this.hovered = false
    })
    
    this.addEventListener('mousemove', (event) => {
      const {x, y} = calculateMousePercentage(event)

      this.cursorTarget = { x, y }

    })

    this.paginationItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.slides[this.activeIndex].classList.remove('active')
        this.paginationItems[this.activeIndex].classList.remove('active')
        this.paginationItems[this.activeIndex].ariaCurrent = false
        this.activeIndex = index
        this.slides[this.activeIndex].classList.add('active')
        this.paginationItems[this.activeIndex].classList.add('active')
        this.paginationItems[this.activeIndex].ariaCurrent = true
      })
    })

    const updateCursor = () => {
      if ((((this.cursorTarget.x / 100)) * window.innerWidth) < window.innerWidth / 2) {
        this.cursor.innerText = 'Prev'
      } else {
        this.cursor.innerText = 'Next'
      }


      this.cursorPosition.x = lerp(this.cursorPosition.x, this.cursorTarget.x, SPEED)
      this.cursorPosition.y = lerp(this.cursorPosition.y, this.cursorTarget.y, SPEED)
      this.currentScale = lerp(this.currentScale, this.hovered ? this.targetScale : 0.3, SPEED)
      
      
      this.cursor.style.transform = `translate(-50%, -50%) scale(${this.currentScale})`
      this.cursor.style.top = `${this.cursorPosition.y}%`
      this.cursor.style.left = `${this.cursorPosition.x}%`
      requestAnimationFrame(updateCursor)
    }

    requestAnimationFrame(updateCursor)

    this.nextButton.addEventListener('click', () => {
      this.nextSlide() 
    })

    this.previousButton.addEventListener('click', () => {
      this.previousSlide()
    })
  }

  nextSlide() {
    this.flkty.next(true);
  }

  previousSlide() {
    this.flkty.previous(true);
  }
}

customElements.define('full-width-gallery', FullWidthGallery);