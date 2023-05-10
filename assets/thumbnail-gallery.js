class ThumbnailGallery extends HTMLElement {
  constructor() {
    super();

    this.galleryEl = this.querySelector('.thumbnail-gallery-main');
    this.navEl = this.querySelector('.thumbnail-gallery-nav');

    this.previousButton = this.querySelector('[data-controls="prev"]')
    this.nextButton = this.querySelector('[data-controls="next"]')
    this.items = this.querySelectorAll('.thumbnail-gallery__image')
    this.selectors = document.querySelectorAll('[data-gallery-image-selector]')

    this.gallery = new Flickity(this.galleryEl, {
      wrapAround: false,
      prevNextButtons: false,
      pageDots: window.innerWidth <= 768,
      freeScroll: false
    })

    this.selectors.forEach(selector => {
      selector.addEventListener('click', () => {
        const { variantId } = selector.dataset;
        this.items.forEach((item, index) => {
          const { variant } = item.dataset;
          if(variant === variantId) {
            this.gallery.select(index);
          }
        })
      })
    })

    this.nav = new Flickity(this.navEl, {
      wrapAround: false,
      prevNextButtons: false,
      pageDots: false,
      contain: true,
      asNavFor: this.galleryEl,
      cellAlign: 'left'
    })

    this.previousButton.addEventListener('click', () => {
      this.gallery.previous();
    })

    this.nextButton.addEventListener('click', () => {
      this.gallery.next();
    })
  }
}

customElements.define('thumbnail-gallery', ThumbnailGallery);