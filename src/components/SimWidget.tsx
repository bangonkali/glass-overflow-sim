import { Layer, Rect, Stage, Text } from 'react-konva';
import { GlassWidget } from './GlassWidget';
import { Sim } from '../lib/Sim';
import { Portion } from '../lib/Portion';
import { fmtNum } from '../utils/num';
import { Glass } from '../lib/Glass';
import { GlassAddress } from '../lib/GlassAddress';

export type SimWidget = {
  x: number,
  y: number,
  volume: number,
  glassHeight: number,
  glassWidth: number,
  glasFontSize: number,
  glassHorizontalMargin: number,
  glassVerticalMargin: number,
  pyramidMarginLeft: number,
  selectedGlass: GlassAddress | undefined,
  onSelectGlass: (glassAddress: GlassAddress) => void,
};

export const SimWidget: React.FC<SimWidget> = (props: SimWidget) => {

  const sim = new Sim();
  sim.root.pour(new Portion(props.volume, 0));
  sim.factory.refine();

  const maxLevel = sim.factory.getMaxLevel()
  const maxHeight = ((props.glassHeight + props.glassVerticalMargin) * maxLevel) + props.glassHeight;
  const maxWidth = (props.glassWidth * (maxLevel + 1)) + props.pyramidMarginLeft;

  const onSelectGlass = (glass: Glass) => {
    props.onSelectGlass({
      level: glass.level,
      levelIndex: glass.levelIndex
    });
  }

  return (
    <Stage width={maxWidth} height={maxHeight} style={{ paddingRight: 50 }}>
      <Layer>
        <Rect
          width={maxWidth}
          height={maxHeight}
        />
        {
          sim.factory.getVolumePerLevel().map((v) => {
            const y = ((props.glassHeight + props.glassVerticalMargin) * v.level);
            return (
              <Text
                key={`l_${y}`}
                fontSize={8}
                fontStyle={props.selectedGlass?.level === v.level ? 'bold' : 'normal'}
                x={0}
                y={y}
                width={60}
                fill="black"
                shadowBlur={props.selectedGlass?.level === v.level ? 5 : 0}
                verticalAlign="middle"
                height={props.glassHeight}
                text={`${fmtNum(v.total)}`} />
            )
          })
        }
        {
          sim.factory.levels.flatMap((level) => {
            return sim.factory.glasses[level].map((glass, index) => {
              const xOffset = (props.glassWidth + props.glassHorizontalMargin) / 2
              const y = ((props.glassHeight + props.glassVerticalMargin) * level);
              const x = ((props.glassWidth + props.glassHorizontalMargin) * index) + props.pyramidMarginLeft + (xOffset * (maxLevel - level));
              return (
                <GlassWidget
                  isSelected={glass.is(props.selectedGlass)}
                  key={`${level}_${index}`}
                  x={x}
                  y={y}
                  glass={glass}
                  height={props.glassHeight}
                  width={props.glassWidth}
                  fontSize={props.glasFontSize}
                  onSelect={onSelectGlass}
                />
              )
            })
          })
        }
      </Layer>
    </Stage>
  );
}