# Wales Coast Path Tracker

An interactive map for logging your walk along the [Wales Coast Path](https://www.walescoastpath.gov.uk/) — all 870 miles of it, from the English border near Chester round to Chepstow on the Severn.

Click from one town to the next along the coast and the real stretch of path between them turns **red** to mark it walked. The app keeps a running total of your miles and the percentage of the path complete, and it saves your progress automatically. It's a single self-contained HTML file with no install, no sign-up, and no server — so it runs straight from GitHub Pages or even by opening the file locally.

![Wales Coast Path Tracker](wales-coast-path-share-card.png)

## Features

- **The real route, not an approximation.** The coastline is drawn from Ordnance Survey route data, reprojected to web coordinates, so it follows every cove, headland and estuary rather than cutting corners.
- **Tick off your walk town by town.** Click a town, then the next one along the coast; the stretch between them turns red. Click again to undo.
- **Eight sections, broken into day legs.** The path is organised into its national sections (North Wales, Anglesey, Llŷn, Ceredigion, Pembrokeshire, Carmarthenshire, Gower, and South Wales & Severn), each with town-to-town legs you can expand and check off in the side panel.
- **Progress tracking.** A live counter shows miles walked and percent complete; each section shows its own progress.
- **Saves automatically.** Your ticks are stored in your browser, so they're still there when you come back.
- **Export / import.** Back up your progress to a small file, or move it between devices (see [Saving and moving your progress](#saving-and-moving-your-progress)).
- **Works on phone and desktop.** The layout adapts to small screens.

## How to use it

1. Open the page.
2. On the map, **click one town, then the next town along the coast.** The path between them turns red to show you've walked it.
3. Repeat along the route. The counter at the top fills up as you go.
4. To undo a leg, click its two towns again (or click the leg in the side panel).
5. Use the side panel on the right to expand a section and tick legs off from a list instead of the map, if you prefer.

Faint dashed lines on the map are the **official alternative routes**; the solid coloured line is the main path.

> A note on accuracy: each walked stretch snaps to the nearest point on the real coastline, so it occasionally starts or ends a short way along the coast from the exact town pin. Three legs cross open water with no coastal path (the Menai Strait, the Dyfi estuary at Machynlleth, and Milford Haven at Pembroke); those show as a straight link instead.

## Saving and moving your progress

Your progress lives in **your browser on the device you're using.** It is not shared with anyone and is not synced between devices automatically — each browser keeps its own copy. To move or back up your progress:

- **Export progress** — saves a small `.json` file of everything you've ticked off (it also records your name, if you enter one, plus the date and your mileage). Keep this file as a backup.
- **Import progress** — loads such a file back in. If you already have progress on the device, it asks whether to **replace** it or **merge** the two.

This is how you move your walk from your phone to your laptop (or vice versa): export on one, transfer the file, import on the other. Because there are no accounts, several people can each use the same page and keep their own separate progress simply by keeping their own export files.

## Hosting it on GitHub Pages

The whole app is one HTML file, so hosting is simple and free.

1. Create a repository and add **`wales-coast-path-map-tracker_7.html`** (rename it to `index.html` if you want it to be the default page) and **`wales-coast-path-share-card.png`**.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, pick your branch (usually `main`) and the `/ (root)` folder, then **Save**.
4. After a minute or two your site will be live at `https://YOURNAME.github.io/REPO/`.

The app loads its map tiles over HTTPS, which matches GitHub Pages, so there are no mixed-content problems.

### Making the share image appear on links

When you paste your link into WhatsApp, Messages, Facebook, Slack and similar, you can have them show the preview card. Add these lines inside the `<head>` of the HTML, replacing the URL with your real address:

```html
<meta property="og:title" content="Wales Coast Path Tracker">
<meta property="og:description" content="Tick off your walk along all 870 miles of the Welsh coastline.">
<meta property="og:image" content="https://YOURNAME.github.io/REPO/wales-coast-path-share-card.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

Keep `wales-coast-path-share-card.png` in the same repository folder so that URL resolves.

## Running it locally

You don't need a server. Download the HTML file and double-click it, or open it in any modern browser. It needs an internet connection only to load the background map tiles; your progress and all the route data are already inside the file.

## How it works (under the hood)

- The map is rendered with [Leaflet](https://leafletjs.com/) over [OpenStreetMap](https://www.openstreetmap.org/) tiles.
- The coastline comes from Ordnance Survey Wales Coast Path data supplied in the British National Grid projection (EPSG:27700). It's reprojected to WGS84 (latitude/longitude) and simplified so the whole route fits inside the single HTML file while keeping its detail.
- Each of the ~100 town-to-town legs is matched to the slice of real coastline between its two towns, so completing a leg colours the actual path.
- Progress is stored client-side in the browser; export/import uses a plain JSON file.

## Credits & data

- Route geometry: Ordnance Survey / Wales Coast Path spatial data.
- Base map: © OpenStreetMap contributors.
- Mapping library: Leaflet.

The Wales Coast Path (Llwybr Arfordir Cymru) is managed by [Natural Resources Wales](https://naturalresources.wales/) and partner authorities.

## Licence

Add your chosen licence here (for example, MIT for the code). Note that the underlying route data and map tiles carry their own terms from Ordnance Survey and OpenStreetMap respectively; check those before redistributing the data itself.
