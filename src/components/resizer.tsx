import React, { useState } from 'react';
import Moveable, { OnResize, OnResizeStart } from 'react-moveable';
import { IObject } from '@daybrush/utils';

interface IResizerProps {
    viewBoxElem: HTMLDivElement;
}

interface IFrame {
    translate: Array<number>;
}

interface IResizerState {
    target?: HTMLElement | null;
    frame: IFrame | null;
}

const Resizer: React.FunctionComponent<IResizerProps> = (props) => {
    const self = this;
    const frames: IObject<IFrame> = {};
    let moveable: Moveable | null = null;

    const [state, setState] = useState<IResizerState>({
        target: undefined,
        frame: { translate: [0, 0] }
    })

    const vb = `0 0 ${props.viewBoxElem.offsetWidth} ${props.viewBoxElem.offsetHeight}`;
    React.useEffect(() => {
        setState((curState) => {
            return Object.assign({}, curState, { target: document.querySelector('.target')! as HTMLElement });
        });
    }, []);

    const onResize = (e: OnResize) => {
        const beforeTranslate = e.drag.beforeTranslate;
                
        state.frame!.translate = beforeTranslate;
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
        e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
    }

    const onResizeStart = (e: OnResizeStart) => {
        e.setOrigin(['%', '%']);
        e.dragStart && e.dragStart.set(state.frame!.translate);
    }

    const onClick = (e: any) => {
        const target = e.target;

        const id = target.getAttribute('data-target');
        e.preventDefault();

        if (id) {
            if (!frames[id]) {
                frames[id] = { translate: [0, 0] };
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
                target={state.target}
                resizable={true}
                keepRatio={false}
                throttleResize={0}
                renderDirections={['nw','n','ne','w','e','sw','s','se']}
                edge={false}
                zoom={1}
                origin={true}
                padding={{'left': 0, 'top': 0, 'right': 0, 'bottom': 0}}
                onResizeStart={onResizeStart}
                onResize={onResize}
            />
        </div>
    );
}

export { Resizer };
