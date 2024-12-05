let presentLocation;

window.addEventListener("load", () => {
  presentLocation = new Location();
});

class Location {
  constructor() {
    this.latitude = 37.577734;
    this.longitude = 126.976866;
    this.activation = false;
    this.isInit = true;

    const checkIsActive = (state) => {
      if (state === "prompt") $("#permissionModal").modal("show");
      else if (state === "granted") this.start();
    };

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      checkIsActive(result.state);
      result.addEventListener("change", () => checkIsActive(result.state));
    });
  }

  start = () => {
    const success = async (pos) => {
      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;
      this.activation = true;

      const updateEvt = new CustomEvent("loc-update", {
        detail: {
          latitude: this.latitude,
          longitude: this.longitude,
          activation: this.activation,
        },
      });
      window.dispatchEvent(updateEvt);

      if (this.isInit) {
        this.isInit = false;
        await maps.pinStores();
      }
    };

    const error = (err) => {
      this.activation = false;
      console.error(`Location Error: ${err.message}`);
      $("#locErrToast").toast("show");
    };

    navigator.geolocation.watchPosition(success, error, {
      maximumAge: 0,
      timeout: 5000,
      enableHighAccuracy: false,
    });
  };
}
