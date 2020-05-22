module.exports = async () => {
  if (global.__SERVER__.close) {
    global.__SERVER__.close();
  }
};
