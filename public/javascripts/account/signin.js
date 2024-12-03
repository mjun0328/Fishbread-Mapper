let isValid = false;

window.addEventListener("load", async () => {
  const form = document.getElementsByTagName("form")[0];
  form.addEventListener("submit", submit);

  for (const input of form.getElementsByTagName("input")) {
    input.addEventListener("input", check);
  }
});

const check = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length > 0;

  const submitBtn = document.getElementById("submit");
  if (isValid) submitBtn.classList.remove("disabled");
  else submitBtn.classList.add("disabled");

  return isValid;
};

const submit = async (e) => {
  e.preventDefault();

  if (!isValid) return;

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/api/account/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  switch (response.status) {
    case 200:
      location.href = "/";
      break;
    case 401:
      alert("잘못된 비밀번호예요");
      break;
    case 404:
      alert("가입되지 않은 이메일이에요");
      break;
    default:
      alert("알 수 없는 오류가 발생했어요");
  }
};
