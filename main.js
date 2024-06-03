const express = require("express");

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

console.log(process.env.PORT);
console.log(process.env.BASE_URL);
console.log(process.env.DATA_DIR);
