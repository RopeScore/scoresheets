/* eslint-env browser */

class NoteBox extends HTMLElement {
  private shadow: ShadowRoot

  constructor () {
    // Always call super first in constructor
    super()

    this.shadow = this.attachShadow({ mode: 'open' })

    this.initAttributes()
    this.render()
  }


  initAttributes () {
  }

  render () {
    // prep style
    const stEl = document.createElement('style');
    stEl.textContent = `
    :host {
      display: flex;
      border: 1px solid #000;
      width: 100%;
      min-height: 60mm;
      flex-grow: 2;
      margin-bottom: 5mm;
      position: relative;
      font-family: sans-serif;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
    }

    * {
      box-sizing: border-box;
    }

    span {
      padding: .3rem;
      font-size: .7rem;
      display: inline-block;
    }

    aside {
      width: 30mm;
      margin-top: -1px;
      margin-bottom: -1px;
      margin-right: -1px;
      text-align: right;
    }
    `
    this.shadow.appendChild(stEl)

    // container
    const grid = this.shadow

    // info
    const text = document.createElement('span')
    text.innerHTML = 'Use this space for notes'
    grid.appendChild(text)

    // sidebar
    const aside = document.createElement('aside')
    aside.innerHTML = this.shadow.host.innerHTML
    grid.appendChild(aside)
  }
}

customElements.define('note-box', NoteBox)
