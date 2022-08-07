"use strict";

const apiResponse = {
  sendBadRequest: (res, badRequestParams) => {
    let httpStatusCode = 400;
    badRequestParams = badRequestParams || {};
    badRequestParams.statusMessage = badRequestParams.statusMessage || "Bad request";
    res.status(httpStatusCode).send({
      status: "error",
      statusCode: 1,
      statusMessage: badRequestParams.statusMessage,
    });
  },

  sendForbiddenRequest: (res, forbiddenParams) => {
    let httpStatusCode = 403;
    forbiddenParams = forbiddenParams || {};
    forbiddenParams.statusMessage = forbiddenParams.statusMessage || "Forbiden";
    res.status(httpStatusCode).send({
      status: "error",
      statusCode: 1,
      statusMessage: forbiddenParams.statusMessage,
    });
  },

  sendUnauthorizeRequest: (res, unauthorizeParams) => {
    let httpStatusCode = 401;
    unauthorizeParams = unauthorizeParams || {};
    unauthorizeParams.statusMessage = unauthorizeParams.statusMessage || "Unauthorization";
    res.status(httpStatusCode).send({
      status: "error",
      statusCode: 1,
      isSuccessful: false,
      statusMessage: unauthorizeParams.statusMessage,
    });
  },

  sendNotFound: (res, notFoundParams) => {
    let httpStatusCode = 404;
    notFoundParams = notFoundParams || {};
    notFoundParams.statusMessage = notFoundParams.statusMessage || "Not Found";
    res.status(httpStatusCode).send({
      status: "error",
      statusCode: 1,
      isSuccessful: false,
      statusMessage: notFoundParams.statusMessage,
    });
  },

  sendInternalError: (res, internalErrorParams) => {
    let httpStatusCode = 500;
    internalErrorParams = internalErrorParams || {};
    internalErrorParams.statusMessage = internalErrorParams.statusMessage || "Internal Error";
    internalErrorParams.error = internalErrorParams.error || new Error(internalErrorParams.statusMessage);
    //log internal error
    console.log("Internal error: ", internalErrorParams);
    res.status(httpStatusCode).send({
      status: "error",
      statusCode: 1,
      statusMessage: internalErrorParams.statusMessage,
    });
  },

  send: (res, successParams) => {
    let httpStatusCode = 200;
    successParams = successParams || {};
    successParams.statusMessage = successParams.statusMessage || "Success";
    let response = {
      status: "ok",
      statusCode: 0,
      statusMessage: successParams.statusMessage,
    };
    if (successParams) {
      response.data = successParams;
    }
    if (successParams.data) {
      response.data = successParams.data;
    }
    if (successParams.meta) {
      response.data = successParams.meta;
    }
    res.status(httpStatusCode).send(response);
  },
};

module.exports = apiResponse;