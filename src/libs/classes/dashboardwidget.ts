import WSWidget from '@/libs/classes/wswidget';

export default class DashboardWidget extends WSWidget {
  public displayWidget: boolean = true;
  public hasData: boolean = false;

  private toggleWidget() {
    this.displayWidget = !this.displayWidget;
  }

  private isSelected(widget: boolean, side: boolean) {
    return {
      selected: (widget && !side) || (!widget && side),
    };
  }
}

