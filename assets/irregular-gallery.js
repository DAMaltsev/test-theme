class IrregularGallery extends HTMLElement {
  constructor() {
    super();

    this.accentEl = this.querySelector('[data-accents]');
    this.accents = this.querySelectorAll('[data-accents] .accent');
    this.accentDuration = this.accentEl.dataset.duration ?? 3000;
    this.accentsLength = this.accents.length;

    this.images = this.querySelectorAll('.irregular-gallery__media-item')

    this.accentIndex = 0;

    this.accentLoop();

    window.requestAnimationFrame(this.raf.bind(this));
  }

  raf() {
    const pos = this.getBoundingClientRect().top - window.scrollY + (window.innerHeight);
    let offsetOne = (pos + 200) * 0.01;
    let offsetTwo = (pos + 200) * 0.04;

    if(window.innerWidth < 768) {
      offsetOne = offsetOne * 0.08;
      offsetTwo = offsetTwo * 0.15;
    }

    this.images.forEach((image, index) => {
      image.style.transform = `translate3d(0, ${index % 2 === 0 ? offsetOne : offsetTwo}px, 0)`
    })

    window.requestAnimationFrame(this.raf.bind(this));
  }

  accentLoop() {
    setInterval(() => {
      if(this.accentIndex == this.accentsLength - 1) {
        this.accentIndex = 0;
      } else {
        this.accentIndex++;
      }

      this.accents.forEach((accent, index) => {
        if(index == this.accentIndex) {
          accent.classList.add('active');
          const {width} = accent.getBoundingClientRect();
          this.accentEl.style.width = `${width}px`;
        } else {
          accent.classList.remove('active');
        }
      }
    )}, this.accentDuration);
  }
}

customElements.define('irregular-gallery', IrregularGallery);