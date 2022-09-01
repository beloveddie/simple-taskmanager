const exists = (id, database) => {
  if (!id || !database.find((task) => task.id === id)) {
    return true;
  } else {
    return false;
  }
};

module.exports = { exists };
