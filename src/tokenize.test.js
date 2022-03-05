const tokenize = require('./tokenize');

jest.mock('@basis-theory/basis-theory-js', () => {
  return {
      BasisTheory: jest.fn().mockImplementation(() => {
          return {
              init: () => Promise.resolve({
                tokenize: jest.fn(() => Promise.resolve({"hi": "yo"}))
              })
          }   
      })
  }
});

describe('Authorization middleware', () => {
  let mockRequest, mockResponse, nextFunction;
  const options = {
    apiKey: "test_key", 
    tokenize: {
        "/": ["the_number", "dope"]
    }
  }
  const middleware = tokenize(options);

  beforeEach(() => {
      mockRequest = {};
      mockResponse = {
          json: jest.fn()
      };
      nextFunction = jest.fn();
  });

  test('doesnt error with nothing passed in', () => {
    middleware(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled()
  });

  test('doesnt change request when path doesnt match', () => {
    const ogBody = { "the_number": "foo" };
    mockRequest.path = "/users";
    mockRequest.body = ogBody;

    middleware(mockRequest, mockResponse, nextFunction);

    expect(mockRequest.body).toEqual(ogBody);
    expect(nextFunction).toHaveBeenCalled()
  });

  test('doesnt change request when keys dont match and path matches', () => {
    const ogBody = { "no_matchy": "foo" };
    mockRequest.path = "/";
    mockRequest.body = ogBody;

    middleware(mockRequest, mockResponse, nextFunction);

    expect(mockRequest.body).toEqual(ogBody);
    expect(nextFunction).toHaveBeenCalled()
  });

  test('tokenizes matching keys when path matches', (done) => {
    const ogBody = { "the_number": "foo", "no_matchy": "foo" };
    const expectedBody = { ...ogBody, "hi": "yo", };
    mockRequest.path = "/";
    mockRequest.body = ogBody;
    mockRequest.headers = {};

    const next = () => {
      expect(mockRequest.body).toEqual(expectedBody);
      expect(mockRequest.headers).toEqual({"content-length": "48"})
      done()
    }

    middleware(mockRequest, mockResponse, next);
  });

});
