const { BasisTheory } = require('@basis-theory/basis-theory-js');

const tokenize = (options) => {
  let bt;
  new BasisTheory().init(options.apiKey).then((value) => (bt = value));

  return (req, _res, next) => {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      next();
      return;
    }

    const matchingKeys = [].concat(options.tokenize[req.path]).filter((item) => Object.keys(body).includes(item));
    const objectToTokenize = matchingKeys.reduce((obj, current) => ({ [current]: body[current], ...obj }), {});
    
    if(Object.keys(objectToTokenize).length === 0) {
      next();
      return;
    }

    bt.tokenize(objectToTokenize).then((tokenizedBody) => {
      req.body = { ...body, ...tokenizedBody };
      req.headers['content-length'] = JSON.stringify(req.body).length.toString();
      next();
    });
  };
};

module.exports = tokenize;