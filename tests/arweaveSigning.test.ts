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

    // Validating address
    const addressFromOwner = await arweaveClient.wallets.ownerToAddress(publicKey);

    // Assertions
    expect(validSignature).toBeTruthy();
    expect(addressFromOwner).toBe(address);
  });

});
