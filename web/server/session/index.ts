import * as session from "express-session";
// import CassandraStore from "cassandra-store"; // use an external store in production
import { Router } from "express";

const router = Router();

router.use(
  session({
    // store: new CassandraStore(options),
    secret: process.env.JWT_KEYSTORE_PATH || "secret_to_be_set_with_environment_variables"
  })
);

export default router;
