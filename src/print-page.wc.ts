/* eslint-env browser */

/**
 * The idea is that this component will create an A4 paper/page when printed,
 * hopefully with slots for header and footer
 */
class PrintPage extends HTMLElement {
  private shadow: ShadowRoot
  private landscape: boolean = false
  private letter: boolean = false

  constructor() {
    // Always call super first in constructor
    super()

    this.shadow = this.attachShadow({ mode: 'open' })

    this.initAttributes()
    this.render()
  }

  initAttributes() {
    this.landscape = this.hasAttribute('landscape')
    this.letter = this.hasAttribute('letter')
  }

  render() {
    // header slot
    const header = document.createElement('header')
    const headerSlot = document.createElement('slot')
    headerSlot.setAttribute('name', 'header')
    header.appendChild(headerSlot)

    // footer slot
    const footer = document.createElement('footer')
    const footerSlot = document.createElement('slot')
    footerSlot.setAttribute('name', 'footer')
    footer.appendChild(footerSlot)

    // main
    const main = document.createElement('main')
    main.innerHTML = this.shadow.host.innerHTML
    main.querySelectorAll("[slot]").forEach(e => e.parentNode!.removeChild(e))

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        ${this.letter ?
        `
        width: ${this.landscape ? '11' : '8.5'}in;
        height: ${this.landscape ? '8.5' : '11'}in;
        ` :
        `
        width: ${this.landscape ? '297' : '210'}mm;
        height: ${this.landscape ? '210' : '297'}mm;
        `}
        border: 1px solid #000;
        box-sizing: border-box;
        break-after: page;
        padding: 5mm 10mm;
        position: relative;
        flex-direction: column;
        justify-content: space-between;
        align-content: stretch;
      }

      :host * {
        box-sizing: border-box;
      }

      @media print {
        :host {
          border: none;
        }
      }

      @page {
        size: A4 ${this.landscape ? 'landscape' : 'portrait'}
      }

      header {
        order: 1;
        padding-bottom: 5mm;
      }

      footer {
        order: 3;
        padding-top: 5mm;
      }

      main {
        order: 1;
        width: 100%;
        height: 100%;
      }
    `

    this.shadow.appendChild(style)
    this.shadow.appendChild(header)
    this.shadow.appendChild(main)
    this.shadow.appendChild(footer)
  }
}

customElements.define('print-page', PrintPage)
