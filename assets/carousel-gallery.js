class CarouselGallery extends HTMLElement {
  constructor() {
    super();
    this.flkty = new Flickity(this, {
      wrapAround: true,
      prevNextButtons: false,
      pageDots: false,
      freeScroll: true
    })

    this.addEventListener('wheel', (e) => {
      const { deltaX, deltaY } = e;
      if(deltaY === 0) {
        this.onWheel(deltaX)
      }
    })

    this.raf = window.requestAnimationFrame(this.autoScroll.bind(this))
  }

  onWheel(delta) {
    this.flkty.x = (this.flkty.x - (delta * 0.5)) % this.flkty.slideableWidth;
    this.flkty.selectedIndex = this.flkty.dragEndRestingSelect();
    this.flkty.updateSelectedSlide();
    this.flkty.settle(this.flkty.x);
  }

  autoScroll() {
      this.flkty.x = (this.flkty.x - 0.3) % this.flkty.slideableWidth;
      this.flkty.selectedIndex = this.flkty.dragEndRestingSelect();
      this.flkty.updateSelectedSlide();
      this.flkty.settle(this.flkty.x);
      this.raf = window.requestAnimationFrame(this.autoScroll.bind(this))
  }
}

customElements.define('carousel-gallery', CarouselGallery);