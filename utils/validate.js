const checkLength = (text) => {
  let check;

  if (text.length < 2) {
    check = 'too short';
  } else if (text.length > 30) {
    check = 'too long';
  }
  return check;
};

module.exports = checkLength;
