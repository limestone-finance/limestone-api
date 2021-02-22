const Api = require("./index.js");
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-datetime"));
chai.use(require("chai-as-promised"));

describe("simple api tests", function () {
  it("should raise error if no token is given", async function () {
    await expect(Api.getPrice()).to.be.rejectedWith(
      "Please provide a token symbol as string."
    );
  });

  it("should raise error if token is not a string", async function () {
    await expect(Api.getPrice(123)).to.be.rejectedWith(
      "Please provide a token symbol as string."
    );
  });

  it("should return sensible value as the price of Arweave token", async function () {
    let price = await Api.getPrice("AR");
    expect(price.price).to.greaterThan(0.1);
    expect(price.price).to.lessThan(100);
  });

  it("should return update time within last 20m", async function () {
    let price = await Api.getPrice("AR");
    expect(price.updated).closeToTime(new Date(), 20 * 60);
  });
});
