class FAQComponent extends HTMLElement {
  constructor() {
    super();
    this.items = this.querySelectorAll('.faq-new__item')
    this.items.forEach(item => {
      item.addEventListener('click', this.handleClick.bind(this))
    })
  }
 
  handleClick(e) {
    const el = e.target.closest('.faq-new__item')
    const answer = el.querySelector('.faq-new__answer');
    const height = answer.scrollHeight;

    this.items.forEach(item => {
      if(item !== el) {
        item.classList.remove('open')
        anime({
          targets: item.querySelector('.faq-new__answer'),
          maxHeight: 0,
          duration: 500,
          easing: 'cubicBezier(0.9, 0.11, 0.15, 0.9)',
        })
      }

      if(item === el) {
        if(el.classList.contains('open')) { 
          el.classList.remove('open')
          anime({
            targets: answer,
            maxHeight: 0,
            duration: 500,
            easing: 'cubicBezier(0.9, 0.11, 0.15, 0.9)',
          })
        } else {
          el.classList.add('open')
          anime({
            targets: answer,
            maxHeight: `${height}px`,
            duration: 500,
            easing: 'cubicBezier(0.9, 0.11, 0.15, 0.9)',
          })
        }
      }
    })
  }
}

customElements.define('faq-component', FAQComponent);