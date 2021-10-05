import React,{ Component } from 'react'

import '../index.css'

export interface IRoomProps {
    id: number;
    name?: string;
};

export class Room extends Component<IRoomProps, {}> {

    constructor(props: IRoomProps) {
        super(props);
    }

    render() {
        return (
            <g key={this.props.id} style={{ transform: 'translate(40px, 10px)' }}>
                <rect data-target={'rect-' + this.props.id} x={0} y={0} width='50px' height='50px' fill='red' />
            </g>
        );
    }
}
