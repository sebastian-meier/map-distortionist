(function initDeckMap() {
  const config = window.APP_CONFIG;

  if (!config) {
    throw new Error("APP_CONFIG missing. Make sure config.js loads before deck-gl-app.js.");
  }

  const root = document.documentElement;
  const size = config.container || {};
  const distortion = config.distortion || {};
  const mapConfig = config.map || {};
  const center = mapConfig.center || [0, 0];
  const zoom = mapConfig.zoom ?? 2;

  function px(value, fallback) {
    const v = value ?? fallback;
    return typeof v === "number" ? `${v}px` : v;
  }

  function setVar(name, value) {
    if (value !== undefined && value !== null) {
      root.style.setProperty(name, String(value));
    }
  }

  setVar("--map-width", px(size.width, 1280));
  setVar("--map-height", px(size.height, 720));

  setVar("--perspective", distortion.perspective ?? "1200px");
  setVar("--rotate-x", distortion.rotateX ?? "0deg");
  setVar("--rotate-y", distortion.rotateY ?? "0deg");
  setVar("--rotate-z", distortion.rotateZ ?? "0deg");
  setVar("--skew-x", distortion.skewX ?? "0deg");
  setVar("--skew-y", distortion.skewY ?? "0deg");
  setVar("--scale-x", distortion.scaleX ?? 1);
  setVar("--scale-y", distortion.scaleY ?? 1);
  setVar("--transform-origin", distortion.transformOrigin ?? "50% 50%");

  const width = Number(size.width) || 1280;
  const height = Number(size.height) || 720;

  const { Deck, GeoJsonLayer } = deck;

  const deckInstance = new Deck({
    parent: document.getElementById("deck-map"),
    width,
    height,
    initialViewState: {
      longitude: center[0],
      latitude: center[1],
      zoom,
      pitch: 0,
      bearing: 0
    },
    controller: true,
    layers: []
  });

  fetch("./data/potsdam-bikes.geojson")
    .then((res) => res.json())
    .then((geojson) => {
      deckInstance.setProps({
        layers: [
          new GeoJsonLayer({
            id: "bike-lines",
            data: geojson,
            stroked: true,
            filled: false,
            getLineColor: [125, 249, 255],
            getLineWidth: 2,
            lineWidthMinPixels: 1,
            lineWidthUnits: "pixels",
            opacity: 0.88
          })
        ]
      });
    })
    .catch((error) => {
      console.error("Failed to load bike lines GeoJSON:", error);
    });
})();
