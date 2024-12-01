let storeViewer;

class StoreViewer {
  constructor(map) {
    this.map = map;
    this.elem = null;
    this.window = null;
    this.store = null;

    window.addEventListener("loc-update", () => {
      this.setDistance();
    });
  }

  show = async (marker, storeId) => {
    const response = await fetch(`/api/store/${storeId}`);
    const store = await response.json();

    this.setContent(store);
    this.setDistance();

    const infoWindow = new kakao.maps.InfoWindow({
      content: this.elem,
    });
    infoWindow.setZIndex(10);

    this.hide();
    this.window = infoWindow;
    infoWindow.open(this.map, marker);
  };

  hide = () => {
    this.window?.close();
    this.window = null;
  };

  setContent = (store) => {
    if (!store) return;
    const elem = document.createElement("div");
    elem.classList = "store";
    elem.innerHTML = document.getElementById("storeInfoTemplate").innerHTML;
    elem.getElementsByClassName("store-name")[0].innerText = store.name;
    elem.getElementsByClassName("store-rate")[0].innerText = "4.5 (102)";
    elem.getElementsByClassName("store-review")[0].innerText =
      "이 가게의 5개 리뷰 보기";
    const coord = elem.getElementsByClassName("store-distance")[0];
    coord.setAttribute("data-latitude", store.latitude);
    coord.setAttribute("data-longitude", store.longitude);

    this.elem = elem;
  };

  setDistance = () => {
    if (!this.elem) return;
    else if (!presentLocation) {
      this.elem.style.display = "none";
      return;
    }

    const elem = this.elem.getElementsByClassName("store-distance")[0];

    const store = {
      latitude: parseFloat(elem.dataset.latitude),
      longitude: parseFloat(elem.dataset.longitude),
    };

    const location = {
      latitude: presentLocation.latitude,
      longitude: presentLocation.longitude,
    };

    const polyline = new kakao.maps.Polyline({
      map: this.map,
      path: [
        new kakao.maps.LatLng(store.latitude, store.longitude),
        new kakao.maps.LatLng(location.latitude, location.longitude),
      ],
      strokeOpacity: 0,
    });

    let distance = polyline.getLength();
    if (distance > 1000) {
      distance = (distance / 1000).toFixed(2) + "km";
    } else {
      distance = distance.toFixed(2) + "m";
    }
    elem.getElementsByTagName("span")[0].innerText = distance;

    elem.style.display = "inline-flex";
  };
}
