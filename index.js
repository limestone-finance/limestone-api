const { run } = require("ar-gql");
const Arweave = require("arweave/node");

const client = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

async function findGraphQL(parameters) {
  const res = (
    await run(
      `
    {
      transactions(
        tags: [
          { name: "app", values: "Limestone" }
          { name: "type", values: "${parameters.type}" }
          { name: "token", values: "${parameters.token}" }
        ]
        block: { min: ${
          parseInt((await client.network.getInfo()).height) - 50
        } }
        first: 1
      ) {
        edges {
          node {
            tags {
              name
              value
            }
          }
        }
      }
    }
    `
    )
  ).data.transactions.edges;

  if (res[0]) {
    let tags = res[0].node.tags;
    let result = {};
    tags.forEach((tag) => {
      if (tag.name === "value") {
        result.price = parseFloat(tag.value);
      }
      if (tag.name === "time") {
        result.updated = new Date(parseInt(tag.value));
      }
    });
    return result;
  } else {
    throw Error("Invalid data returned from Arweave.");
  }
}

module.exports = {
  getPrice: async function (token) {
    if (typeof token !== "string")
      throw new TypeError("Please provide a token symbol as string.");

    return await await findGraphQL({
      type: "data-latest",
      token,
    });
  },
};
