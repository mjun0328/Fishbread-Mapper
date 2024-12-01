let map;
let presentLocation = null;

window.addEventListener("load", async () => {
  initMap();

  // pin stores on the map
  await pinStores();
  kakao.maps.event.addListener(map, "dragend", async () => await pinStores());
  kakao.maps.event.addListener(
    map,
    "zoom_changed",
    async () => await pinStores()
  );

  // request user's location permission
  const onChangePermission = (state) => {
    if (state === "prompt") $("#permissionModal").modal("show");
    else if (state === "granted") {
      updatePresentLocation(map, true);
    }
  };

  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    onChangePermission(result.state);
    result.addEventListener("change", () => onChangePermission(result.state));
  });
});

const initMap = () => {
  map = new kakao.maps.Map(document.getElementById("map"), {
    center: new kakao.maps.LatLng(37.577734, 126.976866),
    level: 3,
  });
  map.setMaxLevel(5);
};

const pinStores = async () => {
  const { ha: west, oa: east, qa: south, pa: north } = map.getBounds();
  const response = await fetch(
    `/api/store?east=${east}&west=${west}&south=${south}&north=${north}`
  );
  const stores = await response.json();

  const storeImg = new kakao.maps.MarkerImage(
    "/images/map/marker.png",
    new kakao.maps.Size(64, 69),
    {
      offset: new kakao.maps.Point(32, 69),
    }
  );
  if (!storeViewer) storeViewer = new StoreViewer(map, stores);

  stores.forEach((store) => {
    const marker = new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(store.latitude, store.longitude),
      image: storeImg,
    });

    kakao.maps.event.addListener(marker, "click", async () => {
      await storeViewer.show(marker, store.id);
    });
  });
};

const updatePresentLocation = (map, isInit) => {
  let marker = null;

  const success = (pos) => {
    presentLocation = pos;
    marker = setMarkerPresentLocation(map, marker, pos, isInit);
    if (storeViewer) storeViewer.setDistance();
  };

  const error = (err) => {
    console.error(`Location Error: ${err.message}`);
    $("#locErrToast").toast("show");
  };

  navigator.geolocation.watchPosition(success, error, {
    maximumAge: 0,
    timeout: 5000,
    enableHighAccuracy: false,
  });
};

const setMarkerPresentLocation = (map, marker, pos, isInit) => {
  const { latitude, longitude } = pos.coords;

  if (isInit) map.setCenter(new kakao.maps.LatLng(latitude, longitude));

  if (marker === null) {
    marker = new kakao.maps.Marker({
      map,
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
    marker.setPosition(new kakao.maps.LatLng(latitude, longitude));
  }

  return marker;
};
