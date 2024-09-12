import "./style/style.css";
import "./script/component/index.js";
import { formValidation } from "./script/form-validation.js";
import Swal from "sweetalert2";
import anime from "animejs/lib/anime.es.js";

const BASE_URL = "https://notes-api.dicoding.dev/v2";

const loadingIndicator = document.getElementById("loading-indicator");

const toggleLoading = (isLoading) => {
  loadingIndicator.style.display = isLoading ? "block" : "none";
};

const showSuccessAlert = (message) => {
  return Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
    confirmButtonText: "Ok",
    background: "#222222",
    timer: 6000,
    color: "#ffffff",
    customClass: {
      confirmButton: "custom-confirm-button",
    },
  });
};

const showErrorAlert = (message) => {
  return Swal.fire({
    icon: "error",
    title: "Oops...",
    html: `${message}<br>Please check your internet connection!`,
    confirmButtonText: "Retry",
    background: "#222222",
    color: "#ffffff",
    customClass: {
      confirmButton: "custom-confirm-button",
    },
  });
};

const showConfirmAlert = (message, buttonText) => {
  return Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: message,
    confirmButtonText: buttonText,
    showCancelButton: true,
    cancelButtonColor: "#303030",
    confirmButtonColor: "#ff1a1a",
    background: "#222222",
    color: "#ffffff",
  });
};

const getNotes = () => {
  toggleLoading(true);
  fetch(`${BASE_URL}/notes`)
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status === "success") {
        setTimeout(() => {
          renderAllNotes(responseJson.data);
          toggleLoading(false);
        }, 1000);
      } else {
        toggleLoading(false);
        showErrorAlert(`${responseJson.message}`);
      }
    })
    .catch((error) => {
      toggleLoading(false);
      showErrorAlert(`Failed to retrieve note: ${error.message}`);
    });
};

const getArchivedNotes = () => {
  toggleLoading(true);
  fetch(`${BASE_URL}/notes/archived`)
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status === "success") {
        setTimeout(() => {
          renderArchivedNotes(responseJson.data);
          toggleLoading(false);
        }, 1000);
      } else {
        toggleLoading(false);
        showErrorAlert(`${responseJson.message}`);
      }
    })
    .catch((error) => {
      toggleLoading(false);
      showErrorAlert(`Failed to retrieve note: ${error.message}`);
    });
};

const getSingleNote = async (noteId) => {
  toggleLoading(true);
  try {
    const response = await fetch(`${BASE_URL}/notes/${noteId}`);
    const responseJson = await response.json();
    toggleLoading(false);

    if (responseJson.status === "success") {
      return responseJson.data;
    } else {
      showErrorAlert(`${responseJson.message}`);
      return null;
    }
  } catch (error) {
    toggleLoading(false);
    showErrorAlert(`Failed to load note details: ${error.message}`);
    return null;
  }
};

const animateAddNote = (noteElement) => {
  anime({
    targets: noteElement,
    opacity: [0, 1],
    translateX: [100, 0],
    duration: 600,
    easing: "easeOutExpo",
  });
};

const createNote = async (note) => {
  try {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
    await response.json();
    const noteElement = buildNote(note);
    document.getElementById("note-list").append(noteElement);

    animateAddNote(noteElement);

    await showSuccessAlert("Your note has been successfully created!");
    getNotes();
    getArchivedNotes();
  } catch (error) {
    showErrorAlert(`${error.message}`);
  }
};

const animateDeleteNote = (noteElement) => {
  anime({
    targets: noteElement,
    opacity: [1, 0],
    translateX: [0, 100],
    duration: 600,
    easing: "easeInExpo",
    complete: () => noteElement.remove(),
  });
};

