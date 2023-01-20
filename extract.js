'use strict';

const fs = require('fs');
const _ = require('underscore');
const centroid = require('@turf/centroid').default;

const rawData = fs.readFileSync('./playgrounds.geojson');
const geoJson = JSON.parse(rawData);

const schema = {
    oid: "id",
    name: ["properties", "name"],
    alt_name: ["properties", "alt_name"],
    min_age: ["properties", "min_age"],
    max_age: ["properties", "max_age"],
    opening_hours: ["properties", "opening_hours"],
    wheelchair: ["properties", "wheelchair"],
    website: ["properties", "website"],
    location: "geometry"
}

const playgrounds = [];

for (const feature of geoJson.features) {
    const playground = {
        toys: []
    };

    for (const key of Object.keys(schema)) {
        playground[key] = _.get(feature, schema[key], null);
    }

    // Extract point
    if(playground.location.type === "Point") {
        playground.location = playground.location.coordinates;
    } else if (playground.location.type === "Polygon") {
        const centerPoint = centroid(playground.location);
        playground.location = centerPoint.geometry.coordinates;
    }

    // Extract playground toys
    const featureToys = Object.keys(feature.properties).filter(key => key.startsWith('playground:') && feature[key] === "yes");
    for (const toy of featureToys) {
        playground.toys.push(toy.split(':')[1]);
    }

    playgrounds.push(playground)
}

fs.writeFileSync('playgrounds.json', JSON.stringify(playgrounds))