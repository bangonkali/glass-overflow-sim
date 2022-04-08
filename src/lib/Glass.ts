import { IGlassAddress } from "./IGlassAddress";
import { IPortion } from "./IPortion";
import { SimEngine } from "./SimEngine";

export class Glass {
  public left: Glass | undefined;

  public right: Glass | undefined;

  public content: IPortion[] = [];

  constructor(
    public level: number,
    public levelIndex: number,
    public maxCapacity: number,
    public instanceId: number,
    public engine: SimEngine
  ) {}

  public is(address: IGlassAddress | undefined) {
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

  public pour(portion: IPortion) {
    this.content.push(portion);

    if (this.getTotalContent() > this.maxCapacity) {
      // get the top most portion and distribute evenly left and right
      const overflowingPortion = this.content.pop() as IPortion;

      // calculate the remaining portion
      const volumeToRemain = this.maxCapacity - this.getTotalContent();

      // calculate the overflowing volume
      const volumeToOverflow = overflowingPortion?.volume - volumeToRemain;
      const volumePerSideToOverflow = volumeToOverflow / 2;

      // return the remaining portion
      overflowingPortion.volume = volumeToRemain;
      this.content.push(overflowingPortion);

      // create portions to overflow half of overflowing version
      const leftPortion = {
        volume: volumePerSideToOverflow,
        id: overflowingPortion.id,
      };
      const rightPortion = {
        volume: volumePerSideToOverflow,
        id: overflowingPortion.id,
      };

      if (this.left === undefined) {
        this.left = this.engine.getGlass(this, this.maxCapacity, true);
      }
      this.left.pour(leftPortion);

      if (this.right === undefined) {
        this.right = this.engine.getGlass(this, this.maxCapacity, false);
      }
      this.right.pour(rightPortion);
    } else {
      if (this.left === undefined) {
        this.left = this.engine.getGlass(this, this.maxCapacity, true);
      }
      if (this.right === undefined) {
        this.right = this.engine.getGlass(this, this.maxCapacity, false);
      }
    }
  }
}
