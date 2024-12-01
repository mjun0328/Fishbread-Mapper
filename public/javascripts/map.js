let maps;

window.addEventListener("load", async () => {
  maps = new Maps();

  // pin stores on the map
  await maps.pinStores();
  kakao.maps.event.addListener(
    maps.map,
    "dragend",
    async () => await maps.pinStores()
  );
  kakao.maps.event.addListener(
    maps.map,
    "zoom_changed",
    async () => await maps.pinStores()
  );
});

class Maps {
  constructor() {
    this.map = new kakao.maps.Map(document.getElementById("map"), {
      center: new kakao.maps.LatLng(37.577734, 126.976866),
      level: 3,
    });
    this.map.setMaxLevel(5);
    this.locMarker = null;
    this.isInit = true;

    window.addEventListener("loc-update", (e) => {
      const { latitude, longitude, activation } = e.detail;
      if (activation) {
        this.markLocation(latitude, longitude);
        if (this.isInit) {
          this.isInit = false;
          this.map.setCenter(new kakao.maps.LatLng(latitude, longitude));
        }
      }
    });
  }

  markLocation = (latitude, longitude) => {
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

  pinStores = async () => {
    const { ha: west, oa: east, qa: south, pa: north } = this.map.getBounds();
    const response = await fetch(
      `/api/store?east=${east}&west=${west}&south=${south}&north=${north}`
    );
    const stores = await response.json();

    const image = new kakao.maps.MarkerImage(
      "/images/map/marker.png",
      new kakao.maps.Size(64, 69),
      {
        offset: new kakao.maps.Point(32, 69),
      }
    );
    if (!storeViewer) storeViewer = new StoreViewer(this.map);

    stores.forEach((store) => {
      const marker = new kakao.maps.Marker({
        map: this.map,
        position: new kakao.maps.LatLng(store.latitude, store.longitude),
        image: image,
      });

      kakao.maps.event.addListener(marker, "click", async () => {
        await storeViewer.show(marker, store.id);
      });
    });
  };
}
