class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <style>
                .loading {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(30, 30, 30, 0.9);
                    width: 100vw;
                    height: 100vh;
                }

                .spinner {
                    border-radius: 50%;
                    width: 40px;
                    padding: 8px;
                    aspect-ratio: 1;
                    background: #fbbc04;
                    --_m:
                        conic-gradient(#0000 10%,#000),
                        linear-gradient(#000 0 0) content-box;
                    -webkit-mask: var(--_m);
                            mask: var(--_m);
                    -webkit-mask-composite: source-out;
                            mask-composite: subtract;
                    animation: l3 1s infinite linear;
                }

                @keyframes l3 {to{transform: rotate(1turn)}}
            </style>

            <div class="loading">
                <div class="spinner"></div>
            </div>
        `;
  }
}

customElements.define("loading-indicator", LoadingIndicator);
