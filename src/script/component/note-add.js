class NoteAdd extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <div class="add-button">
                <button onclick="togglePopup()">+</button>
            </div>
        `;
  }
}

customElements.define("note-add", NoteAdd);
