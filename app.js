(function init() {
  const config = window.APP_CONFIG;

  if (!config) {
    throw new Error("APP_CONFIG missing. Make sure config.js loads before app.js.");
  }

  const root = document.documentElement;
  const size = config.container || {};
  const distortion = config.distortion || {};

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

  const mapConfig = config.map || {};

  const map = new maplibregl.Map({
    container: "map",
    style: mapConfig.style || "https://demotiles.maplibre.org/style.json",
    center: mapConfig.center || [0, 0],
    zoom: mapConfig.zoom ?? 2,
    attributionControl: false
  });

  map.addControl(new maplibregl.NavigationControl(), "top-right");
})();
