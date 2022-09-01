const fsPromises = require("fs/promises");
const path = require("path");

module.exports = async (data) => {
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "tasks.json"),
    JSON.stringify(data)
  );
};
