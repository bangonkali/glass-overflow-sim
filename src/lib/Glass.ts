import { isNullOrUndefined } from "util";
import { GlassAddress } from "./GlassAddress";
import { Portion } from "./Portion";
import { SimFactory } from "./SimFactory";

export class Glass {
  public left: Glass | undefined;

  public right: Glass | undefined;

  public content: Portion[] = [];

  constructor(
    public level: number,
    public levelIndex: number,
    public maxCapacity: number,
    public instanceId: number,
    public simFactory: SimFactory
  ) {}

  public is(address: GlassAddress | undefined) {
    if (address)
      return (
        this.level === address.level && this.levelIndex === address.levelIndex
      );
    return false;
  }

  public getName(): string {
    return `L: ${this.level} LI: ${this.levelIndex} INST: ${this.instanceId} `;
  }

  public getTotalContent(): number {
    const total = this.content
      .map((c) => c.volume)
      .reduce((prev, current) => {
        return prev + current;
      }, 0);
    return total;
  }

  public pour(portion: Portion) {
    this.content.push(portion);
    // console.log(`${this.getName()} poured ${this.getTotalContent()}`)

    if (this.getTotalContent() > this.maxCapacity) {
      // get the top most portion and distribute evenly left and right
      const overflowingPortion = this.content.pop();

      if (isNullOrUndefined(overflowingPortion)) return;

      // calculate the remaining portion
      const volumeToRemain = this.maxCapacity - this.getTotalContent();

      // calculate the overflowing volume
      const volumeToOverflow = overflowingPortion?.volume - volumeToRemain;
      const volumePerSideToOverflow = volumeToOverflow / 2;

      // return the remaining portion
      overflowingPortion.volume = volumeToRemain;
      this.content.push(overflowingPortion);

      // console.log(`${this.getName()} overflow of ${volumeToOverflow}`)

      // create portions to overflow half of overflowing version
      const leftPortion = new Portion(
        volumePerSideToOverflow,
        overflowingPortion.id
      );
      const rightPortion = new Portion(
        volumePerSideToOverflow,
        overflowingPortion.id
      );

      // console.log(`${this.getName()} pour left ${leftPortion.volume}`)
      if (this.left === undefined) {
        this.left = this.simFactory.getGlass(this, this.maxCapacity, true);
      }
      this.left.pour(leftPortion);

      // console.log(`${this.getName()} pour right ${rightPortion.volume}`)
      if (this.right === undefined) {
        this.right = this.simFactory.getGlass(this, this.maxCapacity, false);
      }
      this.right.pour(rightPortion);
    } else {
      if (this.left === undefined) {
        this.left = this.simFactory.getGlass(this, this.maxCapacity, true);
      }
      if (this.right === undefined) {
        this.right = this.simFactory.getGlass(this, this.maxCapacity, false);
      }
    }
  }
}
