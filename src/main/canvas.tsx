import * as React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { Room } from '../components/room';
import '../index.css'
import { Button } from '@mui/material';
import { Mover } from '../components/moveable';

const sx = {
    width: '100%',
    height: '60%',
    bgcolor: 'lightgrey',
    border: '1px solid black'
};

interface CanvasState {
    viewBox?: IViewBoxSpecs;
    rooms: Array<IRoom>;
}

export interface IDimensions {
    width: number;
    height: number;
}

export interface IViewBoxSpecs extends IDimensions {
    description: string;
}

export interface IRoom {
    id: number;
    name?: string;
    clicked?: boolean;
}

export class Canvas extends React.Component<{}, CanvasState> {
    private _container: React.RefObject<HTMLDivElement>;

    constructor(props: {}) {
        super(props);
        this._container = React.createRef();
        this.state = {
            rooms: []
        };
    }

    componentDidMount() {
        if (this._container && this._container.current) {
            const height: number = this._container.current.offsetHeight;
            const width: number = this._container.current.offsetWidth;
            const description: string = `0 0 ${width.toString()} ${height.toString()}`;
            this.setState({ viewBox: { width, height, description } });
        }
    }

    private readonly _onClickAddRoom = (): void => {
        this.setState((curState) => {
            return {
                rooms: curState.rooms.concat({id: curState.rooms.length + 1})
            }
        });
    }

    private readonly _onPointerMove = () => {

    }

    render() {
        const renderContent = (vb: IViewBoxSpecs) => (
            <svg viewBox={vb.description}>
                { this.state.rooms.map((r) => <Room key={r.id} viewBox={vb}></Room>) }
            </svg>
        );

        return (
            <Container id="svg-1" className="canvasWrapper">
                <Button variant="outlined" onClick={this._onClickAddRoom}>Add a Room</Button>
                <Box sx={sx} ref={this._container}>
                    {this.state.viewBox && renderContent(this.state.viewBox)}
                </Box>
            </Container>
        );
    }
}
