import { Glass } from "./Glass";
import { SimEngine } from "./SimEngine";

/**
 * Sim entity for initialization of the engine and the root Glass.
 */
export class Sim {
  public engine = new SimEngine();

  public root: Glass = this.engine.getGlass();
}
