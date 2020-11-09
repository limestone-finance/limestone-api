const Arweave = require('arweave/node');
const ARQL = require('arql-ops');
const fetch = require('isomorphic-fetch');

const VERSION = "0.005";

const arweave = Arweave.init({
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
});

async function findARQL(parameters) {
  let arqlParameters = Object.keys(parameters).reduce((acc, key) => {
    acc.push(ARQL.equals(key, parameters[key]));
    return acc;
  }, []);
  let myQuery = ARQL.and(...arqlParameters);
  let results = await arweave.arql(myQuery);
  return results;
}

async function findGraphQL(parameters) {
  let query = `{ transactions(
  first: 1,
  tags: [
      { name: "app", values: ["${parameters.app}"] },
      { name: "type", values: ["${parameters.type}"] },
      { name: "version", values: ["${parameters.version}"] },
      { name: "token", values: ["${parameters.token}"] }
    ],
    block: {min: 564000},
    sort: HEIGHT_DESC
    ) {
      edges {
        node {
          id,
          block {
            height
          },
          tags {
            name
            value
          }
        }
      }
    }
  }
`;

  let response = await fetch("https://arweave.dev/graphql", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  });

  let res = await response.json();
  if (res.data) {
    let tags = res.data.transactions.edges[0].node.tags;
    let result = {};
    tags.forEach(tag => {
      if (tag.name === "value") {
        result.price = parseFloat(tag.value);
      }
      if (tag.name === "time") {
        result.updated = new Date(parseInt(tag.value))
      }
    });
    return result;
  } else {
    throw Error("No data returned from Arweave Graph QL");
  }

}

async function getTags(tx) {
  let transaction = await arweave.transactions.get(tx);
  let tags = {};
  try {
    transaction.get('tags').forEach(tag => {
      let key = tag.get('name', {decode: true, string: true});
      let value = tag.get('value', {decode: true, string: true});
      tags[key] = value;
    });
  } catch (error) {
    console.log(error);
  }
  return tags;
}

async function getLatestData(token, txId, dataTxs) {
  if (!dataTxs) {
    dataTxs = await findARQL({app: "Limestone", type: "data-latest", version: VERSION, token: token});
  }

  let latestTx = dataTxs.length > txId ? dataTxs[txId] : null;

  if (latestTx) {
    let latestData = null;
    try {
      latestData = await getTags(latestTx);
      return latestData;
    } catch {
      console.log("Cannot get tags trying: " + (txId+1));
      return await getLatestData(token, txId+1, dataTxs);
    }
  }
}

module.exports = {
  getPrice: async function (token) {
    if (typeof token !== "string") throw new TypeError("Please provide a token symbol as string.");

    return await await findGraphQL({
      app: "Limestone",
      type: "data-latest",
      version: VERSION,
      token: token
    });
  }
};
