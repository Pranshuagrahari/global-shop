import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions/v2";

admin.initializeApp();

// Set global options for v2 functions
setGlobalOptions({ maxInstances: 10, region: "us-central1" });

// Export v1 functions
export * as v1 from "./v1";
