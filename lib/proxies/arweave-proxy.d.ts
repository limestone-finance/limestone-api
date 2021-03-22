import Arweave from "arweave/node";
interface GraphQLParams {
    type: string;
    version: string;
    providerAddress: string;
}
interface GraphQLResponse {
    permawebTx: string;
    tags: TagsObj;
}
interface TagsObj {
    [name: string]: string;
}
interface GetTxDataOpts {
    parseJSON: boolean;
}
interface ProviderDetails {
    address: string;
    publicKey: string;
}
export default class ArweaveProxy {
    arweaveClient: Arweave;
    constructor();
    findPricesInGraphQL(parameters: GraphQLParams): Promise<GraphQLResponse | undefined>;
    getTxDataById(txId: string, opts?: GetTxDataOpts): Promise<any>;
    getProviderDetails(providerName: string): Promise<ProviderDetails>;
    verifySignature(args: {
        signedData: string;
        signature: string;
        signerPublicKey: string;
    }): Promise<boolean>;
}
export {};
