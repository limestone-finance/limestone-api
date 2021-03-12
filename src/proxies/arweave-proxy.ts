import Arweave from "arweave/node";
import { run } from "ar-gql";
// import { PriceData } from "../types";

interface GraphQLParams {
  type: string;
  tokenSymbol: string;
  version: string;
};

export default class ArweaveProxy {
  arweaveClient: Arweave;

  constructor() {
    this.arweaveClient = Arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
    });
  }

  async findGraphQL(parameters: GraphQLParams) {
    const res = (
      await run(
        `
      {
        transactions(
          tags: [
            { name: "app", values: "Limestone" }
            { name: "type", values: "${parameters.type}" }
            { name: "token", values: "${parameters.tokenSymbol}" }
            { name: "version", values: "${parameters.version}" }
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
}
