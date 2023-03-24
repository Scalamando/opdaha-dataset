"use strict";

const STRAPI_URL = "http://localhost:1337";

const fs = require("fs");
const _ = require("underscore");
const centroid = require("@turf/centroid").default;
const axios = require("axios").default;

const rawData = fs.readFileSync("./playgrounds.geojson");
const geoJson = JSON.parse(rawData);

const schema = {
	oid: "id",
	name: ["properties", "name"],
	altName: ["properties", "alt_name"],
	minAge: ["properties", "min_age"],
	maxAge: ["properties", "max_age"],
	openingHours: ["properties", "opening_hours"],
	wheelchair: ["properties", "wheelchair"],
	location: "geometry",
};

const surroundings = [
	"cafe",
	"restaurant",
	"bakery",
	"shopping",
	"kiosk",
	"toilet",
];
const extras = ["bench", "ground", "shade", "fence", "greenery"];
const equipments = [
	"slide",
	"swing",
	"climbingframe",
	"sandpit",
	"seesaw",
	"springy",
	"playhouse",
	"roundabout",
	"water",
];

const playgrounds = [];

function getUniqueValues(arr) {
	const unique = new Set(arr);
	return [...unique];
}

for (const feature of geoJson.features) {
	const playground = {
		equipment: [],
	};

	for (const key of Object.keys(schema)) {
		playground[key] = _.get(feature, schema[key], null);
	}

	// Extract point coordinates
	if (playground.location.type === "Point") {
		playground.location = playground.location.coordinates;
	} else if (playground.location.type === "Polygon") {
		const centerPoint = centroid(playground.location);
		playground.location = centerPoint.geometry.coordinates;
	}

	// Extract playground equipment
	const featureEquipment = Object.keys(feature.properties).filter(
		key =>
			key.startsWith("playground:") && feature.properties[key] === "yes"
	);
	for (const equipment of featureEquipment) {
		const equipmentName = equipment.split(":")[1];
		playground.equipment.push(equipmentName);
	}

	if (playground.equipment.length === 0) {
		playground.equipment = getUniqueValues(
			Array.from(
				{
					length: Math.max(
						2,
						Math.floor(Math.random() * equipments.length)
					),
				},
				() => {
					const index = Math.floor(Math.random() * equipments.length);
					return equipments[index];
				}
			)
		);
	}

	playground.surroundings = getUniqueValues(
		Array.from(
			{ length: Math.floor(Math.random() * surroundings.length) },
			() => {
				const index = Math.floor(Math.random() * surroundings.length);
				return surroundings[index];
			}
		)
	);

	playground.extras = getUniqueValues(
		Array.from(
			{ length: Math.floor(Math.random() * extras.length) },
			() => {
				const index = Math.floor(Math.random() * extras.length);
				return extras[index];
			}
		)
	);

	playgrounds.push(playground);
}

fs.writeFileSync("playgrounds.json", JSON.stringify(playgrounds));

async function createStrapiItem(item) {
	const response = await axios.post(
		`${STRAPI_URL}/api/playgrounds`,
		{ data: item }
	);
	console.log(response.data);
}

for (const playground of playgrounds) {
	createStrapiItem(playground);
}
