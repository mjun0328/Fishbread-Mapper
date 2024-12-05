let register;

window.addEventListener("load", () => {
  const modal = document.getElementById("registerModal");

  modal.addEventListener("shown.bs.modal", () => {
    if (presentLocation) register = new Register();
  });
  modal.addEventListener("hidden.bs.modal", () => {
    register.setName("");
    register = null;
  });
});

class Register {
  constructor() {
    this.name = "";
    this.latitude = presentLocation.latitude;
    this.longitude = presentLocation.longitude;
    this.pending = false;
    this.setName("");

    this.locMarker = null;

    this.map = new kakao.maps.Map(document.getElementById("registerMap"), {
      center: new kakao.maps.LatLng(
        presentLocation.latitude,
        presentLocation.longitude
      ),
      level: 1,
    });

    this.marker = new kakao.maps.Marker({
      map: this.map,
      position: this.map.getCenter(),
      image: new kakao.maps.MarkerImage(
        "/images/map/marker.png",
        new kakao.maps.Size(64, 69),
        {
          offset: new kakao.maps.Point(32, 69),
        }
      ),
      clickable: false,
    });

    kakao.maps.event.addListener(this.map, "click", (evt) => {
      const latlng = evt.latLng;
      this.latitude = latlng.getLat();
      this.longitude = latlng.getLng();

      this.marker.setPosition(latlng);
    });

    this.markLocation();
    window.addEventListener("loc-update", () => {
      this.markLocation();
    });
  }

  markLocation = () => {
    const { latitude, longitude, activation } = presentLocation;
    if (!activation) return;

    if (!this.locMarker) {
      this.locMarker = new kakao.maps.Marker({
        map: this.map,
        position: new kakao.maps.LatLng(latitude, longitude),
        image: new kakao.maps.MarkerImage(
          "/images/map/location.png",
          new kakao.maps.Size(20, 20),
          {
            offset: new kakao.maps.Point(10, 10),
          }
        ),
        clickable: false,
      });
    } else {
      this.locMarker.setPosition(new kakao.maps.LatLng(latitude, longitude));
    }
  };

  setName = (name) => {
    this.name = name.substring(0, 20);
    document.getElementById("registerName").value = this.name;
    document.getElementById(
      "registerNameCnt"
    ).innerText = `(${this.name.length}/20)`;
  };

  submit = async () => {
    if (this.pending) return;
    if (this.name.trim().length < 2) {
      alert("가게 위치를 2글자 이상 입력해주세요");
      return;
    }
    this.pending = true;
    const response = await fetch(`/api/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.name,
        latitude: this.latitude,
        longitude: this.longitude,
      }),
    });
    if (response.status === 201) {
      maps.pinStores();
      $("#registerModal").modal("hide");
    } else if (response.status === 401) {
      location.href = "/account/signin";
    } else {
      alert("알 수 없는 오류가 발생했어요");
      this.pending = false;
    }
  };
}
