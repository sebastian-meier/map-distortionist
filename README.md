# Map Distortionist

A set of minimal map boilerplates that share a single configuration file and a CSS-based distortion system. Each boilerplate renders the same dataset — Potsdam bike route lines — using a different rendering library. Distortion (perspective, rotation, skew, scale) is applied as a CSS transform to the map container, so the underlying map library needs no modification.

## Boilerplates

All three pages load `config.js` first, then their own app script. The HTML structure is identical across all three:

```
#stage (full-viewport centering grid)
└── #map-shell (sized container, receives CSS transform)
    └── #map / #d3-map / #deck-map (map fills shell 100%)
```

### `index.html` — MapLibre GL

Uses [MapLibre GL](https://maplibre.org/) with raster OSM tiles as a basemap. The map is fully interactive (pan, zoom, rotate) via the built-in navigation control. Map style, center, and zoom are read from `config.js`.

**Script:** `app.js`

### `d3-map.html` — D3.js SVG

Uses [D3.js v7](https://d3js.org/) with a Mercator projection to render the bike line GeoJSON as an inline SVG. No basemap — lines are drawn in cyan on a black background. The projection is derived from the `center` and `zoom` values in `config.js`, matching the Mercator tile zoom scale formula `512 × 2^zoom / 2π`.

**Script:** `d3-app.js`

### `deck-gl-map.html` — Deck.gl

Uses [deck.gl](https://deck.gl/) standalone (no basemap) with a `GeoJsonLayer` to render the bike lines. The `MapView` (Mercator) is used so WGS84 coordinates map correctly. The view is interactive via deck.gl's built-in controller. Center and zoom are read from `config.js`.

**Script:** `deck-gl-app.js`

---

## Distortion system

The distortion system applies a CSS 3D transform to `#map-shell`, the container that wraps every map. Because the transform sits outside the map library entirely, it works identically for MapLibre, D3, and deck.gl without touching any rendering code.

### How it works

**1. Configuration (`config.js`)**

All distortion parameters live in `window.APP_CONFIG.distortion`:

```js
window.APP_CONFIG = {
  map: { ... },
  container: {
    width: 1280,
    height: 720
  },
  distortion: {
    perspective:     "1200px",   // depth of the 3D viewing frustum
    rotateX:         "0deg",     // tilt forward / backward
    rotateY:         "0deg",     // turn left / right
    rotateZ:         "0deg",     // in-plane rotation
    skewX:           "0deg",     // horizontal shear
    skewY:           "0deg",     // vertical shear
    scaleX:          1,          // horizontal stretch
    scaleY:          1,          // vertical stretch
    transformOrigin: "50% 50%"   // anchor point for all transforms
  }
};
```

**2. CSS custom properties (`styles.css`)**

`#map-shell` reads nine custom properties to compose its transform:

```css
#map-shell {
  width:            var(--map-width);
  height:           var(--map-height);
  transform-origin: var(--transform-origin);
  transform:
    perspective(var(--perspective))
    rotateX(var(--rotate-x))
    rotateY(var(--rotate-y))
    rotateZ(var(--rotate-z))
    skewX(var(--skew-x))
    skewY(var(--skew-y))
    scale(var(--scale-x), var(--scale-y));
}
```

The `:root` block defines neutral defaults so the page renders correctly even before the app script runs:

```css
:root {
  --map-width:        1280px;
  --map-height:       720px;
  --perspective:      1200px;
  --rotate-x:         0deg;
  --rotate-y:         0deg;
  --rotate-z:         0deg;
  --skew-x:           0deg;
  --skew-y:           0deg;
  --scale-x:          1;
  --scale-y:          1;
  --transform-origin: 50% 50%;
}
```

**3. App script bridge**

Each app script reads `APP_CONFIG` and writes the values from `distortion` (and `container`) onto `:root` via `setProperty`, overriding the CSS defaults:

```js
root.style.setProperty("--perspective", distortion.perspective ?? "1200px");
root.style.setProperty("--rotate-x",    distortion.rotateX    ?? "0deg");
// … and so on for all nine properties
```

Numeric values for `scaleX` / `scaleY` are passed through as-is; all other values are expected to include their CSS unit (`deg`, `px`, `%`).

### Applying a distortion

Edit the `distortion` block in `config.js`. For example, a pseudo-isometric tilt:

```js
distortion: {
  perspective:     "800px",
  rotateX:         "45deg",
  rotateY:         "0deg",
  rotateZ:         "0deg",
  skewX:           "0deg",
  skewY:           "0deg",
  scaleX:          1,
  scaleY:          1,
  transformOrigin: "50% 50%"
}
```

All three boilerplates pick up the same values automatically.

### Transform origin

`transformOrigin` controls the anchor point around which all transforms are applied. The default `"50% 50%"` anchors to the centre of `#map-shell`. Use `"0% 0%"` to anchor to the top-left corner, or absolute pixel values for a fixed world-space anchor point.

---

## File structure

```
map-distortionist/
├── config.js          # shared configuration (map, container, distortion)
├── styles.css         # layout and CSS distortion transform
│
├── index.html         # MapLibre GL boilerplate
├── app.js
│
├── d3-map.html        # D3.js SVG boilerplate
├── d3-app.js
│
├── deck-gl-map.html   # Deck.gl boilerplate
├── deck-gl-app.js
│
└── data/
    └── potsdam-bikes.geojson   # Potsdam bike route lines (WGS84)
```

## Serving locally

The GeoJSON is loaded via `fetch`, so the pages must be served over HTTP rather than opened directly as `file://` URLs. Any static file server works:

```sh
npx serve .
# or
python3 -m http.server
```
