const express = require('express');

express.response.error = function(error) {
    if (!error.code) {
        error = {
            message: error.toString(),
            code: 'server_error',
            status: 500
        };
    }

    this.status(error.status).json(error);

    // TODO: log erorr + 'res.locals.trace'
};

module.exports = {
    notMoney:{
        message: 'Sorry, you ran out of funds on your account',
        code: 'Not_money',
        status: 400
    },
    alreadyPay:{
        message: 'This domain already pay',
        code: 'Already_pay',
        status: 400
    },
    invalidDomainOrIP:{
        message: 'Domain or ip already exist',
        code: 'Invalid_domain_or_IP',
        status: 400
    },
    errorGetDomainr:{
        message: 'No access to the site resource domainr.com',
        code: 'not_access_to_the_site',
        status: 400
    },
    errorDomain:{
        message: 'Domain is not specified correctly',
        code: 'invalid_domain',
        status: 400
    },
    invalidPassword:{
        message: 'invalidPassword',
        code: 'invalid_password',
        status: 400
    },
    invalidId: {
        message: 'Invalid id',
        code: 'invalid_id',
        status: 400
    },
    notFound: {
        message: 'Entity not found',
        code: 'entity_not_found',
        status: 404
    },
    wrongCredentials: {
        message: 'Email or password are wrong',
        code: 'wrong_credentials',
        status: 404
    },
    accessDenied: {
        message: 'Access denied',
        code: 'access_denied',
        status: 403
    },
   errorData: {
        message: 'Error_data',
        code: 'access_denied',
        status: 403
    }
};