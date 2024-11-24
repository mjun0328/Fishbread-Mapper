const resetRate = () => {
  setRate(3);
  document.getElementById("rate_content").value = "";
};

const setRate = (value) => {
  const input = document.getElementById("rate_star_value");
  input.value = value;

  const stars = document
    .getElementsByClassName("rate")[0]
    .getElementsByClassName("star")[0]
    .getElementsByTagName("button");

  for (let i = 0; i < 5; i++) {
    stars[i].getElementsByTagName("img")[0].src =
      i < value
        ? "/images/rate/star_filled.svg"
        : "/images/rate/star_empty.svg";
  }
};
