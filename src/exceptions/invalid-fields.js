module.exports = class InvalidFields extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidFields';
    this.message = message || 'Invalid Fields';
    this.status = 400;
    this.stack = (new Error()).stack;
  }
};
