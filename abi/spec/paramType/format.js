import ParamType from './';

export function toParamType (type, indexed) {
  if (type[type.length - 1] === ']') {
    const last = type.lastIndexOf('[');
    const length = type.substr(last + 1, type.length - last - 2);
    const subtype = toParamType(type.substr(0, last));

    if (length.length === 0) {
      return new ParamType('array', subtype, 0, indexed);
    }

    return new ParamType('fixedArray', subtype, parseInt(length, 10), indexed);
  }

  switch (type) {
    case 'address':
    case 'bool':
    case 'bytes':
    case 'string':
      return new ParamType(type, null, 0, indexed);

    case 'int':
    case 'uint':
      return new ParamType(type, null, 256, indexed);

    default:
      if (type.indexOf('uint') === 0) {
        return new ParamType('uint', null, parseInt(type.substr(4), 10), indexed);
      } else if (type.indexOf('int') === 0) {
        return new ParamType('int', null, parseInt(type.substr(3), 10), indexed);
      } else if (type.indexOf('bytes') === 0) {
        return new ParamType('fixedBytes', null, parseInt(type.substr(5), 10), indexed);
      }

      throw new Error(`Cannot convert ${type} to valid ParamType`);
  }
}

export function fromParamType (paramType) {
  switch (paramType.type) {
    case 'address':
    case 'bool':
    case 'bytes':
    case 'string':
      return paramType.type;

    case 'int':
    case 'uint':
      return `${paramType.type}${paramType.length}`;

    case 'fixedBytes':
      return `bytes${paramType.length}`;

    case 'fixedArray':
      return `${fromParamType(paramType.subtype)}[${paramType.length}]`;

    case 'array':
      return `${fromParamType(paramType.subtype)}[]`;

    default:
      throw new Error(`Cannot convert from ParamType ${paramType.type}`);
  }
}
