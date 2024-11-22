window.addEventListener("load", () => {
  const map = new kakao.maps.Map(document.getElementById("map"), {
    center: new kakao.maps.LatLng(37.62941, 127.08155),
    level: 3,
  });
  map.setMaxLevel(5);

  positions = [
    [37.63528, 127.07666],
    [37.62941, 127.08155],
  ];

  const markerImage = new kakao.maps.MarkerImage(
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
      image: markerImage,
    });
  });
});
