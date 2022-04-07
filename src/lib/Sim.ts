import { Glass } from "./Glass"
import { SimFactory } from "./SimFactory";

export class Sim {
    public factory = new SimFactory();
    public root: Glass = this.factory.getGlass();
}