import { CharacterStream } from './character-stream';
import * as Types from './types';
export * from './types';

export default function parse<T extends Types.JsonObject|Types.JsonArray>(text: string): T {
  let result: Types.JsonNode | undefined = undefined;
  const cs = new CharacterStream(text);
  ws(cs);
  if (cs.ch === '{') {
    result = object(cs);
  } else if (cs.ch === '[') {
    result = array(cs);
  }
  ws(cs);
  if (!cs.eoi) {
    throw new Error(`Unexpected character '${cs.ch}' at ${cs.line}:${cs.column}. Expected end of input.`);
  }
  return result! as T;
}

function object(cs: CharacterStream): Types.JsonObject {
  function members(cs1: CharacterStream): Types.Pair[] {
    function pair(cs2: CharacterStream): Types.Pair {
      ws(cs2);
      let key = string(cs2);
      ws(cs2);
      cs2.accept(':');
      return {
        key,
        value: value(cs2)
      };
    }

    const members: Types.Pair[] = [];
    let next = true;
    while (next) {
      members.push(pair(cs1));
      ws(cs1);
      if (cs1.ch === ',') {
        cs1.next();
      } else if (cs1.ch === '"') {
        // This is probably a missing comma
      } else {
        next = false;
      }
    }
    return members;
  }

  const ast: Types.JsonObject = {
    type: 'object',
    pos: {
      start: cs.pos,
      end: cs.pos
    }
  };

  ws(cs);
  cs.accept('{');
  ws(cs);
  if (cs.ch === '"') {
    ast.members = members(cs);
  }
  ws(cs);
  cs.accept('}');
  ast.pos.end = cs.pos;

  return ast;
}

function array(cs: CharacterStream): Types.JsonArray {
  const ast: Types.JsonArray = {
    type: 'array',
    pos: {
      start: cs.pos,
      end: cs.pos
    }
  };
  ws(cs);
  cs.accept('[');
  if (cs.ch !== ']') {
    ast.elements = [];
    let next = true;
    while (next) {
      ast.elements.push(value(cs));
      ws(cs);
      if (cs.ch === ',') {
        cs.next();
      } else if (cs.ch !== ']') {
        // This is probably a missing comma
      } else {
        next = false;
      }
    }
  }
  ws(cs);
  cs.accept(']');
  ast.pos.end = cs.pos;
  return ast;
}

function value(cs: CharacterStream): Types.JsonValue {
  ws(cs);
  if (cs.ch === '"') {
    return string(cs);
  } else if (cs.ch === '{') {
    return object(cs);
  } else if (cs.ch === '[') {
    return array(cs);
  } else if (cs.ch === 't') {
    return trueLiteral(cs);
  } else if (cs.ch === 'f') {
    return falseLiteral(cs);
  } else if (cs.ch === 'n') {
    return nullLiteral(cs);
  }
  return number(cs);
}

function string(cs: CharacterStream): Types.JsonString {
  const start = cs.pos;
  let value = '';
  cs.accept('"');
  while (cs.ch !== '"') {
    value += cs.ch;
    cs.next();
  }
  cs.accept('"');
  return {
    type: 'string',
    value,
    pos: {
      start,
      end: cs.pos
    }
  };
}

function trueLiteral(cs: CharacterStream): Types.JsonLiteral {
  ws(cs);
  const start = cs.pos;
  cs.accept('true');
  return {
    type: 'true',
    pos: {
      start,
      end: cs.pos
    }
  };
}

function falseLiteral(cs: CharacterStream): Types.JsonLiteral {
  ws(cs);
  const start = cs.pos;
  cs.accept('false');
  return {
    type: 'false',
    pos: {
      start,
      end: cs.pos
    }
  };
}

function nullLiteral(cs: CharacterStream): Types.JsonLiteral {
  ws(cs);
  const start = cs.pos;
  cs.accept('null');
  return {
    type: 'null',
    pos: {
      start,
      end: cs.pos
    }
  };
}

function number(cs: CharacterStream): Types.JsonNumber {
  function digit(): string {
    let number = '';
    const ch = cs.ch;
    if (ch === '0' || ch === '1' || ch === '2' || ch === '3' || ch === '4' ||
        ch === '5' || ch === '6' || ch === '7' || ch === '8' || ch === '9') {
      number = ch;
      cs.next();
    }
    return number;
  }
  function digits(): string {
    let number = digit();
    let temp = digit();
    while (temp !== '') {
      number += temp;
      temp = digit();
    }
    return number;
  }

  const start = cs.pos;
  const negative = cs.skip('-') ? '-' : '';
  let int: string;
  if (cs.ch === '0') {
    int = cs.ch;
    cs.next();
  } else {
    int = digits();
  }
  let frac = '';
  if (cs.ch === '.') {
    cs.next();
    frac = '.' + digits();
  }
  let exp = '';
  if (cs.ch === 'e' || cs.ch === 'E') {
    cs.next();
    exp = 'e';
    exp += cs.skip('+') ? '+' : '';
    exp += cs.skip('-') ? '-' : '';
    exp += digits();
  }

  return {
    type: 'number',
    value: parseFloat(`${negative}${int}${frac}${exp}`),
    pos: {
      start,
      end: cs.pos
    }
  };
}

function ws(cs: CharacterStream): void {
  let next = true;
  while (next) {
    next = cs.skip(' ') ||
      cs.skip('\t') ||
      cs.skip('\n') ||
      cs.skip('\r');
  }
}
