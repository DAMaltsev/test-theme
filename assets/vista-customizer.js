// convert dollar amount in cents to dollars with no trailing zeros using Intl.NumberFOrmat
const formatPrice = (price) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  })

  return formatter.format(price / 100)
};

class VistaFullscreen {
  constructor({ el, open, close }) {
    this.el = el;
    this.open = open;
    this.close = close;
    this.image = this.el.querySelector('[data-fullscreen-image]')
    this.isMobile = window.innerWidth <= 768;
    
    this.open.forEach(open => {
      open.addEventListener('click', () => {
        const image = this.isMobile ? document.querySelector('.vista-customizer__image.active img') : document.querySelector('.thumbnail-gallery__image.is-selected img');
        this.setCurrentSource(image.src)
        el.classList.add('active')
        if(this.isMobile) {
          this.image.classList.add('zoomed')
    
          this.el.scrollTo({
            top: ((this.image.scrollHeight / 2) - (window.innerHeight / 2)),
            left: ((this.image.scrollWidth / 2) - (window.innerWidth / 2))
          })
        };
      })
    })

    this.close.addEventListener('click', () => {
      el.classList.remove('active')
      this.image.classList.remove('zoomed')
      this.resetImagePosition();
    })

    this.image.addEventListener('click', () => {
      this.toggleZoom()
    })

    this.image.addEventListener('mousemove', (e) => {
      this.moveImage(e)
    })

    window.addEventListener('keydown', (e) => {
      if(e.key === 'Escape') {
        this.closeFullscreen()
      }
    })
  }

  toggleZoom() {
    if(this.image.classList.contains('zoomed')) {
      this.image.classList.remove('zoomed')
      this.resetImagePosition();
    } else {
      this.image.classList.add('zoomed')
    }
  }

  moveImage(e) {
    if(this.image.classList.contains('zoomed')) {
      const { clientWidth, clientHeight } = this.image;
      const { offsetX, offsetY } = e;
      const x = (offsetX / clientWidth) * 100;
      const y = (offsetY / clientHeight) * 100;
      this.image.style.transformOrigin = `${x}% ${y}%`
    }
  }

  resetImagePosition() {
    setTimeout(() => {
      this.image.style.transformOrigin = `50% 50%`
    }, 300)
  }

  zoom(e) {
    e.preventDefault();
    if(e.deltaY > 0) {
      this.zoomOut()
    } else {
      this.zoomIn()
    }
  }

  closeFullscreen() {
    this.el.classList.remove('active')
  }

  setCurrentSource(src) {
    this.image.src = src;
  }
}

