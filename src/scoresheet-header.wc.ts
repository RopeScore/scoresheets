/* eslint-env browser */

class ScoresheetHeader extends HTMLElement {
  private shadow: ShadowRoot
  private eventAbbr: string = ''
  private judgeType: string = ''
  private logo: string = ''

  constructor () {
    // Always call super first in constructor
    super()

    this.shadow = this.attachShadow({ mode: 'open' })

    this.initAttributes()
    this.render()
  }


  initAttributes () {
    this.eventAbbr = this.getAttribute('event') || ''
    this.judgeType = this.getAttribute('judge') || ''
    this.logo = this.getAttribute('logo') || ''
  }

  render () {
    // prep style
    const stEl = document.createElement('style');
    stEl.textContent = `
    :host {
      font-family: sans-serif;
      display: grid;
      width: 100%;
      height: 30mm;
      box-sizing: border-box;
      grid-template-columns: 30mm 1fr 4fr 1fr 4fr;
      grid-template-rows: 1fr 1fr;
      grid-template-areas:
      "logo . event-abbr . judge-type"
      "logo . judge-id . part-id"
    }

    * { box-sizing: border-box; }

    .box {
      width: 100%;
      height: 100%;
      border: 1px solid #000;
      padding: .3rem;
      font-size: .7rem;
    }

    .logo {
      grid-area: logo;
      max-width: 100%;
      max-height: 100%;
    }
    .event-abbr {
      grid-area: event-abbr;
      font-size: 3rem;
      font-weight: bold;
    }
    .judge-type {
      grid-area: judge-type;
      font-size: 3rem;
      font-weight: bold;
      text-align: right;
    }
    .judge-id { grid-area: judge-id; }
    .part-id { grid-area: part-id; }
    `
    this.shadow.appendChild(stEl)

    // container
    const grid = this.shadow

    // logo
    if (this.logo) {
      const logo = document.createElement('img')
      logo.src = this.logo
      logo.classList.add('logo')
      grid.appendChild(logo)
    }

    // eventAbbr
    const eventAbbr = document.createElement('div')
    eventAbbr.classList.add('event-abbr')
    eventAbbr.innerHTML = this.eventAbbr
    grid.appendChild(eventAbbr)

    // judgeType
    const judgeType = document.createElement('div')
    judgeType.classList.add('judge-type')
    judgeType.innerHTML = this.judgeType
    grid.appendChild(judgeType)

    // judgeID
    const judgeID = document.createElement('div')
    judgeID.innerHTML = 'Judge#'
    judgeID.classList.add('box')
    judgeID.classList.add('judge-id')
    grid.appendChild(judgeID)

    // partID
    const partID = document.createElement('div')
    partID.innerHTML = 'Participant#'
    partID.classList.add('box')
    partID.classList.add('part-id')
    grid.appendChild(partID)
  }
}

customElements.define('scoresheet-header', ScoresheetHeader)
