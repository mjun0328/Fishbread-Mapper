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

  isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8;

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
  const passwordRe = document.getElementById("password-re").value;
  if (password !== passwordRe) {
    alert("비밀번호가 일치하지 않아요");
    return;
  }

  const response = await fetch("/api/account/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  switch (response.status) {
    case 201:
      alert("가입이 완료되었어요");
      location.href = "/account/signin";
      break;
    case 409:
      alert("이미 가입된 이메일이에요");
      break;
    default:
      alert("알 수 없는 오류가 발생했어요");
  }
};
