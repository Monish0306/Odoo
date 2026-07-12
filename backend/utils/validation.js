function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function isValidDateString(value) {
  if (!isNonEmptyString(value)) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function isValidNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value);
}

function isValidEnum(value, allowedValues) {
  return isNonEmptyString(value) && allowedValues.includes(value);
}

module.exports = {
  isNonEmptyString,
  isValidDateString,
  isValidNumber,
  isValidEnum,
};
