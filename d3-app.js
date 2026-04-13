(function initD3Map() {
  const config = window.APP_CONFIG;

  if (!config) {
    throw new Error("APP_CONFIG missing. Make sure config.js loads before d3-map.js.");
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

  const projection = d3
    .geoMercator()
    .center(center)
    .scale((512 * Math.pow(2, zoom)) / (2 * Math.PI))
    .translate([width / 2, height / 2]);

  const path = d3.geoPath(projection);

  const svg = d3
    .select("#d3-map")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", width)
    .attr("height", height)
    .attr("role", "img")
    .attr("aria-label", "Potsdam bike lines map");

  d3.json("./data/potsdam-bikes.geojson").then((geojson) => {
    const features = (geojson.features || []).filter((feature) => {
      const type = feature.geometry && feature.geometry.type;
      return type === "LineString" || type === "MultiLineString";
    });

    svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#7df9ff")
      .attr("stroke-width", 1.6)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("path")
      .data(features)
      .join("path")
      .attr("d", path)
      .attr("opacity", 0.88);
  }).catch((error) => {
    console.error("Failed to load bike lines GeoJSON:", error);
  });
})();
