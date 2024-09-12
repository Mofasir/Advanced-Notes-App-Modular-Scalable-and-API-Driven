class NoteForm extends HTMLElement {
  static observedAttributes = [
    "label",
    "type",
    "input-name",
    "placeholder",
    "min-length",
    "max-length",
  ];

  constructor() {
    super();
    this._label = this.getAttribute("label");
    this._type = this.getAttribute("type");
    this["_input-name"] = this.getAttribute("input-name");
    this._placeholder = this.getAttribute("placeholder");
    this["_min-length"] = this.getAttribute("min-length");
    this["_max-length"] = this.getAttribute("max-length");
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <div>
                <label for="input-${this["_input-name"]}">${this._label}</label>
                <input 
                    type="${this._label}"
                    name="${this["_input-name"]}"
                    id="input-${this["_input-name"]}"
                    class="form-control"
                    placeholder="${this._placeholder}"
                    minlength="${this["_min-length"]}"
                    maxlength="${this["_max-length"]}"
                    aria-describedby="${this["_input-name"]}-validation"
                    required
                />
                <p id="${this["_input-name"]}-validation" class="error-message"></p>
            </div>
        `;
  }
}

customElements.define("form-control", NoteForm);
