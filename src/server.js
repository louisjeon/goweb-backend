// server.js
const app = require("./app");

const port = 4000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
