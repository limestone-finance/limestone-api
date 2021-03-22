"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var arweave_proxy_1 = __importDefault(require("./proxies/arweave-proxy"));
var cache_proxy_1 = __importDefault(require("./proxies/cache-proxy"));
var config_json_1 = require("./config.json");
var LIMESTON_API_DEFAULTS = {
    provider: "limestone",
    useCache: true,
};
var LimestoneApi = /** @class */ (function () {
    function LimestoneApi(opts) {
        this.arweaveProxy = opts.arweaveProxy;
        this.cacheProxy = new cache_proxy_1.default();
        this.version = lodash_1.default.defaultTo(opts.version, config_json_1.version);
        this.verifySignature = lodash_1.default.defaultTo(opts.verifySignature, false);
        this.defaultProvider = lodash_1.default.defaultTo(opts.defaultProvider, LIMESTON_API_DEFAULTS.provider);
        this.useCache = lodash_1.default.defaultTo(opts.useCache, LIMESTON_API_DEFAULTS.useCache);
    }
    // Here we can pass any async code that we need to execute on api init
    // For example we can load provider name to address mapping here
    LimestoneApi.init = function (config) {
        if (config === void 0) { config = {}; }
        var arweaveProxy = new arweave_proxy_1.default();
        var optsToCopy = lodash_1.default.pick(config, [
            "defaultProvider",
            "verifySignature",
            "useCache",
            "version",
        ]);
        return new LimestoneApi(__assign(__assign({}, optsToCopy), { arweaveProxy: arweaveProxy }));
    };
    LimestoneApi.prototype.getPrice = function (symbolOrSymbols, opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var provider, shouldVerifySignature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        provider = lodash_1.default.defaultTo(opts.provider, this.defaultProvider);
                        shouldVerifySignature = lodash_1.default.defaultTo(opts.verifySignature, this.verifySignature);
                        if (!lodash_1.default.isArray(symbolOrSymbols)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getPriceForManyTokens({
                                symbols: symbolOrSymbols,
                                provider: provider,
                                shouldVerifySignature: shouldVerifySignature,
                            })];
                    case 1: 
                    // Getting latest price for many tokens
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!(typeof symbolOrSymbols === "string")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getLatestPriceForOneToken({
                                symbol: symbolOrSymbols,
                                provider: provider,
                                shouldVerifySignature: shouldVerifySignature,
                            })];
                    case 3: 
                    // Getting latest price for one token
                    return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LimestoneApi.prototype.getHistoricalPrice = function (symbolOrSymbols, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, shouldVerifySignature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        provider = lodash_1.default.defaultTo(opts.provider, this.defaultProvider);
                        shouldVerifySignature = lodash_1.default.defaultTo(opts.verifySignature, this.verifySignature);
                        if (!lodash_1.default.isArray(symbolOrSymbols)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getPriceForManyTokens({
                                symbols: symbolOrSymbols,
                                timestamp: opts.date.getTime(),
                                provider: provider,
                                shouldVerifySignature: shouldVerifySignature,
                            })];
                    case 1: 
                    // Getting historical price for many tokens
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!(typeof symbolOrSymbols === "string")) return [3 /*break*/, 6];
                        if (!(opts.interval !== undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getHistoricalPricesInIntervalForOneSymbol({
                                symbol: symbolOrSymbols,
                                fromTimestamp: opts.startDate.getTime(),
                                toTimestamp: opts.endDate.getTime(),
                                interval: opts.interval,
                                provider: provider,
                                shouldVerifySignature: shouldVerifySignature,
                            })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [4 /*yield*/, this.getHistoricalPriceForOneSymbol({
                            symbol: symbolOrSymbols,
                            timestamp: opts.date.getTime(),
                            provider: provider,
                            shouldVerifySignature: shouldVerifySignature,
                        })];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    LimestoneApi.prototype.getAllPrices = function (opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var provider;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        provider = lodash_1.default.defaultTo(opts.provider, this.defaultProvider);
                        if (!this.useCache) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cacheProxy.getPriceForManyTokens({ provider: provider })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.getPricesFromArweave(provider)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LimestoneApi.prototype.getLatestPriceForOneToken = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var price, price, prices, priceForSymbol;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.useCache) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.cacheProxy.getPrice(lodash_1.default.pick(args, ["symbol", "provider"]))];
                    case 1:
                        price = _a.sent();
                        if (!(args.shouldVerifySignature && price !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.assertValidSignature(price)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, price];
                    case 4:
                        if (!(args.symbol === "AR")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.tryToGetPriceFromGQL(lodash_1.default.pick(args, ["provider", "symbol"]))];
                    case 5:
                        price = _a.sent();
                        if (price !== undefined) {
                            return [2 /*return*/, price];
                        }
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.getPricesFromArweave(args.provider)];
                    case 7:
                        prices = _a.sent();
                        priceForSymbol = prices[args.symbol];
                        return [2 /*return*/, priceForSymbol];
                }
            });
        });
    };
    // private async getLatestPriceForManySymbols(args: {
    //   symbols: string[],
    //   provider: string,
    //   shouldVerifySignature: boolean,
    // }): Promise<{ [token: string]: PriceData }> {
    // }
    LimestoneApi.prototype.getPriceForManyTokens = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var pricesObj, _i, _a, symbol, allPrices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.useCache) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cacheProxy.getPriceForManyTokens(lodash_1.default.pick(args, ["symbols", "provider", "timestamp"]))];
                    case 1:
                        pricesObj = _b.sent();
                        // Signature verification
                        if (args.shouldVerifySignature) {
                            for (_i = 0, _a = lodash_1.default.keys(pricesObj); _i < _a.length; _i++) {
                                symbol = _a[_i];
                                this.assertValidSignature(pricesObj[symbol]);
                            }
                        }
                        return [2 /*return*/, pricesObj];
                    case 2:
                        if (args.timestamp !== undefined) {
                            throw new Error("Getting historical prices from arweave is not supported");
                        }
                        return [4 /*yield*/, this.getPricesFromArweave(args.provider)];
                    case 3:
                        allPrices = _b.sent();
                        return [2 /*return*/, lodash_1.default.pick(allPrices, args.symbols)];
                }
            });
        });
    };
    LimestoneApi.prototype.getPricesFromArweave = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var address, gqlResponse, prices, pricesObj, _i, prices_1, price;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.arweaveProxy.getProviderDetails(provider)];
                    case 1:
                        address = (_a.sent()).address;
                        return [4 /*yield*/, this.arweaveProxy.findPricesInGraphQL({
                                type: "data",
                                providerAddress: address,
                                version: this.version,
                            })];
                    case 2:
                        gqlResponse = _a.sent();
                        if (gqlResponse === undefined) {
                            return [2 /*return*/, {}];
                        }
                        return [4 /*yield*/, this.arweaveProxy.getTxDataById(gqlResponse.permawebTx, { parseJSON: true })];
                    case 3:
                        prices = _a.sent();
                        pricesObj = {};
                        for (_i = 0, prices_1 = prices; _i < prices_1.length; _i++) {
                            price = prices_1[_i];
                            pricesObj[price.symbol] = __assign(__assign({}, price), { provider: address, permawebTx: gqlResponse.permawebTx });
                        }
                        return [2 /*return*/, pricesObj];
                }
            });
        });
    };
    LimestoneApi.prototype.getHistoricalPriceForOneSymbol = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var price;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.useCache) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.cacheProxy.getPrice(lodash_1.default.pick(args, ["symbol", "provider", "timestamp"]))];
                    case 1:
                        price = _a.sent();
                        if (!(args.shouldVerifySignature && price !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.assertValidSignature(price)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, price];
                    case 4: 
                    // TODO: we cannot query ArGQL with timestamp camparators like timestamp_gt
                    // But in future we can think of querying based on block numbers
                    throw new Error("Fetching historical price from arweave is not supported");
                }
            });
        });
    };
    LimestoneApi.prototype.tryToGetPriceFromGQL = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var address, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.arweaveProxy.getProviderDetails(args.provider)];
                    case 1:
                        address = (_a.sent()).address;
                        return [4 /*yield*/, this.arweaveProxy.findPricesInGraphQL({
                                type: "data",
                                providerAddress: address,
                                version: this.version,
                            })];
                    case 2:
                        response = _a.sent();
                        if (response === undefined || response.tags[args.symbol] === undefined) {
                            return [2 /*return*/, undefined];
                        }
                        else {
                            return [2 /*return*/, {
                                    symbol: args.symbol,
                                    value: Number(response.tags[args.symbol]),
                                    permawebTx: response.permawebTx,
                                    timestamp: Number(response.tags.timestamp),
                                    provider: address,
                                    version: response.tags.version,
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LimestoneApi.prototype.getHistoricalPricesInIntervalForOneSymbol = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var prices, _i, prices_2, price;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.useCache) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.cacheProxy.getManyPrices(lodash_1.default.pick(args, [
                                "symbol",
                                "provider",
                                "fromTimestamp",
                                "toTimestamp",
                                "interval",
                            ]))];
                    case 1:
                        prices = _a.sent();
                        if (!args.shouldVerifySignature) return [3 /*break*/, 5];
                        _i = 0, prices_2 = prices;
                        _a.label = 2;
                    case 2:
                        if (!(_i < prices_2.length)) return [3 /*break*/, 5];
                        price = prices_2[_i];
                        return [4 /*yield*/, this.assertValidSignature(price)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, prices];
                    case 6: 
                    // TODO: we cannot query ArGQL with timestamp camparators like timestamp_gt
                    // But in future we can think of querying based on block numbers
                    throw new Error("Fetching historical prices from arweave is not supported");
                }
            });
        });
    };
    LimestoneApi.prototype.assertValidSignature = function (price) {
        return __awaiter(this, void 0, void 0, function () {
            var signedData, publicKey, validSignature, addressFromPublicKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        signedData = JSON.stringify(lodash_1.default.pick(price, [
                            "id",
                            "source",
                            "symbol",
                            "timestamp",
                            "version",
                            "value",
                            "permawebTx",
                            "provider",
                        ]));
                        publicKey = String(price.providerPublicKey);
                        return [4 /*yield*/, this.arweaveProxy.verifySignature({
                                signedData: signedData,
                                signature: price.signature,
                                signerPublicKey: publicKey,
                            })];
                    case 1:
                        validSignature = _a.sent();
                        return [4 /*yield*/, this.arweaveProxy.arweaveClient.wallets.ownerToAddress(publicKey)];
                    case 2:
                        addressFromPublicKey = _a.sent();
                        if (!validSignature) {
                            throw new Error("Signature verification failed for price: " + signedData);
                        }
                        if (addressFromPublicKey !== price.provider) {
                            throw new Error("Provider address doesn't match the public key." +
                                (" Address: " + price.provider + ".") +
                                (" Public key: " + publicKey + "."));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return LimestoneApi;
}());
exports.default = LimestoneApi;
