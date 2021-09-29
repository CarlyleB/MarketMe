import React, { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';

interface IDragMoveProps {
    onDragMove: ((e: ReactPointerEvent) => void);
    onDragStart: ((e: ReactPointerEvent) => void);
    children: {};
    style?: CSSProperties;
    className?: string;
    isSvg: boolean;
}

interface IDragMoveState {
    isDragging: boolean;
    pointerDown?: {
        x: number;
        y: number;
    };
}

export class DragMove extends React.Component<IDragMoveProps, IDragMoveState> {

    constructor(props: IDragMoveProps) {
        super(props);
        this.state = {
            isDragging: false
        };
    }
    
    private readonly _updateIsDragging = (isDragging: boolean) => {
        this.setState({
            isDragging,
        });
    }

    private readonly _handlePointerMove = (e: ReactPointerEvent<Element>) => {
        if (this.state.isDragging) this.props.onDragMove(e);
    };

    private readonly _handlePointerDown = (e: ReactPointerEvent<Element>) => {
        this._updateIsDragging(true);
        this.props.onDragStart(e);
    }

    render() {
        const Tag = this.props.isSvg ? 'g' : 'div';

        return (
            <Tag
                onPointerDown={this._handlePointerDown}
                onPointerMove={this._handlePointerMove}
                onPointerUp={() => this._updateIsDragging(false)}
                style={this.props.style}
            >
                {this.props.children}
            </Tag>
        );
    }
}
