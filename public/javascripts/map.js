window.addEventListener("load", () => {
  // make map
  const map = new kakao.maps.Map(document.getElementById("map"), {
    center: new kakao.maps.LatLng(37.577734, 126.976866),
    level: 3,
  });
  map.setMaxLevel(5);

  // store's location
  const positions = [
    [37.63528, 127.07666],
    [37.62941, 127.08155],
  ];

  const storeImg = new kakao.maps.MarkerImage(
    "/images/marker.png",
    new kakao.maps.Size(64, 69),
    {
      offset: new kakao.maps.Point(32, 69),
    }
  );

  positions.forEach((position) => {
    new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(position[0], position[1]),
      image: storeImg,
    });
  });

  // user's location
  const onChangePermission = (state) => {
    if (state === "prompt") $("#permissionModal").modal("show");
    else if (state === "granted") {
      presentLocation(map, true);
    }
  };

  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    onChangePermission(result.state);
    result.addEventListener("change", () => onChangePermission(result.state));
  });
});

const presentLocation = (map, isInit) => {
  let marker = null;

  const success = (pos) => {
    const { latitude, longitude } = pos.coords;

    if (isInit) map.setCenter(new kakao.maps.LatLng(latitude, longitude));

    if (marker === null) {
      marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(latitude, longitude),
        image: new kakao.maps.MarkerImage(
          "/images/location.png",
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
