import { Layer, Rect, Stage, Text } from 'react-konva';
import { GlassWidget } from './components/GlassWidget';
import { Sim } from './lib/Sim';
import { Portion } from './lib/Portion';
import { fmtNum } from './utils/num';
import { Glass } from './lib/Glass';
import { useState } from 'react';
import { useStrictMode } from 'react-konva';

export type SimWidget = {
  x: number,
  y: number,
  glassHeight: number,
  glassWidth: number,
  glasFontSize: number,
  glassHorizontalMargin: number,
  glassVerticalMargin: number,
  pyramidMarginLeft: number,
};

export const SimWidget: React.FC<SimWidget> = (props: SimWidget) => {
  useStrictMode(true);

  const [selectedGlass, setSelectedGlass] = useState<Glass | undefined>();

  const sim = new Sim();
  const target = 1000
  sim.root.pour(new Portion(target, 0));
  sim.factory.refine();

  const maxLevel = sim.factory.getMaxLevel()
  const maxHeight = ((props.glassHeight + props.glassVerticalMargin) * maxLevel) + props.glassHeight;
  const maxWidth = (props.glassWidth * (maxLevel + 1)) + props.pyramidMarginLeft;

  const onSelectGlass = (glass: Glass) => {
    setSelectedGlass(glass);
  }

  return (
    <div className="App">
      <Stage width={maxWidth} height={maxHeight}>
        <Layer>
          <Rect
            width={maxWidth}
            height={maxHeight}
            // fill="yellow"
          />
          {
            sim.factory.getVolumePerLevel().map((v) => {
              const y = ((props.glassHeight + props.glassVerticalMargin) * v.level);
              return (
                <Text
                  key={`l_${y}`}
                  fontSize={8}
                  x={0}
                  y={y}
                  width={60}
                  fill="black"
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
                    isSelected={selectedGlass?.instanceId === glass.instanceId}
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
    </div>
  );
}