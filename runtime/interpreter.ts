import { RuntimeVal, NumberVal, NullVal } from './values.ts'
import { BinaryExpr, NumericLiteral, Program, Statement } from '../frontend/ast.ts'

function eval_numeric_binary_expr(leftHandSide: NumberVal, rightHandSide: NumberVal, operator: string): NumberVal{
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

function eval_program(program: Program): RuntimeVal {
  let lastEvaluated: RuntimeVal = {type:"null", value:"null"} as NullVal;

  for (const statement of program.body){
    lastEvaluated = evaluate(statement);
  }

  return lastEvaluated;

}

//recursively evaluate left and right side
function eval_binary_expr(binop: BinaryExpr): RuntimeVal {
  const leftHandSide = evaluate(binop.left);
  const rightHandSide = evaluate(binop.right);

  // TODO handle if one string one number etc
  if(leftHandSide.type == "number" && rightHandSide.type == "number" ){
    return eval_numeric_binary_expr(
      leftHandSide as NumberVal, 
      rightHandSide as NumberVal, 
      binop.operator
    );
  }
  //one or both are Null
  return {type: "null", value: "null" } as NullVal;
}

// evaluate ast Node by iterating through all of its children 
// and returning last evaluated elements, 
// if there no element in program, it'll return null value 
export function evaluate(astNode: Statement): RuntimeVal {
  
  switch(astNode.kind){
    case "NumericLiteral":
      return { 
        value: ((astNode as NumericLiteral).value),
        type: "number"
      } as NumberVal;
    case "NullLiteral":
        return {
          value: "null",
          type: "null"
        } as NullVal;
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr);
    case "Program":
      return eval_program(astNode as Program);

      default:
        console.error("AST Node has yet to be setup for interpretation", astNode);
        Deno.exit(1);
  }
}