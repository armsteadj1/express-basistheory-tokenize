# NodeJs Middleware for Tokenizing request/response data

This middleware helpw when you're looking to secure, encrypt, tokenize, or otherwise not lose data you consider senstiive. By including one middleware, express will automatically tokenize (secure your data with BasisTheory) the properties you tell it to. Finally, the middleware will also handle turning the value back into the raw value automatically as well responding with a token.

## Installation

Using [Node Package Manager](https://docs.npmjs.com/)

```sh
npm install --save express-basistheory-tokenize
```

Using [Yarn](https://classic.yarnpkg.com/en/docs/)

```sh
yarn add express-basistheory-tokenize
```

## Documentation

## Usage

### Get a Basis Theory API Key

1. Head over to [Basis Theory](https://basistheory.com) to create an account
2. Create a new `server-to-server` Appliation with the following permissions: `token:general:create` and `token:general:read`.
 [or click here to pre-fill the Application form](https://portal.basistheory.com/applications/create?name=Express+Middleware&permissions=token%3Ageneral%3Acreate&permissions=token%3Ageneral%3Aread%3Ahigh)
3. Copy the API Key you create and use it below

### Set Basis Theory API Key

You can either set your API Key with an environment variable called `BT-API-KEY` or you can pass `apiKey` directly into the middleware. The `apiKey` passed into the middleware will take presidence over the ENV value.

### Example of protecting your data

In this example, we use both the `tokenize` and `detokenize` middleware to secure your data on way into your request and then detokenize the response for values you want to be able to display back to your customer. For example, you want to encrypt an `emailAddress` and then be able to display it back to the user.

[Full code can be found here.](https://github.com/armsteadj1/example-express-basistheory-tokenize)

```javascript
import { tokenize, detokenize } from "express-basistheory-tokenize";

const app = express();

app.use(express.json());

// configure which dangerous values to tokenize before calling request code
app.use(
  tokenize({
    tokenize: {
     "apiKey": "<PUT KEY HERE>", 
      "/": ["encrypt_this_value", "keep_this_safe"], // this will tokenize the property encrypt_this_value on the path '/'
    },
  })
);

// configure which token values to detokenize before responding
app.use(
  detokenize({
    detokenize: {
      "apiKey": "<PUT KEY HERE>",
      "/": ["encrypt_this_value"], // this will tokenize the property encrypt_this_value on the path '/'
    },
  })
);

app.post("/", function (req, res) {
  res.send(req.body);
});

app.listen(3000);
```

Test it out!
```sh
curl --location --request POST 'http://localhost:3000' \
--header 'Content-Type: application/json' \
--data-raw '{
    "encrypt_this_value": "dangerous data",
    "dont_encrypt": "not dangerous",
    "encrypt_this_value": "data from customer"
}'
```

Response:
```sh
{ 
    "dont_encrypt":"not dangerous",
    "encrypt_this_value":"data from customer",
    "keep_this_safe":"9f3c21c9-3ebe-4bb3-9665-a6e1d9d8a8a8"
}
```

🎉 - You can now save the `encrypt_this_value` and `keep_this_safe` to your database without worrying about storying the actual dangerous data and can call Basis Theory you need to use it! Check out more about how you can use the data on [Basis Theory's documentation](https://developers.basistheory.com).


### Test

Run the following command from the root of the project:

```sh
yarn test
```
