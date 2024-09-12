class NoteFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <style>
                footer {
                background-color: #1e1e1e;
                text-align: center;
                color: #fcf7eb;
            }

            footer p {
                margin: 16px 0;
            }
            </style> 
            <footer>
                <p>Copyright &copy 2024 Mofasir. All rights reserved.</p>
            </footer>
        `;
  }
}

customElements.define("note-footer", NoteFooter);
