class Report {
  constructor() {
    this.store = null;
    this.content = "";
  }

  show = (storeId) => {
    this.store = storeId;
    this.setContent("");
    $("#reportModal").modal("show");
  };

  setContent = (value) => {
    this.content = value.substring(0, 500);

    document.getElementById("reportContent").value = this.content;
    document.getElementById(
      "reportContentCnt"
    ).innerText = `(${this.content.length}/500)`;
  };

  submit = async () => {
    if (this.pending) return;
    if (this.content.trim().length < 10) {
      alert("신고 내용을 10글자 이상 입력해주세요");
      return;
    }
    this.pending = true;
    const response = await fetch(`/api/store/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        store: this.store,
        content: this.content,
      }),
    });
    if (response.status === 201) {
      $("#reportModal").modal("hide");
      alert("신고가 접수되었어요");
    } else if (response.status === 401) {
      location.href = "/account/signin";
    } else {
      alert("알 수 없는 오류가 발생했어요");
      this.pending = false;
    }
  };
}

const report = new Report();
