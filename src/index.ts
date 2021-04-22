import LimestoneApi from "./limestone-api";
import LimestoneQuery from "./limestone-query";

class Limestone extends LimestoneApi {
  query = LimestoneQuery;
  LimestoneApi = LimestoneApi;

  constructor(opts?: any) {
    super(opts);
  }
}

export = new Limestone();
