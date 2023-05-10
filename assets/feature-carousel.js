class FeatureCarousel extends HTMLElement {
  constructor() {
    super()

    this.itemsContainer = this.querySelector('.feature-carousel__items')
    this.items = this.querySelectorAll('.feature-carousel__item')
    this.images = this.querySelectorAll('.feature-carousel__image')
    this.lastIndex = 0;

    this.items.forEach(item => {
      item.addEventListener('click', this.handleClick.bind(this))
    })

    if(window.innerWidth <= 768) {
      this.paginationItems = this.querySelectorAll('.feature-carousel__pagination-item');

      this.paginationItems.forEach((item, index) => {
        item.addEventListener('click', () => {
          this.paginationItems.forEach(item => item.classList.remove('active'));
          item.classList.add('active');
          this.items.forEach(item => item.classList.remove('active'))
          this.items[index].classList.add('active')
          this.itemsContainer.scrollTo({ left: this.items[index].offsetLeft, behavior: 'smooth'})
        })
      })

      // Get index of current item from scroll position on this.itemsContainer
      this.itemsContainer.addEventListener('scroll', () => {
        const index = Math.round(this.itemsContainer.scrollLeft / this.items[0].offsetWidth);
        if(index !== this.lastIndex) {
          this.lastIndex = index
          const video = this.items[index].querySelector('video');
          this.items.forEach(item => {
            const itemVideo = item.querySelector('video');
            if(itemVideo !== video) {
              itemVideo.pause();
            } else {
              video.play()
            }
          })
        }
        this.paginationItems.forEach(item => item.classList.remove('active'));
        this.paginationItems[index].classList.add('active');
      })
    }
  }

  handleClick(e) {
    const el = e.target.closest('.feature-carousel__item')
    const index = Array.prototype.indexOf.call(this.items, el)
    const video = this.images[index].querySelector('video')

    this.items.forEach(item => {
      item.classList.remove('active')
    })
    this.images.forEach(image => {
      const vid = image.querySelector('video');
      if(vid) {
        vid.pause();
      }
      image.classList.remove('active')
    })

    el.classList.add('active')
    this.images[index].classList.add('active')
    video.play();

  }
}

customElements.define('feature-carousel', FeatureCarousel);