class DetailsAccordion extends HTMLElement {
  constructor() {
    super()

    this.items = document.querySelectorAll('.details-accordion__item')
    this.images = document.querySelectorAll('.details-accordion__image')

    this.items.forEach(item => {
      item.addEventListener('click', this.handleClick.bind(this))
    })

    this.init();
  }

  init() {
    this.items[0].classList.add('active');
    anime({
      targets: this.items[0].querySelector('.details-accordion__item-body'),
      maxHeight: `${this.items[0].querySelector('.details-accordion__item-body').scrollHeight}px`,
      duration: 0,
      easing: 'cubicBezier(0.9, 0.11, 0.15, 0.9)',
    })
  }

  handleClick(e) {
    const el = e.target.closest('.details-accordion__item')
    const answer = el.querySelector('.details-accordion__item-body');
    const height = answer.scrollHeight;
    const label = el.dataset.label;

    this.items.forEach(item => {
      if(item !== el) {
        item.classList.remove('active')
        anime({
          targets: item.querySelector('.details-accordion__item-body'),
          maxHeight: 0,
          duration: 350,
          easing: 'cubicBezier(0.9, 0.11, 0.15, 0.9)',
        })
      }

      if(item === el) {
        if(el.classList.contains('active')) { 
          el.classList.remove('active')
          anime({
            targets: answer,
            maxHeight: 0,
            duration: 350,
            easing: 'cubicBezier(0.9, 0.11, 0.15, 0.9)',
          })
        } else {
          el.classList.add('active')
          anime({
            targets: answer,
            maxHeight: `${height}px`,
            duration: 350,
            easing: 'cubicBezier(0.9, 0.11, 0.15, 0.9)',
          })
        }
      }
    })

    const activeItem = this.querySelector('.details-accordion__item.active');
    if(activeItem) {
      this.updateImages(label);
    } else {
      this.updateImages('dimensions')
    }
  }

  updateImages(label) {
    this.images.forEach(image => {
      if(image.classList.contains(label)) {
        image.classList.add('active')
      } else {
        image.classList.remove('active')
      }
    })
  }
}

customElements.define('details-accordion', DetailsAccordion)