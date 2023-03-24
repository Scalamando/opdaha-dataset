# Platzsy Dataset - OpDaHa 2023

This repo contains the playground dataset for the Platzsy app and the scripts required to generate them.

## Generating and uploading the dataset

All required data is already present in the repo. Replace the `STRAPI_URL` constant at the top of [`extract.js`](./extract.js) with your instances url. If you're developing locally, the url should already be correct. Afterwards, Simply run the [`extract.js`](./extract.js) script with `node extract.js` to generate and upload all playgrounds to your strapi instance.

> **Warning**
> Make sure your Strapi instance is running before executing `extract.js`

## Updating the underlying dataset

The playground data in this repo was taken from OpenStreetMap via [Overpass Turbo](https://overpass-turbo.eu/). In order to update the `playgrounds.geojson`, execute a search with the following query:

```js
/*
This has been generated by the overpass-turbo wizard.
The original search was:
“leisure=playground”
*/
[out:json][timeout:25];
// gather results
(
  // query part for: “leisure=playground”
  node["leisure"="playground"]({{bbox}});
  way["leisure"="playground"]({{bbox}});
  relation["leisure"="playground"]({{bbox}});
);
// print results
out body;
>;
out skel qt;
```

Lastly, download all results in the GeoJSON format and replace the `playgrounds.geojson` file in this repo.