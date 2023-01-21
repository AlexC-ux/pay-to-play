const session = require("express-session");
const RedisStore = require("connect-redis")(session);

import nextSession from "next-session";
import { promisifyStore } from "next-session/lib/compat";

import Redis from "ioredis";

export const getSession = nextSession({
  store: promisifyStore(
    new RedisStore({
      client: new Redis(6379, "localhost"),
    })
  ),
});