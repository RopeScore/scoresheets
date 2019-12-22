/* eslint-env browser */

/**
 * The idea is that this component will create an A4 paper/page when printed,
 * hopefully with slots for header and footer
 */
class A4Page extends HTMLElement {
  constructor () {
    // Always call super first in constructor
    super()
    this.initAttributes()
    this.render()
  }

  landscape: boolean = false

  initAttributes () {
    this.landscape = ![null, 'portrait'].includes(this.getAttribute('orientation'))
  }

  render () {
        // Create a shadow root
        const shadow = this.attachShadow({ mode: 'open' })

        // header slot
        const header = document.createElement('div')
        header.setAttribute('class', 'header')
        const headerSlot = document.createElement('slot')
        headerSlot.setAttribute('name', 'header')
        header.appendChild(headerSlot)

        // footer slot
        const footer = document.createElement('div')
        footer.setAttribute('class', 'footer')
        const footerSlot = document.createElement('slot')
        footerSlot.setAttribute('name', 'footer')
        footer.appendChild(footerSlot)

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

        @page {
          size: A4 ${this.landscape ? 'landscape' : 'portrait'}
        }

        .header,
        .footer {
          align-self: center;
        }

        .header {
          grid-row-start: header;
          grid-row-end: header;
        }

        .footer {
          grid-row-start: footer;
          grid-row-end: footer;
        }
        `

        shadow.appendChild(style)
        shadow.appendChild(header)
        shadow.appendChild(footer)
  }
}

customElements.define('a4-page', A4Page)
