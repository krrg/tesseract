'use strict'

const assert = require('assert');
const Tesseract = require('../lib/Tesseract');


describe("Promises/A+ Tests", function () {
    require("promises-aplus-tests").mocha({
      resolved(value) {
        return new Tesseract().resolve(value);
      },

      rejected(reason) {
        return new Tesseract().reject(reason);
      },

      deferred() {
        let T = new Tesseract();
        return {
          promise: T,
          resolve(value) {
            return T.resolve(value);
          },
          reject(reason) {
            return T.reject(value);
          }
        }
      }

    });
});

/* https://promisesaplus.com/ */
describe("Promises/A+", function() {

  describe(".then()", function() {

    describe("2.2.1 -- optional arguments", function () {

      it("if `onFulfilled` is not a function, it must be ignored", function () {
        let T = new Tesseract();
        T.then(undefined);
        T.then(null);
        T.then(494);
        T.then([]);
        T.then(T);
        T.then({});

        // No exception
        T.resolve();
      });

      it("if `onRejected` is not a function, it must be ignored", function () {
        let T = new Tesseract();
        T.then(function(){}, undefined);
        T.then(function(){}, null);
        T.then(function(){}, 494);
        T.then(function(){}, []);
        T.then(function(){}, T);
        T.then(function(){}, {});

        // No exception
        T.reject();
      });

      it("rejected handlers", function (done) {
        let T = new Tesseract().reject('this is a rejection reasons');

        T.then((val) => {
          console.log("here is a val: " + val)
        }, (err) => {
          console.log("Here is an error." + err);
          done();
        })

        T.then((val) => {
          console.log("here is another val: " + val);
        })

        T.reject('TREJCTED');

      })

    })

    describe("2.2.2. -- if `onFulfilled` is a function", function() {

      it("it must be called after the promise is resolved, with the value as first argument", function(done) {
        let T = new Tesseract();
        T.then(function(val){
          assert(val === 'a value goes here');
          done();
        });
        T.resolve('a value goes here');
      })

    });

  })

})
