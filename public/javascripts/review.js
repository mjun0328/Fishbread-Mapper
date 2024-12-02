let review;

class Review {
  constructor(store) {
    this.elem = document.getElementsByClassName("review")[0];
    this.page = 0;
    this.store = store;
    document.getElementsByClassName("review-title")[0].innerText =
      this.store.name;

    this.elem.innerHTML = "";
    this.load(() => {
      $("#reviewModal").modal("show");
    });
  }

  load = async (callback) => {
    const response = await fetch(
      `/api/review/${this.store.id}?page=${this.page}`
    );
    if (response.status !== 200) {
      if (response.status === 401) location.href = "/account/signin";
      else alert("알 수 없는 오류가 발생했어요");
      return;
    }

    const reviews = await response.json();
    reviews.forEach((review) => {
      let time = new Date(review.time);
      time = `${time.getFullYear()}. ${
        time.getMonth() + 1
      }. ${time.getDate()}.`;

      const elem = document.createElement("div");
      elem.classList.add("review-content");
      elem.innerHTML = `
        <p></p>
        <div>
          <button type="button" onclick="review.${
            review.isAuthor ? `remove` : `report`
          }('${review.id}')">
            ${
              review.isAuthor
                ? `<img src="/images/review/delete.svg" alt="삭제" />
            <span>이 리뷰 삭제하기</span>`
                : `<img src="/images/review/report.svg" alt="신고" />
            <span>이 리뷰 신고하기</span>
              `
            }
          </button>
          <span>${time}</span>
        </div>`;
      elem.getElementsByTagName("p")[0].innerText = review.comment;
      this.elem.appendChild(elem);
    });

    const LIMIT = 10;
    const moreBtn = document.getElementsByClassName("review-btn")[0];
    const count = this.store.review.count;
    if (count > (this.page + 1) * LIMIT) {
      moreBtn.innerText = `리뷰 더보기 (${Math.min(
        count,
        (this.page + 1) * LIMIT
      )}/${count})`;
      moreBtn.style.display = "block";
    } else {
      moreBtn.style.display = "none";
    }

    if (callback) callback();
  };

  nextPage = () => {
    this.page++;
    this.load();
  };

  remove = async (id) => {
    if (!confirm("이 리뷰를 삭제할까요?")) return;

    const response = await fetch(`/api/review/${id}`, {
      method: "DELETE",
    });
    if (response.status === 204) {
      alert("리뷰를 삭제했어요");
      this.elem.innerHTML = "";
      this.page = 0;
      this.load();
    } else if (response.status === 401) {
      location.href = "/account/signin";
    } else {
      alert("알 수 없는 오류가 발생했어요");
    }
  };

  report = async (id) => {
    if (!confirm("이 리뷰를 신고할까요?")) return;

    const response = await fetch(`/api/review/${id}/report`, {
      method: "POST",
    });
    if (response.status === 201) {
      alert("신고가 접수되었어요");
    } else if (response.status === 401) {
      location.href = "/account/signin";
    } else {
      alert("알 수 없는 오류가 발생했어요");
    }
  };
}
