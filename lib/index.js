"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var limestone_api_1 = __importDefault(require("./limestone-api"));
var apiClient = limestone_api_1.default.init();
exports.default = apiClient;
