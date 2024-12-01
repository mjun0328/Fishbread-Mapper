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
    this.content = value;

    document.getElementById("reportContent").value = this.content;
    document.getElementById(
      "reportContentCnt"
    ).innerText = `(${this.content.length}/100)`;
  };
}

const report = new Report();
