import * as React from 'react';
import { Box, Button, Container } from '@mui/material';

import { Room } from '../components/room';
import '../index.css';

const sx = {
    width: '100%',
    height: '100%',
    bgcolor: 'lightgrey',
    border: '1px solid black'
};

interface ICanvasState {
    viewBoxElem?: HTMLDivElement;
    rooms: Array<string>;
}

export class Canvas extends React.Component<{}, ICanvasState> {
    private _containerRef: React.RefObject<HTMLDivElement>;

    constructor(props: {}) {
        super(props);
        this._containerRef = React.createRef();
        this.state = {
            rooms: []
        };
    }

    componentDidMount() {
        if (this._containerRef && this._containerRef.current) {
            this.setState({ viewBoxElem: this._containerRef.current });
        }
    }

    private readonly _addRoom = () => {
        this.setState((curState: ICanvasState) => {
            return {
                rooms: curState.rooms.concat((curState.rooms.length + 1).toString())
            };
        })
    }

    render() {
        return (
            <Container className='canvasWrapper'>
                <Button variant='outlined' onClick={this._addRoom}>Add a Room</Button>
                <Box sx={sx} ref={this._containerRef}>
                    <div>
                        {this.state.viewBoxElem && (
                            <svg viewBox={`0 0 ${this.state.viewBoxElem.offsetWidth} ${this.state.viewBoxElem.offsetHeight}`}>
                                {this.state.rooms.map((r) => (
                                    <Room key={r} id={r} viewBoxElem={this.state.viewBoxElem!}></Room>
                                ))}
                            </svg>
                        )}
                    </div>
                    
                </Box>
            </Container>
        );
    }
}
