import LimestoneApi from "./limestone-api";
import LimestoneQuery from "./limestone-query";
import symbols from "./symbols";

class Limestone extends LimestoneApi {
  query = LimestoneQuery;
  symbols = symbols;
  LimestoneApi = LimestoneApi;

  constructor(opts?: any) {
    super(opts);
  }
}

export = new Limestone();
