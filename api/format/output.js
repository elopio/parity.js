'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};exports.





outAccountInfo = outAccountInfo;exports.



















outAddress = outAddress;exports.



outAddresses = outAddresses;exports.



outBlock = outBlock;exports.






























outChainStatus = outChainStatus;exports.


















outDate = outDate;exports.













outHistogram = outHistogram;exports.

















outLog = outLog;exports.




















outHwAccountInfo = outHwAccountInfo;exports.











outNodeKind = outNodeKind;exports.



outNumber = outNumber;exports.



outPeer = outPeer;exports.


















outPeers = outPeers;exports.








outReceipt = outReceipt;exports.























outRecentDapps = outRecentDapps;exports.









outSignerRequest = outSignerRequest;exports.






























outSyncing = outSyncing;exports.
























outTransactionCondition = outTransactionCondition;exports.











outTransaction = outTransaction;exports.































outSigningPayload = outSigningPayload;exports.
















outTrace = outTrace;exports.































































outTraces = outTraces;exports.







outTraceReplay = outTraceReplay;exports.
















outVaultMeta = outVaultMeta;var _bignumber = require('bignumber.js');var _bignumber2 = _interopRequireDefault(_bignumber);var _address2 = require('../../abi/util/address');var _types = require('../util/types');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function outAccountInfo(infos) {return Object.keys(infos).reduce(function (ret, _address) {var info = infos[_address];var address = outAddress(_address);ret[address] = { name: info.name };if (info.meta) {ret[address].uuid = info.uuid;ret[address].meta = JSON.parse(info.meta);}return ret;}, {});}function outAddress(address) {return (0, _address2.toChecksumAddress)(address);}function outAddresses(addresses) {return (addresses || []).map(outAddress);}function outBlock(block) {if (block) {Object.keys(block).forEach(function (key) {switch (key) {case 'author':case 'miner':block[key] = outAddress(block[key]);break;case 'difficulty':case 'gasLimit':case 'gasUsed':case 'nonce':case 'number':case 'totalDifficulty':block[key] = outNumber(block[key]);break;case 'timestamp':block[key] = outDate(block[key]);break;default:break;}});}return block;}function outChainStatus(status) {if (status) {Object.keys(status).forEach(function (key) {switch (key) {case 'blockGap':status[key] = status[key] ? status[key].map(outNumber) : status[key];break;default:break;}});}return status;}function outDate(date) {if (typeof date.toISOString === 'function') {return date;}try {if (typeof date === 'string' && new Date(date).toISOString() === date) {return new Date(date);}} catch (error) {}return new Date(outNumber(date).toNumber() * 1000);}function outHistogram(histogram) {if (histogram) {Object.keys(histogram).forEach(function (key) {switch (key) {case 'bucketBounds':case 'counts':histogram[key] = histogram[key].map(outNumber);break;default:break;}});}return histogram;}function outLog(log) {Object.keys(log).forEach(function (key) {switch (key) {case 'blockNumber':case 'logIndex':case 'transactionIndex':log[key] = outNumber(log[key]);break;case 'address':log[key] = outAddress(log[key]);break;default:break;}});return log;}function outHwAccountInfo(infos) {return Object.keys(infos).reduce(function (ret, _address) {var address = outAddress(_address);ret[address] = infos[_address];return ret;}, {});}function outNodeKind(info) {return info;}function outNumber(number) {return new _bignumber2.default(number || 0);}function outPeer(peer) {var protocols = Object.keys(peer.protocols).reduce(function (obj, key) {if (peer.protocols[key]) {obj[key] = _extends({}, peer.protocols[key], { difficulty: outNumber(peer.protocols[key].difficulty) });}return obj;}, {});return _extends({}, peer, { protocols: protocols });}function outPeers(peers) {return { active: outNumber(peers.active), connected: outNumber(peers.connected), max: outNumber(peers.max), peers: peers.peers.map(function (peer) {return outPeer(peer);}) };}function outReceipt(receipt) {if (receipt) {Object.keys(receipt).forEach(function (key) {switch (key) {case 'blockNumber':case 'cumulativeGasUsed':case 'gasUsed':case 'transactionIndex':receipt[key] = outNumber(receipt[key]);break;case 'contractAddress':receipt[key] = outAddress(receipt[key]);break;default:break;}});}return receipt;}function outRecentDapps(recentDapps) {if (recentDapps) {Object.keys(recentDapps).forEach(function (url) {recentDapps[url] = outDate(recentDapps[url]);});}return recentDapps;}function outSignerRequest(request) {if (request) {Object.keys(request).forEach(function (key) {switch (key) {case 'id':request[key] = outNumber(request[key]);break;case 'payload':request[key].decrypt = outSigningPayload(request[key].decrypt);request[key].sign = outSigningPayload(request[key].sign);request[key].signTransaction = outTransaction(request[key].signTransaction);request[key].sendTransaction = outTransaction(request[key].sendTransaction);break;case 'origin':var type = Object.keys(request[key])[0];var details = request[key][type];request[key] = { type: type, details: details };break;default:break;}});}return request;}function outSyncing(syncing) {if (syncing && syncing !== 'false') {Object.keys(syncing).forEach(function (key) {switch (key) {case 'currentBlock':case 'highestBlock':case 'startingBlock':case 'warpChunksAmount':case 'warpChunksProcessed':syncing[key] = outNumber(syncing[key]);break;case 'blockGap':syncing[key] = syncing[key] ? syncing[key].map(outNumber) : syncing[key];break;default:break;}});}return syncing;}function outTransactionCondition(condition) {if (condition) {if (condition.block) {condition.block = outNumber(condition.block);} else if (condition.time) {condition.time = outDate(condition.time);}}return condition;}function outTransaction(tx) {if (tx) {Object.keys(tx).forEach(function (key) {switch (key) {case 'blockNumber':case 'gasPrice':case 'gas':case 'nonce':case 'transactionIndex':case 'value':tx[key] = outNumber(tx[key]);break;case 'condition':tx[key] = outTransactionCondition(tx[key]);break;case 'creates':case 'from':case 'to':tx[key] = outAddress(tx[key]);break;default:break;}});}return tx;}function outSigningPayload(payload) {if (payload) {Object.keys(payload).forEach(function (key) {switch (key) {case 'address':payload[key] = outAddress(payload[key]);break;default:break;}});}return payload;}function outTrace(trace) {if (trace) {if (trace.action) {Object.keys(trace.action).forEach(function (key) {switch (key) {case 'gas':case 'value':case 'balance':trace.action[key] = outNumber(trace.action[key]);break;case 'from':case 'to':case 'address':case 'refundAddress':trace.action[key] = outAddress(trace.action[key]);break;default:break;}});}if (trace.result) {Object.keys(trace.result).forEach(function (key) {switch (key) {case 'gasUsed':trace.result[key] = outNumber(trace.result[key]);break;case 'address':trace.action[key] = outAddress(trace.action[key]);break;default:break;}});}if (trace.traceAddress) {trace.traceAddress.forEach(function (address, index) {trace.traceAddress[index] = outNumber(address);});}Object.keys(trace).forEach(function (key) {switch (key) {case 'subtraces':case 'transactionPosition':case 'blockNumber':trace[key] = outNumber(trace[key]);break;default:break;}});}return trace;}function outTraces(traces) {if (traces) {return traces.map(outTrace);}return traces;}function outTraceReplay(trace) {if (trace) {Object.keys(trace).forEach(function (key) {switch (key) {case 'trace':trace[key] = outTraces(trace[key]);break;default:break;}});}return trace;}function outVaultMeta(meta) {
  if ((0, _types.isString)(meta)) {
    try {
      var obj = JSON.parse(meta);

      return obj;
    } catch (error) {
      return {};
    }
  }

  return meta || {};
}