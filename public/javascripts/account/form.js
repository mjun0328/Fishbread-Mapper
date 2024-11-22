window.addEventListener("load", () => {
  const forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
});

const onInputPhone = (elem) => {
  const value = elem.value.replace(/[^0-9]/g, "");
  elem.value = value.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
};
