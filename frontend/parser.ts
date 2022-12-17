import { Statement, Program, Expr, BinaryExpr, NumericLiteral, Identifier, VarDeclaration } from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
  private tokens: Token[] = [];

  private not_eof (): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }
    /**
    * Returns the currently available token
    */
  private at (): Token {
    return this.tokens[0] as Token
  }

  //test
  private eat () {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  private expect (type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if(!prev || prev.type != type){
      console.error("Parser Error:\n", err, prev, "- Expecting: ", type);
      Deno.exit(1)
    }

    return prev
  }

  public produceAST(sourccode: string): Program {
    this.tokens = tokenize(sourccode);
    const program: Program = {
      kind:"Program",
      body: [],
    }

    // Parse untill end of file
    while (this.not_eof()) {
      program.body.push(this.parse_statement());
    }

    return program
  }

  private parse_statement(): Statement {
    // skip to parse_expr
    switch (this.at().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parse_var_declaration();
      default:
        return this.parse_expr()
    }
  } 

  // let ident
  //(const | let) IDENT
  parse_var_declaration(): Statement {
    const isConstant =  this.eat().type == TokenType.Const;
    const identifier = this.expect(
      TokenType.Identifier, "Expected identifier name following let | const keywords"
    ).value;

    if(this.at().type == TokenType.Semicolon) {
      this.eat() // expect semicolon
      if (isConstant) {
        throw "must assign value to constant expression. No value provided.";
      }
      return {
        kind: "VarDeclaration", 
        identifier, 
        constant: false
      } as VarDeclaration;
    }

    this.expect(
      TokenType.Equals, 
      "Expected equals token following identifier in var declaration"
    )
    
    const declaration = {
      kind: "VarDeclaration",
      value: this.parse_expr(),
      identifier,
      constant: isConstant
    } as VarDeclaration;

    this.expect(
      TokenType.Semicolon, 
      "variable declaration statemnt must end with semicolon."
    )

    return declaration; 
  } 

  private parse_expr(): Expr {
    return this.parse_additive_expr();
  } 

  // simply get parse left hand expr, right side returned as object
  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicative_expr();

    while(this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const right = this.parse_multiplicative_expr();
      left = {
        kind: "BinaryExpr",
        left, 
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parse_multiplicative_expr(): Expr {
    let left = this.parse_primary_expr();

    while(this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
      const operator = this.eat().value;
      const right = this.parse_primary_expr();
      left = {
        kind: "BinaryExpr",
        left, 
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  // Orders of Presidence
  //
  // AssigntmentExpr
  // MemberExpr
  // functionalCall
  // LogicalExpr
  // ComparisonExpr
  // AdditiveExpr
  // MultiplicativeExpr
  // UnaryExpr
  // PrimaryExpr

  private parse_primary_expr(): Expr {
    const token = this.at().type;

    switch (token) {
      case TokenType.Identifier:
        return { 
          kind: "Identifier", 
          symbol: this.eat().value 
        } as Identifier;

        // constants and Numeric Const
      case TokenType.Number:
        return { 
          kind: "NumericLiteral", 
          value: parseFloat(this.eat().value + "\n") } as NumericLiteral;

        //Grouping expressions
      case TokenType.OpenParen:{
        this.eat();
        const value = this.parse_expr();
        this.expect(TokenType.CloseParen, "Unexpected token found inside parenthesised expression. Expecting closing parenthesis.",);
        return value;
      }

      default: 
        console.error("Unexpected token found during parsing", this.at())
        Deno.exit(1)
    }
  } 
}
