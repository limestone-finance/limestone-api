import Arweave from "arweave/node";

describe("Test arweave signing and verification", () => {
  const arweaveClient: Arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });

  test("Should sign and verify signature", async () => {
    const jwk = await arweaveClient.wallets.generate();
    const address = await arweaveClient.wallets.jwkToAddress(jwk);

    // Create a transaction and print its owner
    const transactionA = await arweaveClient.createTransaction({
      data: "Hehe",
    }, jwk);
    console.log("JWK", jwk);
    console.log("Addres: " + address);
    console.log("Owner: " + transactionA.owner);

    // Signing
    const strToSign = "This is a test string data";
    const dataToSign = new TextEncoder().encode(strToSign);
    const signature = await arweaveClient.crypto.sign(jwk, dataToSign);

    // Verification
    // const publicKey = address;
    const publicKey = jwk.n;
    const validSignature = await arweaveClient.crypto.verify(
      publicKey,
      dataToSign,
      signature);

    // Assertions
    expect(validSignature).toBeTruthy();
  });

});
