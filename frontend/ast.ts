// deno-lint-ignore-file no-empty-interface
export type NodeType =
  //STATEMENTS 
   | "Program" 
   | "VarDeclaration"
   //EXPRESSIONS
   | "NumericLiteral" 
   | "Identifier" 
   | "BinaryExpr" 
  // | "CallExpr" 
  // | "UnaryExpr" 
  // | "FunctionDeclaration";


//statemnts =/= expressions
export interface Statement {
  kind: NodeType;
}

export interface Program extends Statement {
  kind: "Program",
  body: Statement[];
}

// Let x; // x is undefined
export interface VarDeclaration extends Statement {
  kind: "VarDeclaration";
  constant: boolean;
  identifier: string;
  value?: Expr;
}

export interface Expr extends Statement {}

export interface BinaryExpr extends Expr{
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}

export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}