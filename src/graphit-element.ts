import { LitElement, css, html, PropertyValueMap } from 'lit'
import { createRef, Ref, ref } from 'lit/directives/ref.js'
import { customElement, property } from 'lit/decorators.js'
import litLogo from './assets/lit.svg'

import cytoscape from 'cytoscape'
// For some reason dagre is causing an error when compiled:
// Cannot read properties of undefined (reading 'Graph')
// Omitting for now.
import dagre from 'cytoscape-dagre'
import cola from 'cytoscape-cola'
import klay from 'cytoscape-klay'
import { v4 as uuidv4 } from 'uuid'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('graphit-element')
export class GraphitElement extends LitElement {
  @property()
  defaultNodeColor = '#666'

  @property()
  selectedNodeColor = 'blue'

  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  @property()
  cy: cytoscape.Core

  @property()
  graphRef: Ref<HTMLDivElement> = createRef()

  render() {
    return html`
      <div id="graph" ${ref(this.graphRef)}></div>

      <footer hidden>
        <p>Built with <a href="https://js.cytoscape.org/">Cytoscape.js</a></p>
      </footer>
    `
  }

  constructor() {
    super()
  }

  connectedCallback(): void {
    super.connectedCallback()
    cytoscape.use(dagre)
    cytoscape.use(cola)
    cytoscape.use(klay)
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    console.log(this.graphRef.value!)

    this.cy = cytoscape({
      container: this.graphRef.value!,
      elements: [
        {
          data: { id: 'a', name: '1' }
        },
        {
          data: { id: 'b', name: '2' }
        },
        {
          data: { id: 'ab', source: 'a', target: 'b' }
        }
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': this.defaultNodeColor,
            label: (ele: any) => {
              // Use the name property if it is set
              return ele?.data()?.name
            }
          }
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ]
    })
    this.updateLayout()
  }

  updateLayout = () => {
    console.log('Layout Run')
    const layout = this.cy.layout({
      name: 'grid',
      fit: true
    })
    layout.run()
    console.log(layout)
    this.graphRef = this.graphRef
  }

  static styles = css`
    :host {
      width: 100%;
    }

    footer {
      left: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
    }

    .container {
      width: 100%;
      height: 100%;
      margin: auto;
    }

    #graph {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'graphit-element': GraphitElement
  }
}
