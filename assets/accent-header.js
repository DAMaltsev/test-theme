class AccentHeader extends HTMLElement {
  constructor() {
    super();

    this.accentEl = this.querySelector('[data-accents]');
    this.accents = this.querySelectorAll('[data-accents] .accent');
    this.accentDuration = this.accentEl.dataset.duration ?? 3000;
    this.accentsLength = this.accents.length;

    this.accentIndex = 0;

    this.accentLoop();
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

customElements.define('accent-header', AccentHeader);