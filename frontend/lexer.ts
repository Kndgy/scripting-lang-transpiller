// let x = 45 + ( foo * bar )
// let [ letToken, IdentifierTK, EqualsToken, NumberToken ]

export enum TokenType {
  // Literal Types
  Null,
  Number,
  Identifier,

  // Keywords
  Let,

  // Grouping * Operators
  Equals,
  OpenParen,
  CloseParen,
  BinaryOperator,
  EOF, //siginified the end of file
}

// represents a single token from the source code
export interface Token {
  value: string, // raw value
  type: TokenType, // tagged structure
}

// Constant Lookup for keywords and identifiers + symbols.

const KEYWORDS: Record<string, TokenType> = {
  let :TokenType.Let,
  null : TokenType.Null,
}

function token (value = "", type: TokenType): Token{
  return { value, type}
}

function isAlpha (src: string) {
  return src.toUpperCase() != src.toLowerCase();
}

function isSkippable (str: string) {
  return str == ' ' || str == '\n' || str == '\t';
}

function isInt(str: string) {
  const char = str.charCodeAt(0);
  const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
  return (char >= bounds[0] && char <= bounds[1]);
}

export function tokenize (sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");

  //build each token until end of file(EOF)
  while (src.length > 0) {
    if (src[0] == '(' || src[0] == ')'){
      src[0] == "(" ? tokens.push(token(src.shift(), TokenType.OpenParen)) : tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if(src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%"){
      tokens.push(token(src.shift(), TokenType.BinaryOperator))
    } else if(src[0] == "="){
      tokens.push(token(src.shift(), TokenType.Equals));
    } else {
      //handle numeric literals -> integer
      if(isInt(src[0])) {
        let num = "";
        while (src.length > 0 && isInt(src[0])){
          num += src.shift();
        }

        tokens.push(token(num, TokenType.Number));
      } else if(isAlpha(src[0])) {
        let ident = "";

        while (src.length > 0 && isAlpha(src[0])){
          ident += src.shift();
        }

        //check for reserved keywords
        const reserved = KEYWORDS[ident];

        if(typeof reserved == "number") {
          tokens.push(token(ident, reserved));
        } else {
          tokens.push(token(ident, TokenType.Identifier));
        }
      } else if(isSkippable(src[0])) {
        src.shift();
      } else {
        console.log("unrecognized characters found in source: ", src[0].charCodeAt, src[0])
        Deno.exit(1)
      }
    }
  }

  tokens.push({type: TokenType.EOF, value: "EndOfFile"});
  return tokens;
}

const source = await Deno.readTextFile("./test.txt");
for (const token of tokenize(source)) {
  console.log(token)
}