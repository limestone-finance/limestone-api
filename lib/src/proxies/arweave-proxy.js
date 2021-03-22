"use strict";
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
var node_1 = __importDefault(require("arweave/node"));
var ar_gql_1 = require("ar-gql");
// TODO: revert LAST_BLOCKS_TO_CHECK to 50
var LAST_BLOCKS_TO_CHECK = 5000;
var ArweaveProxy = /** @class */ (function () {
    function ArweaveProxy() {
        this.arweaveClient = node_1.default.init({
            host: "arweave.net",
            port: 443,
            protocol: "https",
        });
    }
    ArweaveProxy.prototype.findPricesInGraphQL = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var networkInfo, minBlock, query, res, node, tags, _i, _a, _b, name_1, value;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.arweaveClient.network.getInfo()];
                    case 1:
                        networkInfo = _c.sent();
                        minBlock = networkInfo.height - LAST_BLOCKS_TO_CHECK;
                        query = "\n        {\n          transactions(\n            tags: [\n              { name: \"app\", values: \"Limestone\" }\n              { name: \"type\", values: \"" + parameters.type + "\" }\n              { name: \"version\", values: \"" + parameters.version + "\" }\n            ]\n            block: { min: " + minBlock + " }\n            owners: [\"" + parameters.providerAddress + "\"]\n            first: 1\n          ) {\n            edges {\n              node {\n                tags {\n                  name\n                  value\n                }\n                id\n              }\n            }\n          }\n        }";
                        return [4 /*yield*/, ar_gql_1.run(query)];
                    case 2:
                        res = (_c.sent()).data.transactions.edges;
                        if (res.length > 0) {
                            node = res[0].node;
                            tags = {};
                            for (_i = 0, _a = node.tags; _i < _a.length; _i++) {
                                _b = _a[_i], name_1 = _b.name, value = _b.value;
                                tags[name_1] = value;
                            }
                            return [2 /*return*/, {
                                    permawebTx: node.id,
                                    tags: tags,
                                }];
                        }
                        else {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ArweaveProxy.prototype.getTxDataById = function (txId, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var data, strData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.arweaveClient.transactions.getData(txId, {
                            decode: true,
                        })];
                    case 1:
                        data = _a.sent();
                        strData = node_1.default.utils.bufferToString(Buffer.from(data));
                        if (opts !== undefined && opts.parseJSON) {
                            return [2 /*return*/, JSON.parse(strData)];
                        }
                        else {
                            return [2 /*return*/, strData];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ArweaveProxy.prototype.getProviderDetails = function (providerName) {
        return __awaiter(this, void 0, void 0, function () {
            var mapping;
            return __generator(this, function (_a) {
                mapping = {
                    limestone: {
                        address: "I-5rWUehEv-MjdK9gFw09RxfSLQX9DIHxG614Wf8qo0",
                        publicKey: "xyTvKiCST8bAT6sxrgkLh8UCX2N1eKvawODuxwq4qOHIdDAZFU_3N2m59rkZ0E7m77GsJuf1I8u0oEJEbxAdT7uD2JTwoYEHauXSxyJYvF0RCcZOhl5P1PJwImd44SJYa_9My7L84D5KXB9SKs8_VThe7ZyOb5HSGLNvMIK6A8IJ4Hr_tg9GYm65CRmtcu18S9mhun8vgw2wi7Gw6oR6mc4vU1I-hrU66Fi7YlXwFieP6YSy01JqoLPhU84EunPQzXPouVSbXjgRU5kFVxtdRy4GK2fzEBFYsQwCQgFrySCrFKHV8AInu9jerfof_DxNKiXkBzlB8nc22CrYnvvio_BWyh-gN0hQHZT0gwMR-A7sbXNCQJfReaIZzX_jP6XoB82PnpzmL_j1mJ2lnv2Rn001flBAx9AYxtGXd9s07pA-FggTbEG3Y2UnlWW6l3EJ93E0IfxL0PqGEUlp217mxUHvmTw9fkGDWa8rT9RPmsTyji-kMFSefclw80cBm_iOsIEutGP4S3LDbP-ZVJWDeJOBQQpSgwbisl8qbjl2sMQLQihoG2TQyNbmLwfyq-XSULkXjUi1_6BH36wnDBLWBKF-bS2bLKcGtn3Vjet72lNHxJJilcj8vpauwJG0078S_lO5uGt6oicdGR6eh_NSn6_8za_tXg0G_fohz4Yb1z8",
                    },
                };
                if (mapping[providerName] === undefined) {
                    throw new Error("Provider details not found: " + providerName);
                }
                else {
                    return [2 /*return*/, mapping[providerName]];
                }
                return [2 /*return*/];
            });
        });
    };
    ArweaveProxy.prototype.verifySignature = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var signedBytes, signatureBytes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        signedBytes = new TextEncoder().encode(args.signedData);
                        signatureBytes = Uint8Array.from(Buffer.from(args.signature, "base64"));
                        return [4 /*yield*/, this.arweaveClient.crypto.verify(args.signerPublicKey, signedBytes, signatureBytes)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ArweaveProxy;
}());
exports.default = ArweaveProxy;
