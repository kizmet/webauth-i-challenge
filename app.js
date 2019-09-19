const Knex = require("knex");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const express = require("express");
const parseurl = require("parseurl");
const bodyParser = require("body-parser");
const knexConfig = require("./knexfile");
const promiseRouter = require("express-promise-router");
//router APIs
const RestrictedRoutes = require("./api/restrictedRoutes");
const UnrestrictedRoutes = require("./api/unrestrictedRoutes");
//middleware
const Restricted = require("./auth/restricted"); //header based credentials
const RestrictedSession = require("./auth/restricted-session");
const { Model } = require("objection");

const knex = Knex(knexConfig.development);
const knexDb = Knex(knexConfig.development);
Model.knex(knex); //objection

const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const store = new KnexSessionStore({
  knex: knexDb,
  tablename: "knexsessions",
  sidfieldname: "sessionid",
  createtable: true,
  clearInterval: 1000 * 60 * 30
});

const sessionConfig = {
  name: "katmen",
  secret: process.env.SESSION_SECRET || "peanutbutter and bananas",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: true,
  store: store
};

const router = promiseRouter();
const restrictedRouter = promiseRouter();

const app = express();
app.use(cors());
app.use(session(sessionConfig));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.set("json spaces", 2);
app.use(helmet());

app.use("/api", router);
app.use("/api/restricted", restrictedRouter);

app.use((err, req, res, next) => {
  if (err) {
    res
      .status(err.statusCode || err.status || 500)
      .send(err.data || err.message || {});
  } else {
    next();
  }
});
UnrestrictedRoutes(router);
RestrictedRoutes(restrictedRouter);

// app.use("/api/unrestricted/", UnrestrictedRoutes);
// app.use("/api/restricted/", Restricted, RestrictedRoutes);
// app.use("/api/restrictedSession/", RestrictedSession, RestrictedRoutes);

const server = app.listen(8641, () => {
  console.log("Example app listening at port %s", server.address().port);
});
