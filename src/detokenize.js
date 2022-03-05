const { BasisTheory } = require("@basis-theory/basis-theory-js");
const getApiKey = require("./getApiKey");

const detokenize = (options) => {
  let bt;
  new BasisTheory().init(getApiKey(options.apiKey)).then((value) => (bt = value));

  return (_req, res, next) => {
    const body = res.req.body;
    const path = res.req.path;
    if (!body || typeof body !== "object") {
      next();
      return;
    }

    const matchingKeys = []
      .concat(options.detokenize[path])
      .filter((item) => Object.keys(body).includes(item));

    const detoknizedBody = matchingKeys.reduce(
      (obj, key) => (
        (obj[key] = bt.tokens
          .retrieve(body[key])
          .then(({ data }) => (obj[key] = data))),
        obj
      ),
      body
    );

    Promise.all(Object.values(detoknizedBody)).then(() => {
      res.body = detoknizedBody;
      next();
    });
  };
};

module.exports = detokenize;
