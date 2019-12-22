/* eslint-env browser */

class HumanNumber extends HTMLElement {
  private shadow: ShadowRoot
  private max: number = 999
  private dense: boolean = false
  private label: string = 'Number'

  constructor () {
    // Always call super first in constructor
    super()

    this.shadow = this.attachShadow({ mode: 'open' })

    this.initAttributes()
    this.render()
  }


  initAttributes () {
    const dense = this.getAttribute('dense')
    this.dense = dense !== null
    if (this.dense) this.max = 9

    const label = this.getAttribute('label')
    if (label !== null) this.label = label

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
  }

  render () {
    // prep style
    const stEl = document.createElement('style');
    stEl.textContent = style
    this.shadow.appendChild(stEl)

    // container
    const grid = this.shadow

    // Label
    const label = document.createElement('h1')
    label.textContent = this.label
    grid.appendChild(label)

    // Handwritten box
    const box = document.createElement('div')
    box.classList.add('box')
    grid.appendChild(box)

    // numbers
    for (const oom of [['h', 100, 'Hundreds'], ['t', 10, 'Tens'], ['o', 1, 'Ones']] as Array<[string, number, string]>) {
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

const style = `
:host {
  font-family: sans-serif;
  display: grid;
  width: 100%;
  height: 30mm;
  box-sizing: border-box;
  grid-template-columns: auto 1fr 8fr 1fr repeat(10, 2fr) auto;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas:
  "label . box . h-0 h-1 h-2 h-3 h-4 h-5 h-6 h-7 h-8 h-9 h-l"
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

customElements.define('human-number', HumanNumber)
