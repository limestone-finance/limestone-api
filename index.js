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

var recentHeight;

async function getCurrentHeight() {
  if (!recentHeight) {
    let info = await arweave.network.getInfo();
    recentHeight = parseInt(info.height);
  }
  return recentHeight;
}

async function findGraphQL(parameters) {
  //We start browsing from last 100 blocks to speed up search time
  let startBlock = (await getCurrentHeight()) - 100;
  let query = `{ transactions(
  first: 1,
  tags: [
      { name: "app", values: ["${parameters.app}"] },
      { name: "type", values: ["${parameters.type}"] },
      { name: "version", values: ["${parameters.version}"] },
      { name: "token", values: ["${parameters.token}"] }
    ],
    block: {min: ${startBlock}},
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
