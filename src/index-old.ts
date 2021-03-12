const { run } = require("ar-gql");
const Arweave = require("arweave/node");

const VERSION = "0.005";

const client = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

async function findGraphQL(parameters: any) {
  const res = (
    await run(
      `
    {
      transactions(
        tags: [
          { name: "app", values: "Limestone" }
          { name: "type", values: "${parameters.type}" }
          { name: "token", values: "${parameters.token}" }
          { name: "version", values: "${VERSION}" }
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
    const tags = res[0].node.tags;
    const result: any = {};
    tags.forEach((tag: { name: string, value: string }) => {
      if (tag.name === "value") {
        result.price = parseFloat(tag.value);
      }
      if (tag.name === "time") {
        result.updated = new Date(parseInt(tag.value));
      }
    });
    return result;
  } else {
    throw new Error("Invalid data returned from Arweave.");
  }
}

module.exports = {
  getPrice: async function (token: any) {
    if (typeof token !== "string")
      throw new TypeError("Please provide a token symbol as string.");

    return await findGraphQL({
      type: "data-latest",
      token,
    });
  },
};
