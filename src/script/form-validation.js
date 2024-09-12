const formValidation = () => {
  const formInput = document.getElementById("note-form");
  const titleInput = formInput.elements.title;
  const bodyInput = formInput.elements.body;

  const customValidationTitle = (e) => {
    e.target.setCustomValidity("");
    if (e.target.validity.valueMissing) {
      e.target.setCustomValidity("Required.");
      return;
    }

    if (e.target.validity.tooShort) {
      e.target.setCustomValidity("The minimum length is three (3) characters.");
      return;
    }
  };

  const customValidationBody = (e) => {
    e.target.setCustomValidity("");
    if (e.target.validity.valueMissing) {
      e.target.setCustomValidity("Required.");
      return;
    }

    if (e.target.validity.tooShort) {
      e.target.setCustomValidity("The minimum length is five (5) characters.");
      return;
    }
  };

  const blurEventHandler = (e) => {
    const isValid = e.target.validity.valid;
    const errorMessage = e.target.validationMessage;
    const connectedValidation = e.target.getAttribute("aria-describedby")
      ? document.getElementById(e.target.getAttribute("aria-describedby"))
      : null;

    if (connectedValidation && !isValid && errorMessage) {
      connectedValidation.innerText = errorMessage;
    } else {
      connectedValidation.innerText = "";
    }
  };

  titleInput.addEventListener("change", customValidationTitle);
  titleInput.addEventListener("invalid", customValidationTitle);
  titleInput.addEventListener("blur", blurEventHandler);

  bodyInput.addEventListener("change", customValidationBody);
  bodyInput.addEventListener("invalid", customValidationBody);
  bodyInput.addEventListener("blur", blurEventHandler);
};

export { formValidation };
