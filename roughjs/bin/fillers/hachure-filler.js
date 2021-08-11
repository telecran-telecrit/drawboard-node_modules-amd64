import { polygonHachureLines } from './scan-line-hachure';
export class HachureFiller {
    constructor(helper) {
        this.helper = helper;
    }
    fillPolygon(points, o) {
        return this._fillPolygon(points, o);
    }
    _fillPolygon(points, o, connectEnds = false) {
        const lines = polygonHachureLines(points, o);
        const ops = this.renderLines(lines, o, connectEnds);
        return { type: 'fillSketch', ops };
    }
    renderLines(lines, o, connectEnds) {
        let ops = [];
        let prevPoint = null;
        for (const line of lines) {
            ops = ops.concat(this.helper.doubleLineOps(line[0][0], line[0][1], line[1][0], line[1][1], o));
            if (connectEnds && prevPoint) {
                ops = ops.concat(this.helper.doubleLineOps(prevPoint[0], prevPoint[1], line[0][0], line[0][1], o));
            }
            prevPoint = line[1];
        }
        return ops;
    }
}
