/* eslint-env browser */

class HumanNumber extends HTMLElement {
  private shadow: ShadowRoot
  private max: number = 999
  private dense: boolean = false
  private label: string = 'Number'
  private twoRow: boolean = false

  constructor() {
    // Always call super first in constructor
    super()

    this.shadow = this.attachShadow({ mode: 'open' })

    this.initAttributes()
    this.render()
  }


  initAttributes() {
    this.dense = this.hasAttribute('dense')

    this.label = this.getAttribute('label') || ''

    this.twoRow = this.hasAttribute('two-row')

    const maxAttr = this.getAttribute('max')
    if (maxAttr) {
      if (!/^\d+$/.test(maxAttr)) {
        console.warn(`Invalid Characters provided for [max]. Must only include numbers 1-${this.max}. ${this.max} will be used`)
        return
      }
      const max = Number(maxAttr)
      if (max < 1 || max > this.max) {
        console.warn(`Invalid max number, only 0-${this.max} allowed. ${this.max} will be used`)
        return
      }
      this.max = max
    }

    if (this.dense && this.max > 15) this.max = 15
  }

  render() {
    // prep style
    const stEl = document.createElement('style');
    if (!this.dense) {
      stEl.textContent = `
      :host {
        font-family: sans-serif;
        display: grid;
        width: 100%;
        height: ${this.twoRow ? '15mm' : '25mm'};
        margin-bottom: 5mm !important;
        box-sizing: border-box;
        grid-template-columns: 40mm 1fr 30mm 1fr repeat(10, 2fr) 30mm;
        grid-template-rows: 1fr 1fr ${this.twoRow ? '' : '1fr'};
        grid-template-areas:
        ${this.twoRow ? '' : '"label . box . h-0 h-1 h-2 h-3 h-4 h-5 h-6 h-7 h-8 h-9 h-l"'}
        "label . box . t-0 t-1 t-2 t-3 t-4 t-5 t-6 t-7 t-8 t-9 t-l"
        "label . box . o-0 o-1 o-2 o-3 o-4 o-5 o-6 o-7 o-8 o-9 o-l";
      }

      :host * {
        align-self: center;
        box-sizing: border-box;
      }

      h1, h2 {
        margin: 0;
        font-size: 12pt;
      }

      h1 {
        grid-area: label;
      }

      .box {
        grid-area: box;
        width: 100%;
        height: 100%;
        border: 1px solid #000;
      }

      [class*='h-'],
      [class*='o-'] {
        background-color: lightgrey;
      }

      [class*='h-'],
      [class*='t-'],
      [class*='o-'] {
        align-self: stretch;
        justify-self: stretch;
        display: flex;
        justify-content: center;
        align-content: middle;
      }

      .h-l,
      .t-l,
      .o-l {
        justify-content: flex-start;
        padding: 0 1em;
      }
      .h-l {
        grid-area: h-l;
      }
      .t-l {
        grid-area: t-l;
      }
      .o-l {
        grid-area: o-l;
      }
      `
    } else {
      stEl.textContent = `
      :host {
        display: inline-block;
        font-family: sans-serif;
        width: 30mm;
        height: 25mm;
        font-size: .7rem;
        position: relative;
        margin-bottom: 5mm;
      }

      * {
        box-sizing: border-box;
      }

      .box {
        width: 100%;
        height: 100%;
        border: 1px solid #000;
        padding: 1mm;
      }

      .numbers {
        position: absolute;
        bottom: 1mm;
        right: 1mm;
        left: 1mm;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
      }

      .numbers span {
        padding: .1rem;
      }
      `
    }
    this.shadow.appendChild(stEl)

    // container
    const grid = this.shadow

    // Label
    if (!this.dense) {
      const label = document.createElement('h1')
      label.textContent = this.label
      grid.appendChild(label)
    }

    // Handwritten box
    const box = document.createElement('div')
    box.classList.add('box')
    if (this.dense) box.textContent = this.label
    grid.appendChild(box)

    // numbers
    if (this.dense) {
      const nums = new Array(this.max + 1).fill(null).map((_, idx) => `<span>${idx}</span>`)
      const flex = document.createElement('div')
      flex.classList.add('numbers')
      flex.innerHTML = nums.join('')
      this.shadow.appendChild(flex)
    } else {
      const rows: Array<[string, number, string]> = []
      if (!this.twoRow) rows.push(['h', 100, 'Hundreds'])
      rows.push(['t', 10, 'Tens'])
      rows.push(['o', 1, 'Ones'])
      for (const oom of rows) {
        const enabled = this.max >= oom[1]
        const allEnabled = this.max >= oom[1] * 10
        const maxOom = Math.floor((this.max / oom[1]) % 10)

        // label
        const mLabel = document.createElement('h2')
        const span = document.createElement('span')
        span.textContent = enabled ? `${oom[2]}` : ''
        mLabel.appendChild(span)
        mLabel.classList.add(`${oom[0]}-l`)
        grid.appendChild(mLabel)

        for (let i = 0; i < 10; i++) {
          const num = document.createElement('div')
          num.setAttribute('style', `grid-area: ${oom[0]}-${i}`)
          num.classList.add(`${oom[0]}-${i}`)

          const curr = i * oom[1]

          if (enabled) {
            const span = document.createElement('span')
            span.textContent = allEnabled || maxOom >= i ? `${i}` : ''
            num.appendChild(span)
          }

          grid.appendChild(num)
        }
      }
    }
  }
}

customElements.define('human-number', HumanNumber)
