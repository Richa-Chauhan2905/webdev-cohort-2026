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
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const app_1 = require("./app");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const app = (0, app_1.createApplication)();
            const server = (0, node_http_1.createServer)(app);
            const PORT = 8080;
            server.listen(PORT, () => {
                console.log(`HTTP server running on ${PORT}`);
            });
        }
        catch (error) {
            console.log("Error starting HTTP server");
        }
    });
}
main();
