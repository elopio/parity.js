import BigNumber from 'bignumber.js';

import { isArray, isHex, isInstanceOf, isString } from '../util/types';
import { padLeft, toHex } from '../util/format';

export function inAddress (address) {
  // TODO: address validation if we have upper-lower addresses
  return inHex(address);
}

export function inAddresses (addresses) {
  return (addresses || []).map(inAddress);
}

export function inBlockNumber (blockNumber) {
  if (isString(blockNumber)) {
    switch (blockNumber) {
      case 'earliest':
      case 'latest':
      case 'pending':
        return blockNumber;

      default:
        return null;
    }
  }

  return inNumber16(blockNumber);
}

export function inData (data) {
  if (data && data.length && !isHex(data)) {
    data = data.split('').map((chr) => {
      return `0${chr.charCodeAt(0).toString(16)}`.slice(-2);
    }).join('');
  }

  return inHex(data);
}

export function inHash (hash) {
  return inHex(hash);
}

export function inTopics (_topics) {
  let topics = (_topics || [])
    .filter((topic) => topic === null || topic)
    .map((topic) => {
      if (topic === null) {
        return null;
      }

      if (Array.isArray(topic)) {
        return inTopics(topic);
      }

      return padLeft(topic, 32);
    });

  return topics;
}

export function inFilter (options) {
  if (options) {
    Object.keys(options).forEach((key) => {
      switch (key) {
        case 'address':
          if (isArray(options[key])) {
            options[key] = options[key].map(inAddress);
          } else {
            options[key] = inAddress(options[key]);
          }
          break;

        case 'fromBlock':
        case 'toBlock':
          options[key] = inBlockNumber(options[key]);
          break;

        case 'limit':
          options[key] = inNumber10(options[key]);
          break;

        case 'topics':
          options[key] = inTopics(options[key]);
          break;

        default:
          break;
      }
    });
  }

  return options;
}

export function inHex (str) {
  return toHex(str);
}

export function inNumber10 (number) {
  if (isInstanceOf(number, BigNumber)) {
    return number.toNumber();
  }

  return (new BigNumber(number || 0)).toNumber();
}

export function inNumber16 (number) {
  const bn = isInstanceOf(number, BigNumber)
    ? number
    : (new BigNumber(number || 0));

  if (!bn.isInteger()) {
    throw new Error(`[format/input::inNumber16] the given number is not an integer: ${bn.toFormat()}`);
  }

  return inHex(bn.toString(16));
}

export function inOptionsCondition (condition) {
  if (condition) {
    if (condition.block) {
      condition.block = condition.block ? inNumber10(condition.block) : null;
    } else if (condition.time) {
      condition.time = inNumber10(Math.floor(condition.time.getTime() / 1000));
    }
  }

  return condition;
}

export function inOptions (_options = {}) {
  const options = { ..._options };

  Object.keys(options).forEach((key) => {
    switch (key) {
      case 'to':
        // Don't encode the `to` option if it's empty
        // (eg. contract deployments)
        if (options[key]) {
          options.to = inAddress(options[key]);
        }
        break;

      case 'from':
        options[key] = inAddress(options[key]);
        break;

      case 'condition':
        options[key] = inOptionsCondition(options[key]);
        break;

      case 'gas':
      case 'gasPrice':
        options[key] = inNumber16((new BigNumber(options[key])).round());
        break;

      case 'value':
      case 'nonce':
        options[key] = inNumber16(options[key]);
        break;

      case 'data':
        options[key] = inData(options[key]);
        break;

      default:
        break;
    }
  });

  return options;
}

export function inTraceFilter (filterObject) {
  if (filterObject) {
    Object.keys(filterObject).forEach((key) => {
      switch (key) {
        case 'fromAddress':
        case 'toAddress':
          filterObject[key] = [].concat(filterObject[key])
            .map(address => inAddress(address));
          break;

        case 'toBlock':
        case 'fromBlock':
          filterObject[key] = inBlockNumber(filterObject[key]);
          break;

        default:
          break;
      }
    });
  }

  return filterObject;
}

export function inTraceType (whatTrace) {
  if (isString(whatTrace)) {
    return [whatTrace];
  }

  return whatTrace;
}

function inDeriveType (derive) {
  return derive && derive.type === 'hard' ? 'hard' : 'soft';
}

export function inDeriveHash (derive) {
  const hash = derive && derive.hash ? derive.hash : derive;
  const type = inDeriveType(derive);

  return {
    hash: inHex(hash),
    type
  };
}

export function inDeriveIndex (derive) {
  if (!derive) {
    return [];
  }

  if (!isArray(derive)) {
    derive = [derive];
  }

  return derive.map(item => {
    const index = inNumber10(item && item.index ? item.index : item);

    return {
      index,
      type: inDeriveType(item)
    };
  });
}
