const detokenize = require("./detokenize");

jest.mock("@basis-theory/basis-theory-js", () => {
  return {
    BasisTheory: jest.fn().mockImplementation(() => {
      return {
        init: () =>
          Promise.resolve({
            tokens: {
              retrieve: jest.fn(() => Promise.resolve({ data: "value" })),
            },
          }),
      };
    }),
  };
});

describe("Detokenize middleware", () => {
  let mockRequest, mockResponse, nextFunction;
  const options = {
    apiKey: "test_key",
    detokenize: {
      "/": ["the_number", "dope"],
    },
  };
  const middleware = detokenize(options);

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      req: {
        path: "/users",
        body: {},
      },
    };
    nextFunction = jest.fn();
  });

  test("doesnt error with nothing passed in", (done) => {
    middleware(mockRequest, mockResponse, done);
  });

  test("doesnt change response when path doesnt match", (done) => {
    const ogBody = { the_number: "ebf8790d-ca22-4a77-af97-d86d205912a9" };
    mockResponse.req = {
      body: ogBody,
    };

    const next = () => {
      expect(mockResponse.req.body).toEqual(ogBody);
      done();
    };

    middleware(mockRequest, mockResponse, next);
  });

  test("doesnt change response when keys dont match and path matches", (done) => {
    const ogBody = { no_matchy: "foo" };
    mockRequest.path = "/";
    mockResponse.req = {
      body: ogBody,
    };

    const next = () => {
      expect(mockResponse.body).toEqual(ogBody);
      done();
    };

    middleware(mockRequest, mockResponse, next);
  });

  test("detokenizes matching keys when path matches", (done) => {
    const ogBody = { the_number: "foo", no_matchy: "foo" };
    const expectedBody = { ...ogBody, the_number: "value" };
    mockResponse.req = {
      path: "/",
      body: ogBody,
    };

    const next = () => {
      expect(mockResponse.body).toEqual(expectedBody);
      done();
    };

    middleware(mockRequest, mockResponse, next);
  });
});
