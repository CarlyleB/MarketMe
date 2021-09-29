import * as React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { Room } from '../components/room';
import '../index.css'

const sx = {
    width: '100%',
    height: '60%',
    bgcolor: 'lightgrey',
    border: '1px solid black'
};

interface CanvasState {
    viewBox?: IViewBoxSpecs;
}

export interface IDimensions {
    width: number;
    height: number;
}

export interface IViewBoxSpecs extends IDimensions {
    description: string;
}

export class Canvas extends React.Component<{}, CanvasState> {
    private _container: React.RefObject<HTMLDivElement>;

    constructor(props: {}) {
        super(props);
        this._container = React.createRef();
        this.state = {};
    }

    componentDidMount() {
        if (this._container && this._container.current) {
            const height: number = this._container.current.offsetHeight;
            const width: number = this._container.current.offsetWidth;
            const description: string = `0 0 ${width.toString()} ${height.toString()}`;
            this.setState({ viewBox: { width, height, description } });
        }
    }

    render() {
        const renderContent = (vb: IViewBoxSpecs) => (
            <div>
                <Room viewBox={vb}></Room>
            </div>
        );

        return (
            <Container className="canvasWrapper">                    
                <Box sx={sx} ref={this._container}>
                    {this.state.viewBox && renderContent(this.state.viewBox)}
                </Box>
            </Container>
        );
    }
}
