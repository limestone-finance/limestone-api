import Arweave from "arweave/node";
import { run } from "ar-gql";

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

  async verifySignature(args: {
    signedData: string;
    signature: string;
    signerPublicKey: string }): Promise<boolean> {
      const signedBytes: Uint8Array =
        new TextEncoder().encode(args.signedData);
      const signatureBytes: Uint8Array =
        Uint8Array.from(Buffer.from(args.signature, "base64"));

      // TODO remove log
      // console.log({
      //   "signature -><-": Buffer.from(signatureBytes).toString("base64"),
      //   "args.signature": args.signature,
      // });

      return await this.arweaveClient.crypto.verify(
        args.signerPublicKey,
        signedBytes,
        signatureBytes);
    }
}
