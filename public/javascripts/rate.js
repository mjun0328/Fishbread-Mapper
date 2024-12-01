let rate;

window.addEventListener("load", () => {
  rate = new Rate();

  const modal = document.getElementById("rateModal");
  modal.addEventListener("show.bs.modal", rate.reset);
});

class Rate {
  constructor() {
    this.rate = 3;
    this.comment = "";
  }

  reset = () => {
    this.setRate(3);
    this.setComment("");
  };

  setRate = (value) => {
    this.rate = value;

    const stars = document
      .getElementsByClassName("rate")[0]
      .getElementsByClassName("star")[0]
      .getElementsByTagName("button");

    for (let i = 0; i < 5; i++) {
      stars[i].getElementsByTagName("img")[0].src =
        i < this.rate
          ? "/images/rate/star_filled.svg"
          : "/images/rate/star_empty.svg";
    }
  };

  setComment = (value) => {
    this.comment = value;

    document.getElementById("rateComment").value = this.comment;
    document.getElementById(
      "rateCommentCnt"
    ).innerText = `(${this.comment.length}/100)`;
  };
}
