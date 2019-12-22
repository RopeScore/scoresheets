/* eslint-env browser */

/**
 * The idea is that this component will create an A4 paper/page when printed,
 * hopefully with slots for header and footer
 */
class A4Page extends HTMLElement {
  private shadow: ShadowRoot
  private landscape: boolean = false

  constructor() {
    // Always call super first in constructor
    super()

    this.shadow = this.attachShadow({ mode: 'open' })

    this.initAttributes()
    this.render()
  }

  initShadow() {
    // Create a shadow root

  }

  initAttributes() {
    this.landscape = ![null, 'portrait'].includes(this.getAttribute('orientation'))
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
        display: grid;
        width: ${this.landscape ? '297' : '210'}mm;
        height: ${this.landscape ? '210' : '297'}mm;
        border: 1px solid #000;
        box-sizing: border-box;
        break-after: page;
        padding: 5mm 10mm;
        position: relative;
        grid-template-columns: auto;
        grid-template-rows: [header] 10mm [main] auto [footer] 10mm;
      }

      :host * {
        box-sizing: border-box;
      }

      @page {
        size: A4 ${this.landscape ? 'landscape' : 'portrait'}
      }

      header,
      footer {
        align-self: center;
      }

      header {
        grid-row-start: header;
        grid-row-end: header;
      }

      footer {
        grid-row-start: footer;
        grid-row-end: footer;
      }

      main {
        grid-row-start: main;
        grid-row-end: main;
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

customElements.define('a4-page', A4Page)
