class StickyBar extends HTMLElement {
  constructor() {
    super();
    
    window.addEventListener('DOMContentLoaded', () => {
      this.hideElement = document.querySelector('[data-hide-sticky-bar]')
      if(this.hideElement) {
        this.hideStart = this.hideElement.offsetTop;
        this.hideEnd = this.hideStart + this.hideElement.offsetHeight;
        this.hidden = false;
        console.log(this.hideElement.offsetHeight)
      }
    })

    // If this element is at the top of the page, position it fixed, otherwise position it relative
    const position = () => {
      const pos = this.getBoundingClientRect().top;
      const height = this.querySelector('.product-page__sticky-cta--content').clientHeight;
      if(window.innerWidth < 768) {
        if(pos <= this.offsetTop - (height + 40)) {
          this.classList.add('fixed')
        } else {
          this.classList.remove('fixed')
        }
      } else {
        if (pos <= 0) {
          this.classList.add('fixed')
        } else {
          this.classList.remove('fixed')
        }
      }

      if(this.hideElement) {
        if((window.scrollY < (this.hideStart - 160) || window.scrollY > this.hideEnd)) {
          this.classList.remove('hidden')
        } else {
          this.classList.add('hidden')
        }
      }

      requestAnimationFrame(position)
    }
    requestAnimationFrame(position)
  }
}

customElements.define('sticky-bar', StickyBar)