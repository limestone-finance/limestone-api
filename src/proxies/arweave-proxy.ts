import Arweave from "arweave/node";
import { run } from "ar-gql";

interface GraphQLParams {
  type: string;
  version: string;
  provider: string;
};

interface GetTxDataOpts {
  parseJSON: boolean;
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

  async findTxIdInGraphQL(
    parameters: GraphQLParams): Promise<string | undefined> {
      const networkInfo = await this.arweaveClient.network.getInfo();
      const minBlock = networkInfo.height - 50;
      const providerAddress =
        await this.getAddressForProvider(parameters.provider);

      const query = `
        {
          transactions(
            tags: [
              { name: "app", values: "Limestone" }
              { name: "type", values: "${parameters.type}" }
              { name: "version", values: "${parameters.version}" }
            ]
            block: { min: ${minBlock} }
            owners: ["${providerAddress}"]
            first: 1
          ) {
            edges {
              node {
                id
              }
            }
          }
        }`;

      const res = (await run(query)).data.transactions.edges;

      if (res.length > 0) {
        return res[0].node.id;
      } else {
        return undefined;
      }
    }

  async getTxDataById(txId: string, opts?: GetTxDataOpts): Promise<any> {
    const data =
      await this.arweaveClient.transactions.getData(txId, { decode: true });
    const strData = Arweave.utils.bufferToString(Buffer.from(data));

    if (opts !== undefined && opts.parseJSON) {
      return JSON.parse(strData);
    } else {
      return strData;
    }
  }

  async getAddressForProvider(providerName: string): Promise<string> {
    const mapping: { [name: string]: string } = {
      "limestone": "I-5rWUehEv-MjdK9gFw09RxfSLQX9DIHxG614Wf8qo0",
    };

    const address = mapping[providerName];

    if (address === undefined) {
      throw new Error(`Provider address not found: ${providerName}`);
    } else {
      return String(address);
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

      return await this.arweaveClient.crypto.verify(
        args.signerPublicKey,
        signedBytes,
        signatureBytes);
    }
}
