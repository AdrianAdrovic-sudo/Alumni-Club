import app from "./app";
import { ENV } from "./config/env";

app.listen(ENV.PORT, () => {
  console.log(`Backend up at http://localhost:${ENV.PORT}`);
});
