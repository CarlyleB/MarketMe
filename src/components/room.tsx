import React,{ Component, PointerEvent as ReactPointerEvent } from 'react'

import { IDimensions, IViewBoxSpecs } from '../main/canvas';
import { Mover } from './moveable';
import { DragMove } from './draggable';
import '../index.css'

interface IRoomState extends IDimensions, IPosition {
    dragOrigin: IPosition;
}

interface IRoomProps {
    viewBox: IViewBoxSpecs;
};

interface IPosition {
    x: number;
    y: number;
}

export class Room extends Component<IRoomProps, IRoomState> {
    private svg: React.RefObject<SVGSVGElement>;

    constructor(props: IRoomProps) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            dragOrigin: { x: 0, y: 0 }
        };
        this.svg = React.createRef();
    }

    private readonly _calcPosition = (mousePos: number, clickOffset: number, maxPos: number): number => {
        let pos: number = mousePos - clickOffset;
        if (pos > maxPos) pos = maxPos;
        else if (pos < 0) pos = 0;
        return pos;
    }

    private readonly _handleDragMove = (e: ReactPointerEvent) => {
        this.setState((curState: IRoomState) => {
            const maxX: number = this.props.viewBox.width - curState.width;
            const newX: number = this._calcPosition(e.clientX, this.state.dragOrigin.x, maxX);

            const maxY: number = this.props.viewBox.height - curState.height;
            const newY: number = this._calcPosition(e.clientY, this.state.dragOrigin.y, maxY);

            return { x: newX, y: newY };
        });
    };

    private readonly _handleDragStart = (e: ReactPointerEvent) => {
        this.setState((curState: IRoomState) => ({
            dragOrigin: {
                x: e.clientX - curState.x,
                y: e.clientY - curState.y
            }
        }));
    }

    render() {
        return (
            <svg ref={this.svg} viewBox={this.props.viewBox.description}>
                <g style={{ transform: `translateX(${this.state.x}px) translateY(${this.state.y}px)` }}>
                    <rect x={0} y={0} width={this.state.width} height={this.state.height} fill="red" />
                </g>
            </svg>
        );
    }
}
