'use strict';
const Sequelize = require('sequelize');
const assert = require("assert");
const sinon = require('sinon');
var should = require('should');
const config = require('../../config');
const dbcontext = require('../../context/db')(Sequelize, config);
const errors = require('../../utils/errors');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const Promise = require("bluebird");

var userRepository = dbcontext.user;
var domainRepository= dbcontext.domain;

var authService = require('../../services/auth')(userRepository, errors);
var domainService = require('../../services/domain')(domainRepository, userRepository, errors, config);

var sandbox;
beforeEach(function () {
    sandbox = sinon.sandbox.create();
});

afterEach(function () {
    sandbox.restore();
});

var userObj = {
    id: 1,
    login: "dimaXik010",
    password: "$2a$10$mUEos7XyLco39aGSbblEG.F0SH7rNqHapSPTiGooREq6sGKDE2Ac.",
    money: 20
};
var user={
    "login": "dimaXik010",
    "password":"12345Qaz" 
};
var user1={
    "login": "dimaXik",
    "password":"12345Qaz" 
}
var user2={
    "login": "",
    "password":"12345Qaz" 
}
var user3={
    "login": "dimaXik",
    "password":"" 
}
var user4={
    "login": "dimaXik010",
    "password":"12345Qaz2"
}
var domain={
    "id":1,
    "domain": "vkdima971.com",
	"ip":"127.127.127.128",
    "status": true
}
var domain1={
    "domain": "vk.com",
	"ip":"127.127.127.128"
}
var domain2={
    "domain": "vkcom",
	"ip":"127.127.127.129"
}

 describe('При регистрации должно ', () => {
     it('выбивать ошибку,если пользователь уже существует', () => {
         sandbox.stub(userRepository, 'findOne').returns(Promise.resolve(userObj));
         var promise = authService.register(user);
         return promise.catch(err=> err.should.be.eql(errors.wrongCredentials));
     });
     it('регистрировать пользователя', () => {
         sandbox.stub(userRepository, 'findOne').returns(Promise.resolve(null));
         sandbox.stub(userRepository, 'create').returns(Promise.resolve(userObj));
         var promise = authService.register(user1);
         return promise.then(data=> data.should.be.eql({success: true}));
     });
     it('выбивать ошибку,если введен не правильный логин', () => {
         sandbox.stub(userRepository, 'findOne').returns(Promise.resolve(null));
         var promise = authService.register(user2);
         return promise.catch(err=> err.should.be.eql(errors.errorData));
     });
     it('выбивать ошибку,если введен не правильный пароль', () => {
         sandbox.stub(userRepository, 'findOne').returns(Promise.resolve(null));
         var promise = authService.register(user3);
         return promise.catch(err=> err.should.be.eql(errors.errorData));
     });
 });
 describe('При авторизации должно ', () => {
     it('выбивать ошибку,если введен не правильный пароль', () => {
         sandbox.stub(userRepository, 'findOne').returns(Promise.resolve(userObj));
         var promise = authService.login(user4);
         return promise.catch(err=> err.should.be.eql(errors.invalidPassword));
     });
     it('возвращать токен', () => {
         sandbox.stub(userRepository, 'findOne').returns(Promise.resolve(userObj));
         var promise = authService.login(user);
         return promise.then(token=> token.should.be.eql(getToken(userObj)));
     });
 });
 describe('При регистрации домена должно ', () => {
    it('выбивать ошибку,если введен невалидный домен', () => {
         var promise = domainService.registr(domain2.domain, domain2.ip,userObj.id);
         return promise.catch(err=> err.should.be.eql(errors.errorDomain));
         });
    it('выбивать ошибку,если домен уже зарегестрирован', () => {
         sandbox.stub(domainRepository, 'findOne').returns(Promise.resolve(null));
         var promise = domainService.registr(domain1.domain, domain1.ip,userObj.id);
         return promise.catch(err=> err.should.be.eql(errors.invalidDomainOrIP));
        });
    it('возвращать success: true  если выполнено успешно', () => {
         sandbox.stub(domainRepository, 'findOne').returns(Promise.resolve(null));
         sandbox.stub(domainRepository, 'create').returns(Promise.resolve(domain));
         var promise = domainService.registr(domain.domain, domain.ip,userObj.id);
         return promise.then(data=> data.should.be.eql({success: true}));
        
        });
 });
 describe('При оплате домена должно ', () => {
    it('выбивать ошибку,если домен уже оплачен', () => {
        sandbox.stub(domainRepository, 'findById').returns(Promise.resolve({userId:1,statusPay:true}));
          var promise=domainService.pay(1,1);
          return promise.catch(err=> err.should.be.eql(errors.alreadyPay));
         });
    it('выбивать ошибку,если недостаточно средств', () => {
        sandbox.stub(userRepository, 'findById').returns(Promise.resolve({id:1,money:config.cost-1}));
        sandbox.stub(domainRepository, 'findById').returns(Promise.resolve({userId:1,statusPay:false}));
        var promise=domainService.pay(1,1);
          return promise.catch(err=> err.should.be.eql(errors.notMoney));
         });
    it('выбивать ошибку,если введен неверный id домена', () => {
         sandbox.stub(domainRepository, 'findById').returns(Promise.resolve(null));
          var promise=domainService.pay(2,1);
          return promise.catch(err=> err.should.be.eql(errors.errorDomain));
        });
 });
function getToken(user){
    return jwt.sign({ __user_id: user.id, __user_login: user.login}, 'pskpdm');
}                