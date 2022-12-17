import { RuntimeVal, NumberVal} from './values.ts'
import { BinaryExpr, Identifier, NumericLiteral, Program, Statement, VarDeclaration } from '../frontend/ast.ts'
import Environment from './environment.ts';
import { eval_identifier,eval_binary_expr } from "./eval/expressions.ts";
import { eval_program,eval_var_declaration } from "./eval/statements.ts";

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

      //handle statements
      case "VarDeclaration":
        return eval_var_declaration (astNode as VarDeclaration, env);
      default:
        console.error("AST Node has yet to be setup for interpretation", astNode);
        Deno.exit(1);
  }
}
