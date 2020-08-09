#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const CSV = require('csv');
const dataFolder = '/data';

// read data, if needed
// if (fs.existsSync(pathToData)) {
//   data = JSON.parse(fs.readFileSync(pathToData));
// }

// scrape data, possibly using prior data
async function getData() {
  const response = await fetch(
    'https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=324a75d9-3609-4276-8c87-49c754a1ec73&limit=500'
  ).then((res) => res.json());
  return response.result.records;
}

// execute and persist data
getData() // no top level await... yet
  .then((data) => {
    // persist data
    console.log(data);

    writeToFile(data, path.resolve(path.join(__dirname, dataFolder, 'm2') + '.csv'), ['end_of_month', 'm2']);
    console.log('done');
  });

function writeToFile(data, filePath, cols) {
  CSV.stringify(
    data,
    {
      header: true,
      columns: [{ key: cols[0] }, { key: cols[1] }],
    },
    function (err, output) {
      console.log(output);
      fs.writeFile(filePath, output, (err) => {
        console.log('csv saved.');
      });
    }
  );
}

/**
 *
 * utils
 *
 */
function fileString(ts) {
  const year = ts.getUTCFullYear();
  const month = (ts.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = ts.getUTCDate().toString().toString().padStart(2, '0');
  const name = `${year}-${month}-${day}`;
  return name;
}