const deleteNote = async (id) => {
  const result = await showConfirmAlert(
    "You won't be able to revert this!",
    "Yes, delete it!",
  );
  if (result.isConfirmed) {
    const noteElement = document.getElementById(id);
    animateDeleteNote(noteElement);

    fetch(`${BASE_URL}/notes/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        return showSuccessAlert(
          "Your note has been successfully deleted!",
        ).then(() => {
          getNotes();
          getArchivedNotes();
        });
      })
      .catch((error) => {
        showErrorAlert(`${error.message}`);
      });
  }
};

const archiveNote = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await response.json();
    await showSuccessAlert("Your note has been successfully archived!");
    getNotes();
    getArchivedNotes();
  } catch (error) {
    showErrorAlert(`${error.message}`);
  }
};

const unarchiveNote = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await response.json();
    await showSuccessAlert("Your note has been successfully unarchived!");
    getNotes();
    getArchivedNotes();
  } catch (error) {
    showErrorAlert(`${error.message}`);
  }
};

const buildNote = (note) => {
  const { id, title, body, createdAt, archived } = note;

  const noteElement = document.createElement("note-item");
  noteElement.setAttribute("id", id);
  noteElement.setAttribute("title", title);
  noteElement.setAttribute("body", body);
  noteElement.setAttribute("createdAt", createdAt);
  noteElement.setAttribute("archived", archived);

  noteElement.addEventListener("click", (e) => {
    if (
      !e.target.closest("#note-archive") &&
      !e.target.closest("#note-delete")
    ) {
      getSingleNote(id).then((noteData) => {
        if (noteData) {
          displaySingleNote(noteData);
        }
      });
    }
  });

  return noteElement;
};

const animateShowNotes = () => {
  anime({
    targets: "note-item",
    opacity: [0, 1],
    translateY: [-30, 0],
    duration: 800,
    easing: "easeOutExpo",
    delay: anime.stagger(100),
  });
};

const renderAllNotes = (notes) => {
  const activeNotes = notes.filter((note) => !note.archived);

  const listNoteElement = document.getElementById("note-list");
  listNoteElement.innerHTML = "";

  activeNotes.forEach((note) => {
    const noteElement = buildNote(note);
    listNoteElement.append(noteElement);
  });

  animateShowNotes();
};

const renderArchivedNotes = (notes) => {
  const archiveNotes = notes.filter((note) => note.archived);

  const archivedNoteElement = document.getElementById("note-list-archive");
  archivedNoteElement.innerHTML = "";

  archiveNotes.forEach((note) => {
    const noteElement = buildNote(note);
    archivedNoteElement.append(noteElement);
  });

  animateShowNotes();
};

const displaySingleNote = (note) => {
  if (!note || !note.createdAt) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load note details. Note data is missing or incomplete.",
      confirmButtonText: "Ok",
      background: "#222222",
      color: "#ffffff",
    });
    return;
  }

  const formattedDate = new Date(note.createdAt).toLocaleString("en-EN", {
    dateStyle: "long",
    timeStyle: "short",
  });

  Swal.fire({
    title: note.title,
    html: `
            <div class="single-note-popup">
                <p class="single-note-body">${note.body}</p>
                <p class="single-note-date">Created: ${formattedDate}</p>
            </div>
        `,
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: "single-note-popup-container",
    },
    didOpen: () => {
      anime({
        targets: ".single-note-popup-container",
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 600,
        easing: "easeOutExpo",
      });
    },
  });
};

document.addEventListener("DOMContentLoaded", () => {
  getNotes();
  getArchivedNotes();

  const popup = document.getElementById("popup-1");
  const noteForm = document.getElementById("note-form");

  window.togglePopup = function () {
    popup.classList.toggle("active");
  };

  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("input-title").value;
    const body = document.getElementById("input-body").value;

    const newNote = {
      title: title,
      body: body,
    };

    createNote(newNote);

    document.getElementById("input-title").value = "";
    document.getElementById("input-body").value = "";

    togglePopup();
  });

  formValidation();

  document.getElementById("note-list").addEventListener("delete-note", (e) => {
    const { id } = e.detail;
    deleteNote(id);
  });

  document
    .getElementById("note-list-archive")
    .addEventListener("delete-note", (e) => {
      const { id } = e.detail;
      deleteNote(id);
    });

  document.getElementById("note-list").addEventListener("archive-note", (e) => {
    const { id } = e.detail;
    archiveNote(id);
  });

  document
    .getElementById("note-list-archive")
    .addEventListener("unarchive-note", (e) => {
      const { id } = e.detail;
      unarchiveNote(id);
    });
});
