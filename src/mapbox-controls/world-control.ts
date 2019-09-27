// Control(Custom)implemented as ES6 class
export default class WorldControl {
    private Map: any;
    private Container: any;

    private ZoomInButton: HTMLElement;
    private ZoomOutButton: HTMLElement;

    public constructor() {
        this.onZoomIn = this.onZoomIn.bind(this);
        this.onZoomOut = this.onZoomOut.bind(this);

        this.Container = document.createElement('div');
        this.Container.className = 'custom-control';

        this.ZoomInButton = this.createButton('zoom-in', this.onZoomIn);
        this.Container.append (this.ZoomInButton);

        this.ZoomOutButton = this.createButton('zoom-out', this.onZoomOut);
        this.Container.append (this.ZoomOutButton);
    }

    public onAdd(map: any) {
        this.Map = map;
        return this.Container;
    }

    public onRemove() {
        this.Container.parentNode.removeChild(this.Container);
        this.Map = undefined;
    }

    private createButton(classNames: string, onClickHandler:
        ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null): HTMLElement {
        const button = document.createElement('div');
        button.className = classNames;
        button.onclick = onClickHandler;
        return button;
    }

    private onZoomIn(e: Event) {
        this.Map.zoomIn();
    }

    private onZoomOut(e: Event) {
        this.Map.zoomOut();
    }
}
