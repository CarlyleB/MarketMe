import React, { useState } from 'react';
import Moveable, { OnDrag, OnResize, OnResizeStart } from 'react-moveable';
import { setAlias, Frame } from 'scenejs';
import { IObject } from '@daybrush/utils';
import MoveableHelper from "moveable-helper";

setAlias('tx', ['transform', 'translateX']);
setAlias('ty', ['transform', 'translateY']);
setAlias('tz', ['transform', 'translateZ']);
setAlias('rotate', ['transform', 'rotate']);
setAlias('sx', ['transform', 'scaleX']);
setAlias('sy', ['transform', 'scaleY']);
setAlias('matrix3d', ['transform', 'matrix3d']);

interface IRoomProps {
    id: string;
    container: HTMLElement;
}

interface IRoomState {
    target: SVGElement | null;
    frame: Frame | null;
}

const Room: React.FunctionComponent<IRoomProps> = (props) => {
    let moveable: Moveable | null = null;

    const [state, setState] = useState<IRoomState>({
        target: null,
        frame: null
    })

    React.useEffect(() => {
        setState((curState) => {
            return Object.assign({}, curState, { target: document.querySelector('#rect-' + props.id)! as SVGElement });
        });
    }, []);

    const [helper] = React.useState(() => {
        return new MoveableHelper();
    });

    return (
        <div className='container'>
            <rect id={'rect-' + props.id} data-target={'rect-' + props.id} x={0} y={0} width='50px' height='50px' fill='red' />
            <Moveable
                ref={node => { 
                    console.log('Attaching node: ', node)
                    if (node) { // with this we know node is not null or undefined
                        moveable = node;
                    }
                }}
                container={props.container}
                target={state.target}
                resizable={true}
                draggable={true}
                keepRatio={false}
                throttleResize={0}
                renderDirections={['nw','n','ne','w','e','sw','s','se']}
                edge={false}
                zoom={1}
                origin={true}
                padding={{'left': 0, 'top': 0, 'right': 0, 'bottom': 0}}
                onDragStart={helper.onDragStart}
                onDrag={helper.onDrag}
                onResizeStart={helper.onResizeStart}
                onResize={helper.onResize}
                onRotateStart={helper.onRotateStart}
                onRotate={helper.onRotate}
            />
        </div>
    );
}

export { Room };
