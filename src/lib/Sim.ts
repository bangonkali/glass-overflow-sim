import { Glass } from "./Glass";
import { SimEngine } from "./SimEngine";

export class Sim {
  public engine = new SimEngine();

  public root: Glass = this.engine.getGlass();
}
