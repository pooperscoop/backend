"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const server_1 = require("./server");
const port = process.env.PORT || 4200;
server_1.default.listen(port, (error) => {
    if (error) {
        return console.log(error);
    }
    return console.log(`server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map