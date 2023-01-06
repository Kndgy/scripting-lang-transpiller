// import { tokenize } from "./frontend/lexer.ts";
import Parser from "./frontend/parser.ts";
import Environment, { setupGlobalEnv } from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts"

// repl()
run("./test.txt")
async function run(filename: string){
  const parser = new Parser();
  const env = setupGlobalEnv();

  const input = await Deno.readTextFile(filename);
  const program = parser.produceAST(input);
  console.log(program)
  const result = evaluate(program, env);
  console.log(result)
}

function repl () {
  const parser = new Parser();
  const env = setupGlobalEnv();
  
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