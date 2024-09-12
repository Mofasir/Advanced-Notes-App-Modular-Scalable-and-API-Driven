class NoteItem extends HTMLElement {
  static observedAttributes = ["id", "title", "body", "createdAt", "archived"];

  constructor() {
    super();
  }

  connectedCallback() {
    this._id = this.getAttribute("id");
    this._title = this.getAttribute("title");
    this._body = this.getAttribute("body");
    this._createdAt = this.getAttribute("createdAt");
    this._archived = this.getAttribute("archived");
    this.render();

    this.querySelector("#note-delete").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("delete-note", {
          detail: { id: this._id },
          bubbles: true,
        }),
      );
    });

    this.querySelector("#note-archive").addEventListener("click", () => {
      if (this._archived === "false") {
        this.dispatchEvent(
          new CustomEvent("archive-note", {
            detail: { id: this._id },
            bubbles: true,
          }),
        );
      } else {
        this.dispatchEvent(
          new CustomEvent("unarchive-note", {
            detail: { id: this._id },
            bubbles: true,
          }),
        );
      }
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has been changed.`);
    console.log(`Old value is ${oldValue}`);
    console.log(`New value is ${newValue}`);

    this[`_${name}`] = newValue;
    this.render();
  }

  render() {
    const archiveIcon =
      this._archived === "true" ? "asset/unarchive.svg" : "asset/archive.svg";
    const archiveTitle = this._archived === "true" ? "Unarchive" : "Archive";

    this.innerHTML = `
            <div class="note-card">
                <div id=${this._id} class="note-main">
                    <h3 class="note-title">${this._title}</h3>
                    <p class="note-body">${this._body}</p>
                </div>
                <div class="note-footer">
                    <p class="note-date">${new Date(
                      this._createdAt,
                    ).toLocaleString("en-EN", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}</p>
                    <div class="note-button">
                        <button id="note-archive" class="note-archive" title="${archiveTitle}">
                            <img src="${archiveIcon}" alt="archive">
                        </button>
                        <button id="note-delete" class="note-delete" title="Delete">
                            <img src="asset/trash.svg" alt="delete">
                        </button>
                    </div>
                </div>
            </div>
        `;
  }
}

customElements.define("note-item", NoteItem);
