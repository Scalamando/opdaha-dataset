'use strict';

const fs = require('fs');
const { json } = require('stream/consumers');
const _ = require('underscore');

const rawData = fs.readFileSync('./playgrounds.geojson');
const osmData = JSON.parse(rawData);

const schema = {
    oid: "id",
    name: ["properties", "name"],
    alt_name: ["properties", "alt_name"],
    min_age: ["properties", "min_age"],
    max_age: ["properties", "max_age"],
    opening_hours: ["properties", "opening_hours"],
    wheelchair: ["properties", "wheelchair"],
    website: ["properties", "website"],
    geometry: "geometry"
}

const playgrounds = [];

for (const osmObj of osmData.features) {
    const playground = {};

    for (const key of Object.keys(schema)) {
        playground[key] = _.get(osmObj, schema[key], null);
    }

    playgrounds.push(playground)
}

fs.writeFileSync('playgrounds.json', JSON.stringify(playgrounds))