class VistaCustomizer extends HTMLElement {
  constructor() {
    super();
    
    this.activeOptions = {}
    this.isMobile = window.innerWidth <= 768;
    this.klarna = this.querySelector('klarna-placement');
    this.scrollToButtons = document.querySelectorAll('[data-scroll-to-customizer]');
    this.options = this.querySelectorAll('.vista-customizer__option');
    this.hiddenSelect = this.querySelector('[data-product-variants]');
    this.hiddenInput = this.querySelector('[data-product-hidden-input]');
    this.priceDisplay = document.querySelectorAll('[data-price-display]');
    this.variants = this.querySelectorAll('[data-product-variants] option');
    this.images = this.querySelectorAll('.vista-customizer__image')
    this.upgrades = this.querySelectorAll('[data-upgrade]');
    this.productPrice = parseInt(this.hiddenInput.dataset.price);
    this.activeVariantId = this.hiddenSelect.value;
    this.price = this.productPrice;
    this.chairSelectors = this.querySelector('[data-hammock-chair-selectors]');
    
    this.bundleOption = this.querySelector('[data-bundle-option]')
    this.throneOnlyOption = this.querySelector('[data-throne-only-option]')

    
    if(this.isMobile) {
      this.initializeMobileGallery();
    }

    this.throneOnlyOption.addEventListener('click', () => {
      const display = this.querySelector('[data-selected-option-display].product-option')
      const { variantId, variantPrice, label } = this.throneOnlyOption.dataset;
      display.innerHTML = label
      this.throneOnlyOption.classList.add('active')
      this.bundleOption.classList.remove('active')

      console.log(variantPrice)

      anime({
        targets: this.chairSelectors,
        maxHeight: 0,
        opacity: 0,
        duration: 350,
        easing: 'cubicBezier(0.9, 0.11, 0.15, 0.9)',
      })

      // this.hiddenInput.value = variantId;
      this.productPrice = parseInt(variantPrice);
      this.updatePrice();
    })

    this.bundleOption.addEventListener('click', () => {
      const display = this.querySelector('[data-selected-option-display].product-option')
      const { label } = this.bundleOption.dataset;
      display.innerHTML = label

      anime({
        targets: this.chairSelectors,
        maxHeight: `${this.chairSelectors.querySelector('fieldset').scrollHeight}px`,
        duration: 500,
        opacity: 1,
        easing: 'cubicBezier(0.9, 0.11, 0.15, 0.9)',
      })

      this.bundleOption.classList.add('active')
      this.throneOnlyOption.classList.remove('active')
      this.setActiveVariant();
    })

    this.fullscreen = new VistaFullscreen({
      el: this.querySelector('[data-fullscreen]'),
      open: this.querySelectorAll('[data-fullscreen-open]'),
      close: this.querySelector('[data-fullscreen-close]')
    })
    

    this.options.forEach(option => {
      option.addEventListener('click', this.selectOption.bind(this));
    })

    this.scrollToButtons.forEach(button => {
      button.addEventListener('click', () => {
        const scrollElement = window.document.scrollingElement || window.document.body || window.document.documentElement;
        anime({
          targets: scrollElement,
          scrollTop: this.offsetTop,
          duration: 800,
          easing: 'easeInOutQuad'
        })
      })
    })

    this.updatePrice();

    this.upgrades.forEach(upgrade => {
      upgrade.addEventListener('click', () => {
        this.updatePrice()
      })
    })

    this.initializeCurrentOptions();
  }

  updatePrice() {
    this.price = this.productPrice;
    if(document.querySelector('[data-bundle-option]').classList.contains('active')){
      const avtiveItem = document.querySelector('input[name="Hammock Chair"]:checked').value
      // document.querySelector('[data-product-hidden-input]').value = "";
      const selectElement = document.getElementById('ProductSelect-Throne');
      const options = selectElement.options;
      
      for (let i = 0; i < options.length; i++) {
        options[i].removeAttribute('selected');
      }
      document.querySelector(`#ProductSelect-Throne option[data-title="${avtiveItem}"]`).setAttribute('selected', 'selected');
      // const selec = document.querySelector(`#ProductSelect-Throne option:selected`)
      console.log('Here1: ',this.price, avtiveItem)
    } else {
      const selectElement = document.getElementById('ProductSelect-Throne');
      const options = selectElement.options;
      
      for (let i = 0; i < options.length; i++) {
        options[i].removeAttribute('selected');
      }

      // document.querySelector('[data-product-hidden-input]').value = "";
      document.querySelector('#ProductSelect-Throne option[data-title="The Vista™ Only"]').setAttribute('selected', 'selected')
      console.log('Here2: ',this.price)
    }
    
    this.upgrades.forEach((upgrade, index) => {
      const quantityInput = upgrade.parentNode.querySelector('[data-upgrade-quantity]')
      
      if(upgrade.checked) {
        quantityInput.name = `items[${index}][quantity]`
        quantityInput.value = `1`;
        upgrade.name = `items[${index}][id]`
        this.price += parseInt(upgrade.dataset.price);
      } else {
        quantityInput.name = `d`
        quantityInput.value = `0`;
        upgrade.name = `d`
      }
    })

    this.klarna.setAttribute('data-purchase-amount', this.price);

    const conmparePrice = document.querySelector('#ProductSelect-Throne option[selected="selected"]').dataset.compare;
    const comparePriceContainer = document.querySelector('[data-compare-price-display]');
    const addOnComparePrice = document.querySelector('[data-upgrade]').dataset.price;
    if(document.querySelector('[data-upgrade]').checked) {
      comparePriceContainer.innerHTML = formatPrice(parseInt(conmparePrice) + parseInt(addOnComparePrice));
    } else {
      comparePriceContainer.innerHTML = formatPrice(conmparePrice);
    }
    
    // console.log(conmparePrice, formatPrice(conmparePrice)) 
    this.priceDisplay.forEach(item => {
      item.innerHTML = formatPrice(this.price);
    })
  }

