let rate;

class Rate {
  constructor(store) {
    this.rating = 3;
    this.comment = "";
    this.pending = false;
    this.store = store;
    this.reset();

    $("#rateModal").modal("show");
  }

  reset = () => {
    this.setRate(3);
    this.setComment("");
  };

  setRate = (value) => {
    this.rating = value;

    const stars = document
      .getElementsByClassName("rate")[0]
      .getElementsByClassName("star")[0]
      .getElementsByTagName("button");

    for (let i = 0; i < 5; i++) {
      stars[i].getElementsByTagName("img")[0].src =
        i < this.rating
          ? "/images/rate/star_filled.svg"
          : "/images/rate/star_empty.svg";
    }
  };

  setComment = (value) => {
    this.comment = value.substring(0, 100);

    document.getElementById("rateComment").value = this.comment;
    document.getElementById(
      "rateCommentCnt"
    ).innerText = `(${this.comment.length}/100)`;
  };

  submit = async () => {
    if (this.pending) return;
    this.pending = true;
    const response = await fetch(`/api/review/${this.store.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: this.rating,
        comment: this.comment,
      }),
    });

    if (response.status === 201) {
      await storeViewer?.refresh();
      $("#rateConfirmModal").modal("hide");
      alert("리뷰가 등록되었어요");
    } else if (response.status === 401) {
      location.href = "/account/signin";
    } else {
      alert("알 수 없는 오류가 발생했어요");
    }
    this.pending = false;
  };
}
