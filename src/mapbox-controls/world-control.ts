// Control(Custom)implemented as ES6 class
export default class WorldControl {
    private getZoom: () => number;
    private setZoom: (n: number) => void;
    private Container: any;

    private ZoomInButton: HTMLElement;
    private ZoomOutButton: HTMLElement;

    public constructor(getZoom: () => number, setZoom: (n: number) => void) {
        this.getZoom = getZoom;
        this.setZoom = setZoom;

        this.onZoomIn = this.onZoomIn.bind(this);
        this.onZoomOut = this.onZoomOut.bind(this);

        this.Container = document.createElement('div');
        this.Container.className = 'custom-control';

        this.ZoomInButton = this.createButton('zoom-in', this.onZoomIn);
        this.Container.append (this.ZoomInButton);

        this.ZoomOutButton = this.createButton('zoom-out', this.onZoomOut);
        this.Container.append (this.ZoomOutButton);
    }

    public getContainer() {
        return this.Container;
    }

    private createButton(classNames: string, onClickHandler:
        ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null): HTMLElement {
        const button = document.createElement('div');
        button.className = classNames;
        button.onclick = onClickHandler;
        return button;
    }

    private onZoomIn(e: Event) {
        this.setZoom(this.getZoom() + 1);
    }

    private onZoomOut(e: Event) {
        this.setZoom(this.getZoom() - 1);
    }
}
