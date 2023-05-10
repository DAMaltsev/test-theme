class ThroneCenterText extends HTMLElement {
  constructor() {
    super();
    this.leftImages = this.querySelector('.throne-center-text__images.left');
    this.rightImages = this.querySelector('.throne-center-text__images.right');

    this.leftActive = false;
    this.rightActive = false;

    this.leftImages.addEventListener('mouseenter', this.mouseEnter.bind(this));
    this.rightImages.addEventListener('mouseenter', this.mouseEnter.bind(this));

    this.leftImages.addEventListener('mouseleave', this.mouseLeave.bind(this));
    this.rightImages.addEventListener('mouseleave', this.mouseLeave.bind(this));

    this.leftImages.addEventListener('touchstart', this.mouseEnter.bind(this));
    this.rightImages.addEventListener('touchstart', this.mouseEnter.bind(this));

    this.leftImages.addEventListener('touchend', this.mouseLeave.bind(this));
    this.rightImages.addEventListener('touchend', this.mouseLeave.bind(this));

    if(window.innerWidth <= 768) {
      this.videos = this.querySelectorAll('video');
      console.log(this.videos)
      this.videos.forEach((video, index) => {
        setTimeout(() => {
          video.play();
        }, 0)
      })
    }
  }

  mouseLeave(e) {
    const position = e.target.dataset.position;
    const video = e.target.querySelector('video');
    video ? video.pause() : null;
    e.target.classList.remove('active')
  }

  mouseEnter(e) {
    const position = e.target.dataset.position;
    const video = e.target.querySelector('video');
    if(video) {
      video.currentTime = 0;
      video.play();
    }

    e.target.classList.add('active')
  }
}

customElements.define('throne-center-text', ThroneCenterText)