window.addEventListener("load", () => {
  document
    .getElementById("registerModal")
    .addEventListener("shown.bs.modal", registerInitMap);
});

const registerInitMap = () => {
  const { latitude, longitude } = presentLocation.coords;
  const map = new kakao.maps.Map(document.getElementById("registerMap"), {
    center: new kakao.maps.LatLng(latitude, longitude),
    level: 1,
  });

  const marker = new kakao.maps.Marker({
    map,
    position: map.getCenter(),
    image: new kakao.maps.MarkerImage(
      "/images/map/marker.png",
      new kakao.maps.Size(64, 69),
      {
        offset: new kakao.maps.Point(32, 69),
      }
    ),
    clickable: false,
  });

  kakao.maps.event.addListener(map, "click", function (evt) {
    const latlng = evt.latLng;
    marker.setPosition(latlng);
  });

  let location = null;
  location = setMarkerPresentLocation(map, location, presentLocation, true);
};

const resetRegister = () => {
  document.getElementById("reportName").value = "";
};
