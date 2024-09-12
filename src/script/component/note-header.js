class NoteHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <style>
                header {
                    background-color: #222222;
                    height: 80px;
                    border-bottom: 1px solid #fbbc04;
                }
                .headbar {
                    width: 100%;
                    display: flex;
                    color: #fcf7eb;
                    justify-content: center;
                    align-items: center;
                }
                header .headbar img {
                    width: 40px;
                    margin-right: 10px;
                }
            </style>
            <header>
                <div class="headbar">
                    <img src="asset/logo.png" alt="logo notes app">
                    <h1>Notes App</h1>
                </div>
            </header>
        `;
  }
}

customElements.define("note-header", NoteHeader);
