import * as dotenv from "dotenv";
dotenv.config();

import server from "./server";

const Sentry = require("@sentry/node");
Sentry.init({
  dsn: "https://df7a4422de87491094a011dd972ee11b@sentry.io/1445170"
});

const port = process.env.PORT || 4200;

server.listen(port, (error: Error) => {
  if (error) {
    return console.log(error);
  }

  return console.log(`server is listening on ${port}`);
});
