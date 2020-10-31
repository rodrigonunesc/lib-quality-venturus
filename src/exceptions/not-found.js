class NotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'NotFound';
    this.message = msg || 'Not Found';
    this.status = 404;
    this.stack = new Error().stack;
  }
}

module.exports = NotFoundError;
