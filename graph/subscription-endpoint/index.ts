import { Router } from "express";
import * as bodyParser from "body-parser";

import { NOTIFICATION } from "schema/subscriptions";
import pubsub from "schema/PubSub";

const router = Router();

router.use(bodyParser.json());

router.post("/notification", (req, res, next) => {
  pubsub.publish(NOTIFICATION, req.body);
  res.status(200).end();
});

export default router;
