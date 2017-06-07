'use strict';var _ethapi = require('../../../../test/e2e/ethapi');
var _types = require('../../../../test/types');

describe('ethapi.eth', function () {
  var ethapi = (0, _ethapi.createHttpApi)();
  var address = '0x63cf90d3f0410092fc0fca41846f596223979195';

  var latestBlockNumber = void 0;
  var latestBlockHash = void 0;

  describe('accounts', function () {
    it('returns the available accounts', function () {
      return ethapi.eth.accounts().then(function (accounts) {
        accounts.forEach(function (account) {
          expect((0, _types.isAddress)(account)).to.be.true;
        });
      });
    });
  });

  describe('blockNumber', function () {
    it('returns the current blockNumber', function () {
      return ethapi.eth.blockNumber().then(function (blockNumber) {
        latestBlockNumber = blockNumber;
        expect(blockNumber.gt(0xabcde)).to.be.true;
      });
    });
  });

  describe('coinbase', function () {
    it('returns the coinbase', function () {
      return ethapi.eth.coinbase().then(function (coinbase) {
        expect((0, _types.isAddress)(coinbase)).to.be.true;
      });
    });
  });

  describe('gasPrice', function () {
    it('returns the current gasPrice', function () {
      return ethapi.eth.gasPrice().then(function (gasPrice) {
        expect(gasPrice.gt(0)).to.be.true;
      });
    });
  });

  describe('getBalance', function () {
    it('returns the balance for latest block', function () {
      return ethapi.eth.getBalance(address).then(function (balance) {
        expect(balance.gt(0)).to.be.true;
      });
    });

    it('returns the balance for a very early block', function () {
      var atBlock = '0x65432';
      var atValue = '18e07120a6e164fee1b';

      return ethapi.eth.
      getBalance(address, atBlock).
      then(function (balance) {
        expect(balance.toString(16)).to.equal(atValue);
      }).
      catch(function (error) {
        // Parity doesn't support pruned-before-block balance lookups
        expect(error.message).to.match(/not supported/);
      });
    });

    it('returns the balance for a recent/out-of-pruning-range block', function () {
      return ethapi.eth.
      getBalance(address, latestBlockNumber.minus(1000)).
      then(function (balance) {
        expect(balance.gt(0)).to.be.true;
      });
    });
  });

  describe('getBlockByNumber', function () {
    it('returns the latest block', function () {
      return ethapi.eth.getBlockByNumber().then(function (block) {
        expect(block).to.be.ok;
      });
    });

    it('returns a block by blockNumber', function () {
      return ethapi.eth.getBlockByNumber(latestBlockNumber).then(function (block) {
        latestBlockHash = block.hash;
        expect(block).to.be.ok;
      });
    });

    it('returns a block by blockNumber (full)', function () {
      return ethapi.eth.getBlockByNumber(latestBlockNumber, true).then(function (block) {
        expect(block).to.be.ok;
      });
    });
  });

  describe('getBlockByHash', function () {
    it('returns the specified block', function () {
      return ethapi.eth.getBlockByHash(latestBlockHash).then(function (block) {
        expect(block).to.be.ok;
        expect(block.hash).to.equal(latestBlockHash);
      });
    });

    it('returns the specified block (full)', function () {
      return ethapi.eth.getBlockByHash(latestBlockHash, true).then(function (block) {
        expect(block).to.be.ok;
        expect(block.hash).to.equal(latestBlockHash);
      });
    });
  });

  describe('getBlockTransactionCountByHash', function () {
    it('returns the transactions of the specified hash', function () {
      return ethapi.eth.getBlockTransactionCountByHash(latestBlockHash).then(function (count) {
        expect(count).to.be.ok;
        expect(count.gte(0)).to.be.true;
      });
    });
  });

  describe('getBlockTransactionCountByNumber', function () {
    it('returns the transactions of latest', function () {
      return ethapi.eth.getBlockTransactionCountByNumber().then(function (count) {
        expect(count).to.be.ok;
        expect(count.gte(0)).to.be.true;
      });
    });

    it('returns the transactions of a specified number', function () {
      return ethapi.eth.getBlockTransactionCountByNumber(latestBlockNumber).then(function (count) {
        expect(count).to.be.ok;
        expect(count.gte(0)).to.be.true;
      });
    });
  });

  describe('getTransactionCount', function () {
    it('returns the count for an address', function () {
      return ethapi.eth.getTransactionCount(address).then(function (count) {
        expect(count).to.be.ok;
        expect(count.gte(0x1000c2)).to.be.ok;
      });
    });

    it('returns the count for an address at specified blockNumber', function () {
      return ethapi.eth.getTransactionCount(address, latestBlockNumber).then(function (count) {
        expect(count).to.be.ok;
        expect(count.gte(0x1000c2)).to.be.ok;
      });
    });
  });
});