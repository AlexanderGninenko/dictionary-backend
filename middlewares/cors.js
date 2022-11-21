const options = {
  origin: [
    'https://alexandergninenko.nomoredomains.sbs',
    'https://api.alexandergninenko.nomoredomains.sbs',
    'http://localhost:3000',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = options;
