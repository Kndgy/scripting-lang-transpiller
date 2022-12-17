import { BinaryExpr,Identifier } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { NumberVal,RuntimeVal,MK_NULL } from "../values.ts";

export function eval_numeric_binary_expr(leftHandSide: NumberVal, rightHandSide: NumberVal, operator: string): NumberVal{
  let result: number;
  if (operator == "+") {
    result = leftHandSide.value + rightHandSide.value;
  } else if (operator == "-") {
    result = leftHandSide.value - rightHandSide.value;
  } else if (operator == "*") {
    result = leftHandSide.value * rightHandSide.value;
  } else if(operator == "/") {
    // TODO: division by zero checks
    result = leftHandSide.value / rightHandSide.value;
  } else {
    result = leftHandSide.value % rightHandSide.value;
  }
  return {value: result, type: "number"};
}

//recursively evaluate left and right side
export function eval_binary_expr(binop: BinaryExpr, env: Environment): RuntimeVal {
  const leftHandSide = evaluate(binop.left, env);
  const rightHandSide = evaluate(binop.right, env);

  // TODO handle if one string one number etc
  if(leftHandSide.type == "number" && rightHandSide.type == "number" ){
    return eval_numeric_binary_expr(
      leftHandSide as NumberVal, 
      rightHandSide as NumberVal, 
      binop.operator
    );
  }
  //one or both are Null
  return MK_NULL();
}

export function eval_identifier(ident: Identifier, env: Environment): RuntimeVal {
  const val = env.lookupVar(ident.symbol);
  return val;
}