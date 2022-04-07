import React from "react";
import { Group, Rect, Text } from "react-konva";
import { Glass } from "../lib/Glass";
import { fmtNum } from "../utils/num";

export type GlassWidgetProps = {
    glass: Glass,
    x: number,
    y: number,
    isSelected: boolean,
    onSelect: (glass: Glass) => void | undefined,
    height: number,
    width: number,
    fontSize: number,
};

export const GlassWidget: React.FC<GlassWidgetProps> = (props: GlassWidgetProps) => {
    const handleClick = () => {
        props.onSelect(props.glass);
    };

    const fill = Math.min(
        props.height,
        (props.glass.getTotalContent() / props.glass.max_capacity) * props.height
    )

    return (
        <Group
            onClick={handleClick}>
            <Rect
                x={props.x}
                y={props.y + (props.height - fill)}
                width={props.width - 1}
                height={fill - 1}
                fill={props.isSelected ? 'red' : 'green'}
            />
            <Rect
                x={props.x}
                y={props.y}
                width={props.width - 1}
                height={props.height - 1}
                stroke={'black'}
                strokeWidth={1}
                shadowBlur={props.isSelected ? 5 : 0}
                shadowColor={props.isSelected ? 'red' : 'black'}
            />
            <Text
                fontStyle={props.isSelected ? 'bold' : 'normal'}
                width={props.width}
                height={props.height}
                x={props.x}
                y={props.y}
                fontSize={props.fontSize}
                align="center"
                verticalAlign="middle"
                text={`${fmtNum(props.glass.getTotalContent())}`} />
        </Group>
    );
}

