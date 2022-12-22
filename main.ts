// import { tokenize } from "./frontend/lexer.ts";
import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_NULL, MK_BOOL } from "./runtime/values.ts";

// repl()
run("./test.txt")
async function run(filename: string){
  const parser = new Parser();
  const env = new Environment();

  // create default global environment
  env.declareVar("true", MK_BOOL(true), true);
  env.declareVar("false", MK_BOOL(false), true);
  env.declareVar("null", MK_NULL(), true);

  const input = await Deno.readTextFile(filename);
  const program = parser.produceAST(input);
  const result = evaluate(program, env);
  console.log(result)
}

function repl () {
  const parser = new Parser();
  const env = new Environment();

  // create default global environment
  env.declareVar("true", MK_BOOL(true), true);
  env.declareVar("false", MK_BOOL(false), true);
  env.declareVar("null", MK_NULL(), true);
  
  console.log("\nRepl v0.1");

  while (true) {
    const input = prompt ("> ");
    //check for no user input or exit keyword.
    if(!input || input.includes("exit")){
      Deno.exit(1);
    }

    const program = parser.produceAST(input);

    // for (const token of tokenize(input)) {
    //   console.log("token: ", token)
    // }
    // console.log("ast : ", program)

    const result = evaluate(program, env);
    console.log("\n",result);
  }
}