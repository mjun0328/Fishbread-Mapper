let isValid = false;

window.addEventListener("load", async () => {
  const form = document.getElementsByTagName("form")[0];
  form.addEventListener("submit", submit);

  for (const input of form.getElementsByTagName("input")) {
    input.addEventListener("input", check);
  }
});

const check = () => {
  const old = document.getElementById("password-old").value;
  const password = document.getElementById("password").value;

  isValid = old.length > 0 && password.length >= 8;

  const submitBtn = document.getElementById("submit");
  if (isValid) submitBtn.classList.remove("disabled");
  else submitBtn.classList.add("disabled");

  return isValid;
};

const submit = async (e) => {
  e.preventDefault();

  if (!isValid) return;

  const old = document.getElementById("password-old").value;
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password-re").value;

  if (password !== password2) {
    alert("비밀번호가 일치하지 않아요");
    return;
  }

  const response = await fetch("/api/account/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ old, password }),
  });

  switch (response.status) {
    case 200:
      alert("비밀번호가 변경되었어요");
      location.href = "/";
      break;
    case 401:
      switch ((await response.json()).error) {
        case "Password is wrong":
          alert("현재 비밀번호가 틀렸어요");
          break;
        case "Unauthorized":
          location.href = "/account/signin";
          break;
        default:
          alert("알 수 없는 오류가 발생했어요");
      }
      break;
    default:
      alert("알 수 없는 오류가 발생했어요");
  }
};
