import Arweave from "arweave/node";
import { run } from "ar-gql";
import { ProviderNameToAddressMapping } from "./types";

const { version } = require('./package.json');

interface GraphQLParams {
  type: string;
  token: string;
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

  async getProivderNameToAddressMapping():
    Promise<ProviderNameToAddressMapping> {
      return {
        "limestone-alex": "I-5rWUehEv-MjdK9gFw09RxfSLQX9DIHxG614Wf8qo0",
      };
    }

  // TODO: update this function to support new bulk prices on arweave
  async getPrice(tokenSymbol: string, opts: { provider:  }) {
    return await findGraphQL({
      type: "data",
      tokenSymbol,
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
            { name: "token", values: "${parameters.token}" }
            { name: "version", values: "${version}" }
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
