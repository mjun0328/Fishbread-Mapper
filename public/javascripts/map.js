let storeViewer, map;

window.addEventListener("load", () => {
  initMap();

  // pin store's location
  const positions = [
    [37.63528, 127.07666],
    [37.62941, 127.08155],
  ];
  pinStore(positions);

  // request user's location permission
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

const initMap = () => {
  map = new kakao.maps.Map(document.getElementById("map"), {
    center: new kakao.maps.LatLng(37.577734, 126.976866),
    level: 3,
  });
  map.setMaxLevel(5);
};

const pinStore = (positions) => {
  const storeImg = new kakao.maps.MarkerImage(
    "/images/marker.png",
    new kakao.maps.Size(64, 69),
    {
      offset: new kakao.maps.Point(32, 69),
    }
  );

  storeViewer = new StoreViewer(map);

  positions.forEach((position) => {
    const marker = new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(position[0], position[1]),
      image: storeImg,
    });

    kakao.maps.event.addListener(marker, "click", () => {
      storeViewer.show(marker);
    });
  });
};

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

class StoreViewer {
  constructor(map) {
    this.map = map;
    this.store = null;
  }

  show = (marker) => {
    const node = `<div class="info">
      <div class="title">
        <strong>공릉역 1번 출구</strong>
        <button type="button" class="btn-close" aria-label="Close" onclick="storeViewer.hide()"></button>
      </div>
      <div id="carouselExample" class="carousel slide mt-1 mb-2">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="/images/image.png" class="d-block w-100" />
          </div>
          <div class="carousel-item">
            <img src="/images/image.png" class="d-block w-100" />
          </div>
          <div class="carousel-item">
            <img src="/images/image.png" class="d-block w-100" />
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      <div class="meta">
        <div>
          <img src="/images/near.svg" />
          <span>124m</span>
        </div>
        <div>
          <img src="/images/star.svg" />
          <span>4.5 (92)</span>
        </div>
      </div>
      <button type="button" class="more btn btn-primary mt-4 mb-2">
        이 가게의 5개 리뷰 보기
      </button>
      <div class="link">
        <button type="button" class="btn btn-secondary">리뷰 남기기</button>
        <button type="button" class="btn">잘못된 정보 알려주기</button>
      </div>
    </div>`;

    const infoWindow = new kakao.maps.InfoWindow({
      content: node,
    });

    this.hide();
    this.store = infoWindow;
    infoWindow.open(this.map, marker);
  };

  hide = () => {
    this.store?.close();
    this.store = null;
  };
}
