/**
 * The idea is that this component will create an A4 paper/page when printed,
 * hopefully with slots for header and footer
 */
class A4Page extends HTMLElement {
  constructor () {
    super()
  }
}

customElements.define('a4-page', A4Page)
