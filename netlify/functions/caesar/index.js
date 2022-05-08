const { EleventyServerless } = require("@11ty/eleventy");
const { validateQueryParams, throwIf } = require("../../../11ty/utils.js");
require("./eleventy-bundler-modules.js");

const queryParamConfig = {
  message: {
    validate: (value) => {
      throwIf(!value, "message is required.");
    },
  },
  alphabet: {
    validate: (value) => {
      throwIf(!value, "alphabet is required.");
    },
  },
  shift: {
    validate: (value) => {
      throwIf(typeof value === 'undefined', "shift is required.");
      throwIf(!Number.isInteger(+value), "shift must be an integer.");
    },
  },
  operation: {
    validate: (value) => {
      throwIf(!value, "operation is required.");
      throwIf(
        !["encipher", "decipher"].includes(value),
        `${value} is not a valid operation.`
      );
    },
  },
};

async function handler(event) {
  const query = event.queryStringParameters;

  let elev = new EleventyServerless("caesar", {
    path: new URL(event.rawUrl).pathname,
    query,
    functionsDir: "./netlify/functions/",
  });

  try {
    let [page] = await elev.getOutput();
    validateQueryParams(query, queryParamConfig);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
      },
      body: page.content,
    };
  } catch (error) {
    // Only console log for matching serverless paths
    // (otherwise you’ll see a bunch of BrowserSync 404s for non-dynamic URLs during --serve)
    if (elev.isServerlessUrl(event.path)) {
      console.log("Serverless Error:", error);
    }

    return {
      statusCode: error.httpStatusCode || 500,
      body: JSON.stringify(
        {
          error: error.message,
        },
        null,
        2
      ),
    };
  }
}

exports.handler = handler;
