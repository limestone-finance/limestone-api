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

interface ProviderNameToDetailsMapping {
  [providerName: string]: {
    address: string;
    publicKey: string;
  }
};

const LAST_BLOCKS_TO_CHECK = 50;

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
      const minBlock = networkInfo.height - LAST_BLOCKS_TO_CHECK;
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
    const mapping: ProviderNameToDetailsMapping = {
      "limestone": {
        address: "I-5rWUehEv-MjdK9gFw09RxfSLQX9DIHxG614Wf8qo0",
        publicKey: "xyTvKiCST8bAT6sxrgkLh8UCX2N1eKvawODuxwq4qOHIdDAZFU_3N2m59rkZ0E7m77GsJuf1I8u0oEJEbxAdT7uD2JTwoYEHauXSxyJYvF0RCcZOhl5P1PJwImd44SJYa_9My7L84D5KXB9SKs8_VThe7ZyOb5HSGLNvMIK6A8IJ4Hr_tg9GYm65CRmtcu18S9mhun8vgw2wi7Gw6oR6mc4vU1I-hrU66Fi7YlXwFieP6YSy01JqoLPhU84EunPQzXPouVSbXjgRU5kFVxtdRy4GK2fzEBFYsQwCQgFrySCrFKHV8AInu9jerfof_DxNKiXkBzlB8nc22CrYnvvio_BWyh-gN0hQHZT0gwMR-A7sbXNCQJfReaIZzX_jP6XoB82PnpzmL_j1mJ2lnv2Rn001flBAx9AYxtGXd9s07pA-FggTbEG3Y2UnlWW6l3EJ93E0IfxL0PqGEUlp217mxUHvmTw9fkGDWa8rT9RPmsTyji-kMFSefclw80cBm_iOsIEutGP4S3LDbP-ZVJWDeJOBQQpSgwbisl8qbjl2sMQLQihoG2TQyNbmLwfyq-XSULkXjUi1_6BH36wnDBLWBKF-bS2bLKcGtn3Vjet72lNHxJJilcj8vpauwJG0078S_lO5uGt6oicdGR6eh_NSn6_8za_tXg0G_fohz4Yb1z8",
      }
    };

    if (mapping[providerName] === undefined) {
      throw new Error(`Provider address not found: ${providerName}`);
    } else {
      return mapping[providerName].address;
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
