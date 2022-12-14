// deno-lint-ignore-file no-empty-interface
export type NodeType =
  //STATEMENTS 
   | "Program" 
   | "VarDeclaration"
   //EXPRESSIONS
   | "AssignmentExpr"
   | "MemberExpr"
   | "CallExpr"
   // Literals
   | "Property"
   | "ObjectLiteral"
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

export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr";
  assigne: Expr;
  value: Expr;
}

export interface BinaryExpr extends Expr{
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}

export interface CallExpr extends Expr{
  kind: "CallExpr";
  args: Expr[];
  caller: Expr;
}

export interface MemberExpr extends Expr{
  kind: "MemberExpr";
  object: Expr;
  property: Expr;
  computed: boolean;
}

export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}

export interface Property extends Expr {
  kind: "Property";
  key: string,
  value?: Expr
}

export interface ObjectLiteral extends Expr {
  kind: "ObjectLiteral";
  properties: Property[]
}