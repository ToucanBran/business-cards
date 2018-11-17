
export class HistoryAction {
   timestamp: Date;
    private _action: string;
    icon = '';
    action = '';
    constructor(timestamp: Date, action: string) {
        this.timestamp = timestamp;
        this._action = action;
        const iconAction = this._action.split(' - ');
        if (iconAction[0]) {
            this.icon = iconAction[0];
        }
        if (iconAction[1]) {
            this.action = iconAction[1];
        }
    }
}
