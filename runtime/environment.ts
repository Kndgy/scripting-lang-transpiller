import { RuntimeVal } from "./values.ts"

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;

  constructor (parentENV?: Environment) {
    this.parent = parentENV;
    this.variables = new Map();
  }

  public declareVar (varname: string, value: RuntimeVal): RuntimeVal {
    if(this.variables.has(varname)) {
      throw `Cannot declare variable ${varname}. as it already has defined`;
    }

    this.variables.set(varname, value);
    return value;
  }
 }