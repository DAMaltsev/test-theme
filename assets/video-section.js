class VideoSection extends HTMLElement {
  constructor() {
    super();
    
    const SPEED = 0.1;
    
    this.cursorPosition = { x: 0, y: 0 };
    this.cursorTarget = { x: 0, y: 0 };
    this.hovered = false;
    this.currentScale = 0.3;
    this.targetScale = 1;
    this.hasPlayed = false;

    this.cursor = this.querySelector('.video-section__cursor')
    this.video = this.querySelector('video')

    const calculateMousePercentage = (event) => {
      const { pageX, pageY} = event;
      const offsetTop = this.offsetTop
      const offset = this.getBoundingClientRect().top
      const offsetLeft = this.offsetLeft
      const width = this.offsetWidth
      const height = this.offsetHeight
      const x = pageX - offsetLeft
      const y = (pageY - offsetTop) + (offset - 40)
      const xPerc = (x / width) * 100
      const yPerc = (y / height) * 100
      return {
        x: xPerc,
        y: yPerc
      }
    }

    this.addEventListener('mouseenter', () => {
      const { x, y } = calculateMousePercentage(event)
      this.cursor.classList.add('active')
      this.hovered = true
      this.cursorTarget = { x, y }
      this.cursorPosition = { x, y }
    })

    this.addEventListener('mouseleave', () => {
      this.cursor.classList.remove('active')
      this.hovered = false
    })
    
    this.addEventListener('mousemove', (event) => {
      const {x, y} = calculateMousePercentage(event)

      this.cursorTarget = { x, y }

    })

    this.addEventListener('click', () => {
      const playing = this.dataset.playing;

      if(playing === 'true') {
        this.cursor.innerHTML = 'Play'
        this.video.muted = true;
        this.video.controls = false;
        this.video.pause();
        this.setAttribute('data-playing', 'false')
      } else {
        this.cursor.innerHTML = 'Pause'
        this.video.muted = false;
        this.video.controls = true;
        this.cursor.style.visibility = 'hidden'
        this.style.cursor = 'pointer'
        if(!this.hasPlayed) {
          this.video.currentTime = 0;
        }
        this.hasPlayed = true;
        setTimeout(() => {
          this.video.play();
        }, 100)
        this.setAttribute('data-playing', 'true')
      }
    })

    const updateCursor = () => {
      this.cursorPosition.x = lerp(this.cursorPosition.x, this.cursorTarget.x, SPEED)
      this.cursorPosition.y = lerp(this.cursorPosition.y, this.cursorTarget.y, SPEED)
      this.currentScale = lerp(this.currentScale, this.hovered ? this.targetScale : 0.3, SPEED)
      
      
      this.cursor.style.transform = `translate(-50%, -50%) scale(${this.currentScale})`
      this.cursor.style.top = `${this.cursorPosition.y}%`
      this.cursor.style.left = `${this.cursorPosition.x}%`
      requestAnimationFrame(updateCursor)
    }

    requestAnimationFrame(updateCursor)
  }
}

customElements.define('video-section', VideoSection);