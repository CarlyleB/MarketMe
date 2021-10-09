import React, { useState } from 'react';
import Moveable, { OnDrag, OnResize, OnResizeStart } from 'react-moveable';
import { setAlias, Frame } from 'scenejs';
import { IObject } from '@daybrush/utils';

setAlias('tx', ['transform', 'translateX']);
setAlias('ty', ['transform', 'translateY']);
setAlias('tz', ['transform', 'translateZ']);
setAlias('rotate', ['transform', 'rotate']);
setAlias('sx', ['transform', 'scaleX']);
setAlias('sy', ['transform', 'scaleY']);
setAlias('matrix3d', ['transform', 'matrix3d']);

interface IResizerProps {
    viewBoxElem: HTMLDivElement;
}

interface IResizerState {
    target: HTMLElement | null;
    frame: Frame | null;
}

const Resizer: React.FunctionComponent<IResizerProps> = (props) => {
    const frames: IObject<Frame> = {};
    let moveable: Moveable | null = null;

    const [state, setState] = useState<IResizerState>({
        target: null,
        frame: null
    })

    const vb = `0 0 ${props.viewBoxElem.offsetWidth} ${props.viewBoxElem.offsetHeight}`;
    React.useEffect(() => {
        setState((curState) => {
            return Object.assign({}, curState, { target: document.querySelector('.target')! as HTMLElement });
        });
    }, []);

    const onResize = (e: OnResize) => {
        const beforeTranslate = e.drag.beforeTranslate;
                
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
        e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
    }

    const onResizeStart = (e: OnResizeStart) => {
        e.setOrigin(['%', '%']);
    }

    const onDrag = (e: OnDrag) => {
        const dragTx: number = parseFloat(state.frame!.get('tx')) + e.beforeDelta[0];
        const dragTy: number = parseFloat(state.frame!.get('ty')) + e.beforeDelta[1];

        let newTx, newTy: number;

        const maxTx: number = props.viewBoxElem.offsetWidth - e.width;
        const maxTy: number = props.viewBoxElem.offsetHeight - e.height;

        if (dragTx < 0) newTx = 0;
        else if (dragTx > maxTx) newTx = maxTx;
        else newTx = dragTx;

        if (dragTy < 0) newTy = 0;
        else if (dragTy > maxTy) newTy = maxTy;
        else newTy = dragTy;
    
        state.frame!.set('tx', `${newTx}px`);
        state.frame!.set('ty', `${newTy}px`);

        e.target.style.cssText += state.frame!.toCSS();
    }

    const onClick = (e: any) => {
        const target = e.target;

        const id = target.getAttribute('data-target');
        e.preventDefault();

        if (id) {
            if (!frames[id]) {
                frames[id] = new Frame({
                    tz: '5px',
                    tx: '0px',
                    ty: '0px',
                    rotate: '0deg',
                    sx: 1,
                    sy: 1
                });
            }

            if (!moveable!.isMoveableElement(e.target)) {
                if (e.target === state.target) {
                    moveable!.updateRect();
                } else {
                    setState({ target: e.target, frame: frames[id] });
                }
            }
        } else {
            setState({target: null, frame: null});
        }
    };

    return (
        <div className='container'>
            <div
                onMouseDown={onClick}
                onTouchStart={onClick}>
                <svg viewBox={vb}>
                    {props.children}
                </svg>
            </div>
            <Moveable
                ref={node => { 
                    console.log('Attaching node: ', node)
                    if (node) { // with this we know node is not null or undefined
                        moveable = node;
                    }
                }}
                container={props.viewBoxElem}
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
                onResizeStart={onResizeStart}
                onResize={onResize}
                onDrag={onDrag}
            />
        </div>
    );
}

export { Resizer };
