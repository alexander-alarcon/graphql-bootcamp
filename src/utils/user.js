function getFirstname(fullName) {
  return fullName.split(' ')[0];
}

function isValidPassword(password) {
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  return passwordRegex.test(password);
}

export { getFirstname, isValidPassword };
