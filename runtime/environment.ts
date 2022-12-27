import { MK_BOOL, MK_NULL, RuntimeVal } from "./values.ts"

function setupGlobalScope(env: Environment) {
  env.declareVar("true", MK_BOOL(true), true);
  env.declareVar("false", MK_BOOL(false), true);
  env.declareVar("null", MK_NULL(), true);
}

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor (parentENV?: Environment) {
    const global = parentENV ? true : false;
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();

    if(global){
      setupGlobalScope(this);
    }
  }

  public declareVar (varname: string, value: RuntimeVal, constant: boolean): RuntimeVal {
    // console.log(varname, value)
    if(this.variables.has(varname)) {
      throw `Cannot declare variable ${varname}. as it already has defined`;
    }

    this.variables.set(varname, value);
    if(constant){
      this.constants.add(varname)
    }
    // console.log("varname: ", varname)
    return value;
  }

  public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varname);

    //cannot reassign constant
    if(env.constants.has(varname)){
      throw `Cannot reasign to variable ${varname} because it was declared constant`
    }
    env.variables.set(varname, value);
    return value; 
  }

  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeVal;
  }

  public resolve(varname: string): Environment {
    if(this.variables.has(varname)){
      return this;
    }
    if(this.parent == undefined){
      throw `Cannot resolve '${varname}'. var doesnt exist`;
    }
    return this.parent.resolve(varname);
  }
 }
