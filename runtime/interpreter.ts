import { RuntimeVal, NumberVal, MK_NULL } from './values.ts'
import { BinaryExpr, Identifier, NumericLiteral, Program, Statement } from '../frontend/ast.ts'
import Environment from './environment.ts';

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

function eval_program(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NULL();

  for (const statement of program.body){
    lastEvaluated = evaluate(statement, env);
  }

  return lastEvaluated;

}

//recursively evaluate left and right side
function eval_binary_expr(binop: BinaryExpr, env: Environment): RuntimeVal {
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

function eval_identifier(ident: Identifier, env: Environment): RuntimeVal {
  const val = env.lookupVar(ident.symbol);
  return val;
}

// evaluate ast Node by iterating through all of its children 
// and returning last evaluated elements, 
// if there no element in program, it'll return null value 
export function evaluate(astNode: Statement, env: Environment): RuntimeVal {
  
  switch(astNode.kind){
    case "NumericLiteral":
      return { 
        value: ((astNode as NumericLiteral).value),
        type: "number"
      } as NumberVal;
    case "Identifier":
      return eval_identifier(astNode as Identifier, env);
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr, env);
    case "Program":
      return eval_program(astNode as Program, env);

      default:
        console.error("AST Node has yet to be setup for interpretation", astNode);
        Deno.exit(1);
  }
}