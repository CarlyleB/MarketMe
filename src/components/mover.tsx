import React from 'react';
import Moveable, { OnDrag, OnResize, OnRotate, OnScale, OnWarp } from 'react-moveable';
import { ref } from 'framework-utils';
import { setAlias, Frame } from 'scenejs';
import { IObject } from '@daybrush/utils';

setAlias('tx', ['transform', 'translateX']);
setAlias('ty', ['transform', 'translateY']);
setAlias('tz', ['transform', 'translateZ']);
setAlias('rotate', ['transform', 'rotate']);
setAlias('sx', ['transform', 'scaleX']);
setAlias('sy', ['transform', 'scaleY']);
setAlias('matrix3d', ['transform', 'matrix3d']);

interface IMoverProps {
    viewBoxElem: HTMLDivElement;
}

interface IMoverState {
    target: HTMLElement | SVGElement | null;
    isResizable: boolean;
    item: Frame | null;
    rooms: Array<{id: number}>;
}

export class Mover extends React.Component<IMoverProps, IMoverState> {
    public moveable: Moveable | null = null;
    private items: IObject<Frame> = {};

    constructor(props: IMoverProps) {
        super(props);
        this.state = {
            target: null,
            isResizable: false,
            item: null,
            rooms: []
        };
    }
 
    public onRotate = (e: OnRotate) => {
        this.state.item!.set(
            'rotate',
            `${parseFloat(this.state.item!.get('rotate')) + e.beforeDelta}deg`
        );
        e.target.style.cssText += this.state.item!.toCSS();
    }

    public onDrag = (e: OnDrag) => {
        this.state.item!.set('tx', `${parseFloat(this.state.item!.get('tx')) + e.beforeDelta[0]}px`);
        this.state.item!.set('ty', `${parseFloat(this.state.item!.get('ty')) + e.beforeDelta[1]}px`);

        e.target.style.cssText += this.state.item!.toCSS();
    }

    public onScale = (e: OnScale) => {
        console.log(e);
        console.log(this.state.item!);
        this.state.item!.set('sx', this.state.item!.get('sx') * e.dist[0]);
        this.state.item!.set('sy', this.state.item!.get('sy') * e.dist[1]);

        e.target.style.cssText += this.state.item!.toCSS();
    }

    public onResize = (e: OnResize) => {
        e.delta[0] && (e.target!.style.width = `${e.width}px`);
        e.delta[1] && (e.target!.style.height = `${e.height}px`);
    }

    public onWarp = (e: OnWarp) => {
        const matrix3d = this.state.item!.get('matrix3d');

        if (!matrix3d) {
            this.state.item!.set('matrix3d', e.delta);
        } else {
            this.state.item!.set('matrix3d', e.multiply(this.state.item!.get('matrix3d'), e.delta, 4));
        }
        e.target.style.cssText += this.state.item!.toCSS();
    }

    public onClick = (e: any) => {
        const target = e.target;

        const id = target.getAttribute('data-target');
        e.preventDefault();

        if (id) {
            const items = this.items;
            if (!items[id]) {
                items[id] = new Frame({
                    tz: '5px',
                    tx: '0px',
                    ty: '0px',
                    rotate: '0deg',
                    sx: 1,
                    sy: 1
                });
            }

            if (!this.moveable!.isMoveableElement(e.target)) {
                if (this.state.target === e.target) {
                    this.moveable!.updateRect();
                } else {
                    const nativeEvent = e.nativeEvent;
                    const callback = () => this.moveable!.dragStart(nativeEvent);
                    this.setState({ target: e.target, item: items[id] }, callback);
                }
            }
        } else {
            this.setState({target: null, item: null});
        }
    };

    public render() {
        const selectedTarget = this.state.target;
        const isResizable = this.state.isResizable;
        const vb = `0 0 ${this.props.viewBoxElem.offsetWidth} ${this.props.viewBoxElem.offsetHeight}`;
        return (
            <div>
                <Moveable
                    target={selectedTarget}
                    container={document.body}
                    ref={ref(this, 'moveable')}
                    keepRatio={false}
                    origin={true}
                    draggable={true}
                    scalable={!isResizable}
                    // resizable={isResizable}
                    // warpable={true}
                    throttleDrag={0}
                    throttleScale={0}
                    throttleResize={0}
                    throttleRotate={0}
                    rotatable={true}
                    onRotate={this.onRotate}
                    onDrag={this.onDrag}
                    onScale={this.onScale}
                    onResize={this.onResize}
                    onWarp={this.onWarp}
                />
                <div
                    className='App'
                    onMouseDown={this.onClick}
                    onTouchStart={this.onClick}
                    data-target='app'
                >
                    <svg viewBox={vb}>
                        {this.props.children}
                    </svg>
                </div>
            </div>
        );
    }
}
