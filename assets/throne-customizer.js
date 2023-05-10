class Fullscreen {
  constructor({ el, open, close }) {
    this.el = el;
    this.open = open;
    this.close = close;
    this.image = this.el.querySelector('[data-fullscreen-image]')
    this.orientation = 'portrait'
    this.isMobile = window.innerWidth <= 768;
    
    this.open.forEach(open => {
      open.addEventListener('click', () => {
        el.classList.add('active')
        if(this.isMobile) {
          this.image.classList.add('zoomed')
          // this.el.scrollTo(this.image.scrollWidth / 2, this.image.scrollHeight / 2)
          // scroll to center of image
          this.el.scrollTo({
            top: ((this.image.scrollHeight / 2) - (window.innerHeight / 2)),
            left: ((this.image.scrollWidth / 2) - (window.innerWidth / 2))
          })
        }
      })
    })

    this.close.addEventListener('click', () => {
      el.classList.remove('active')
      this.image.classList.remove('zoomed')
      this.resetImagePosition();
    })

    this.image.addEventListener('click', () => {
      this.toggleZoom()
    })

    this.image.addEventListener('mousemove', (e) => {
      this.moveImage(e)
    })

    window.addEventListener('keydown', (e) => {
      if(e.key === 'Escape') {
        this.closeFullscreen()
      }
    })
  }

  toggleZoom() {
    if(this.image.classList.contains('zoomed')) {
      this.image.classList.remove('zoomed')
      this.resetImagePosition();
    } else {
      this.image.classList.add('zoomed')
    }
  }

  moveImage(e) {
    if(this.image.classList.contains('zoomed')) {
      const { clientWidth, clientHeight } = this.image;
      const { offsetX, offsetY } = e;
      const x = (offsetX / clientWidth) * 100;
      const y = (offsetY / clientHeight) * 100;
      this.image.style.transformOrigin = `${x}% ${y}%`
    }
  }

  resetImagePosition() {
    setTimeout(() => {
      this.image.style.transformOrigin = `50% 50%`
    }, 300)
  }

  zoom(e) {
    e.preventDefault();
    if(e.deltaY > 0) {
      this.zoomOut()
    } else {
      this.zoomIn()
    }
  }

  closeFullscreen() {
    this.el.classList.remove('active')
  }

  setCurrentSource(src) {
    this.image.src = src;
  }

  setOrientation(orientation) {
    this.orientation = orientation
  }
}

class ThroneCustomizer extends HTMLElement {
  constructor() {
    super();
    
    this.activeOptions = {}

    this.options = this.querySelectorAll('.throne-customizer__option');
    this.hiddenSelect = this.querySelector('[data-product-variants]');
    this.hiddenInput = this.querySelector('[data-product-hidden-input]');
    this.variants = this.querySelectorAll('[data-product-variants] option');
    this.images = this.querySelectorAll('.throne-customizer__image')
    this.defaultImages = this.querySelectorAll('.throne-customizer__image.default')
    this.announcementImage = document.querySelector('.product-page__sticky-cta--image img');

    this.scrollToButtons = document.querySelectorAll('[data-scroll-to-customizer]');
    
    this.activeVariantId = this.hiddenSelect.value;

    this.options.forEach(option => {
      option.addEventListener('click', this.selectOption.bind(this));
    })

    this.scrollToButtons.forEach(button => {
      button.addEventListener('click', () => {
        const scrollElement = window.document.scrollingElement || window.document.body || window.document.documentElement;
        anime({
          targets: scrollElement,
          scrollTop: this.offsetTop,
          duration: 800,
          easing: 'easeInOutQuad'
        })
      })
    })

    this.fullscreen = new Fullscreen({
      el: this.querySelector('[data-fullscreen]'),
      open: this.querySelectorAll('.throne-customizer__images'),
      close: this.querySelector('[data-fullscreen-close]')
    })

    this.initializeCurrentOptions();
  }

  initializeCurrentOptions() {
    const activeOptions = this.querySelectorAll('.throne-customizer__selector')
    activeOptions.forEach(option => {
      const { name, value } = option.dataset;
      if(value) {
        this.activeOptions[name] = value;
      }
    })
  }

  selectOption(e) {
    const {value, slug, name} = e.target.dataset;
    const radio = this.querySelector(`input[type='radio']#${slug}`)
    const display = this.querySelector(`[data-selected-option-display].${name}`)
    display.innerHTML = value;
    this.activeOptions[name] = value;

    this.resetRadios(name)
    radio.checked = true;

    this.setActiveVariant();
  }

  setActiveVariant() {
    const options = Object.values(this.activeOptions);

    if(options.length < 3) {
      return this.setDefaultImage()
    }

    this.variants.forEach(variant => {
      if(options.every(val => variant.innerText.includes(val))) {
        this.activeVariantId = variant.value
        this.updateProductForm()
      }
    })
  }

  setDefaultImage() {
    const options = Object.values(this.activeOptions)
    this.defaultImages.forEach(image => {
      const imageOptions = image.dataset.options?.split(', ') ?? []
      if(options.every(val => imageOptions.includes(val))) {
        const img = image.querySelector('img');
        if(img) {
          this.announcementImage.src = img.src;
          this.fullscreen.setCurrentSource(img.src)
          this.fullscreen.setOrientation(img.clientWidth > img.clientHeight ? 'landscape' : 'portrait')
        }
        image.classList.add('active')
      } else {
        image.classList.remove('active')
      }
    })
  }

  updateProductForm() {
    this.hiddenInput.value = this.activeVariantId;
    this.images.forEach(image => {
      image.classList.remove('active')
      if(image.dataset.variantId === this.activeVariantId) {
        const img = image.querySelector('img');
        if(img) {
          this.announcementImage.src = img.src;
          this.fullscreen.setCurrentSource(img.src)
          this.fullscreen.setOrientation(img.clientWidth > img.clientHeight ? 'landscape' : 'portrait')
        }
        image.classList.add('active')
      }
    })
  }

  resetRadios(name) {
    const radios = this.querySelectorAll(`.throne-customizer__options.${name} input[type='radio']`)
    radios.forEach(radio => radio.checked = false)
  }
}

customElements.define('throne-customizer', ThroneCustomizer);