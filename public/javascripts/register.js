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
    this.locMarker = null;
    this.setName("");

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

  reset = () => {
    this.comment = "";
  };

  setName = (name) => {
    this.name = name;
    document.getElementById("registerName").value = this.name;
    document.getElementById(
      "registerNameCnt"
    ).innerText = `(${this.name.length}/100)`;
  };
}
