window.APP_CONFIG = {
  map: {
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap contributors"
        }
      },
      layers: [
        {
          id: "osm",
          type: "raster",
          source: "osm"
        }
      ]
    },
    center: [13.059421290890569, 52.39922070744286],
    zoom: 14
  },
  container: {
    width: 1280,
    height: 720
  },
  distortion: {
    perspective: "1200px",
    rotateX: "0deg",
    rotateY: "0deg",
    rotateZ: "0deg",
    skewX: "0deg",
    skewY: "0deg",
    scaleX: 1,
    scaleY: 1,
    transformOrigin: "50% 50%"
  }
};
