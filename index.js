const csvParse = require('csv-parse');
const fs = require('fs');
const fsPromises = require('fs').promises;
const d3_composite = require('d3-composite-projections');
const d3 = require('d3-geo');
const topojson = require('topojson-client');
const { createCanvas } = require('canvas')
const allMunicipalities = require('./node_modules/es-atlas/es/municipalities.json');

const canvas = createCanvas(960, 500)
const context = canvas.getContext('2d');
const projection = d3_composite.geoConicConformalSpain();
const path = d3.geoPath(projection, context);

const CODIGOS_GALICIA = [15, 27, 32, 36];

(async () => {
    const belongsToGalicia = (item) => CODIGOS_GALICIA.indexOf(parseInt(item.CPRO)) !== -1; 

    const data = await fsPromises.readFile('./data/municipios.csv');

    csvParse(data, {
        columns: true,
        skip_empty_lines: true,
    }, function(err, result) {
        result = result.filter( belongsToGalicia );
        //console.log(result);
    })

})();

const polygonBelongsToGalicia = (polygon) => CODIGOS_GALICIA.indexOf(parseInt(polygon.id.slice(0, 2))) !== -1;

//console.log(allMunicipalities.objects.municipalities)
//const galicianMunicipalities = allMunicipalities.objects.municipalities.geometries.filter( polygonBelongsToGalicia );

console.log(allMunicipalities.arcs);

// allMunicipalities.objects.municipalities.geometries = galicianMunicipalities;
console.log(allMunicipalities.objects.municipalities.geometries.length);

context.beginPath();
path(topojson.mesh(allMunicipalities.coordinates[0]));
context.stroke();

canvas.pngStream().pipe(fs.createWriteStream('preview.png'));
