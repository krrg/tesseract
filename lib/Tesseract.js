'use strict'

const _ = require('lodash');

class Tesseract {

  constructor (value) {
    this.makeEmptyPromise();
    if (typeof(value) !== 'undefined') {
      this.resolve(value);
    }
  }

  makeEmptyPromise () {
    this.onFulfilled = [];
    this.onRejected = [];
    this.fulfilledValue = null;
    this.rejectedReason = null;
    this.state = 'pending'
  }

  isFulfilled () {
    return this.state === 'fulfilled';
  }

  isRejected () {
    return this.state === 'rejected';
  }

  isPending() {
    return this.state === 'pending';
  }

  callbackFulfilled () {
    let fulfilledValue = this.fulfilledValue;
    this.onFulfilled.forEach(function(fn) {
      _.defer(fn, fulfilledValue);
    });
    this.onFulfilled = [];
  }

  callbackRejected() {
    let rejectedReason = this.rejectedReason;
    this.onRejected.forEach(function(fn) {
      _.defer(fn, rejectedReason);
    });
    this.onRejected = [];
  }

  resolve (value) {
    if (! this.isPending()) {
      return;
    }

    this.state = 'fulfilled';
    this.fulfilledValue = value;
    this.callbackFulfilled();

    return this;
  }

  reject (reason) {
    if (! this.isPending()) {
      return;
    }

    this.state = 'rejected';
    this.rejectedReason = reason;
    this.callbackRejected();

    return this;
  }

  then (fnAccept, fnReject) {
    if (typeof(fnAccept) === 'function') {
      this.onFulfilled.push(fnAccept);

      if (this.isFulfilled()) {
        this.callbackFulfilled();
      }
    }

    if (typeof(fnReject) === 'function') {
      this.onRejected.push(fnReject);

      if (this.isRejected()) {
        this.callbackRejected();
      }
    }

    return this;
  }

}

module.exports = Tesseract;