  initializeMobileGallery() {
    this.paginationItems = this.querySelectorAll('.vista-customizer__image-pagination-item');
    this.container = this.querySelector('.vista-customizer__images.inline');
    this.images = this.querySelectorAll('.vista-customizer__images.inline .vista-customizer__image');
    this.imageWidth = this.images[0].offsetWidth;
    this.mobileGalleryIndex = 0;

    this.container.addEventListener('scroll', () => {
      this.mobileGalleryIndex = Math.round(this.container.scrollLeft / this.imageWidth);
      this.paginationItems.forEach(item => item.classList.remove('active'));
      this.paginationItems[this.mobileGalleryIndex].classList.add('active');
      this.images.forEach(image => image.classList.remove('active'))
      this.images[this.mobileGalleryIndex].classList.add('active')
    })

    this.paginationItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.paginationItems.forEach(item => item.classList.remove('active'));
        item.classList.add('active');
        if(this.container) {
          this.container.scrollTo({
            left: this.imageWidth * index,
            behavior: 'smooth'
          })
        }
      })
    })
  }

  initializeCurrentOptions() {
    const activeOptions = this.querySelectorAll('.vista-customizer__selector')
    activeOptions.forEach(option => {
      const { name, value } = option.dataset;
      this.activeOptions[name] = value;
    })
  }

  selectOption(e) {
    const {value, slug, name} = e.target.dataset;
    const radio = this.querySelector(`input[type='radio']#${slug}`)
    const display = this.querySelector(`[data-selected-option-display].${name}`)
    display.innerHTML = value;
    this.activeOptions[name] = value;

    this.resetRadios(name)
    radio.checked = true;

    this.setActiveVariant();
  }

  setActiveVariant() {
    const options = Object.values(this.activeOptions);

    this.variants.forEach(variant => {
      if(variant.innerText.includes(this.activeOptions['hammock-chair'])) {
        this.activeVariantId = variant.value
        this.updateProductForm()
        this.productPrice = parseInt(variant.dataset.price)
        this.updatePrice();
      }
    })
  }

  updateProductForm() {
    // this.hiddenInput.value = this.activeVariantId;
    this.images.forEach((image, index) => {
      image.classList.remove('active')
      if(image.dataset.variantId === this.activeVariantId) {
        image.classList.add('active')
        if(this.container) {
          this.container.scrollTo({
            left: this.imageWidth * index,
            behavior: 'smooth'
          })
        }
      }
    })
  }

  resetRadios(name) {
    const radios = this.querySelectorAll(`.vista-customizer__options.${name} input[type='radio']`)
    radios.forEach(radio => radio.checked = false)
  }
}

customElements.define('vista-customizer', VistaCustomizer);



const chairs = document.querySelectorAll('input[name="Hammock Chair"]');
const chairChecked = document.querySelectorAll('input[name="Hammock Chair"]:checked');
// const bundleActive = document.querySelector('[data-bundle-option]');

const bundleOption = document.querySelector('[data-bundle-option]');
const hammockRadios = document.querySelectorAll('input[name="Hammock Chair"]');

const upgradeCheckbox = document.querySelector('[data-upgrade]');

const productHiddenInput = document.querySelector('[data-product-hidden-input]');

upgradeCheckbox.addEventListener('change', () => {
  if (upgradeCheckbox.checked) {
    productHiddenInput.value = '40806754353200';
    
  } else {
    productHiddenInput.value = '';
  }
});

