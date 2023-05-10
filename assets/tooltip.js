class Tooltip extends HTMLElement {
  constructor() {
    super();
    this.open = false;
    this.tooltipTrigger = this.querySelector('[data-trigger]')
    this.tooltip = this.querySelector('[data-tooltip]')
    this.tooltipContent = this.querySelector('.tooltip__content');

    document.addEventListener('click', (e) => {
      if(e.target == this.tooltipTrigger || this.contains(e.target)) return null;


      this.hideTooltip();
    })

    this.tooltipTrigger.addEventListener('click', () => {
      if(!this.open) {
        this.showTooltip();
      } else {
        this.hideTooltip();
      }
    })
  }

  showTooltip() {
    this.open = true;
    this.classList.add('active');
  }

  hideTooltip() {
    this.open = false;
    this.classList.remove('active');
  }
}

customElements.define('tooltip-component', Tooltip);