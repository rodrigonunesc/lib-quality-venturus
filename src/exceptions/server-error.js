class ServerError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'InternalError';
    this.message = msg || 'Internal Server Error';
    this.status = 500;
    this.stack = new Error().stack;
  }
}

module.exports = ServerError;
