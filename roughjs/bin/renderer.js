import { RoughPath, PathFitter, RoughArcConverter } from './path.js';
import { getFiller } from './fillers/filler.js';
import { Random } from './math.js';
const helper = {
    randOffset,
    randOffsetWithRange,
    ellipse,
    doubleLineOps
};
export function line(x1, y1, x2, y2, o) {
    return { type: 'path', ops: _doubleLine(x1, y1, x2, y2, o) };
}
export function linearPath(points, close, o) {
    const len = (points || []).length;
    if (len > 2) {
        let ops = [];
        for (let i = 0; i < (len - 1); i++) {
            ops = ops.concat(_doubleLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], o));
        }
        if (close) {
            ops = ops.concat(_doubleLine(points[len - 1][0], points[len - 1][1], points[0][0], points[0][1], o));
        }
        return { type: 'path', ops };
    }
    else if (len === 2) {
        return line(points[0][0], points[0][1], points[1][0], points[1][1], o);
    }
    return { type: 'path', ops: [] };
}
export function polygon(points, o) {
    return linearPath(points, true, o);
}
export function rectangle(x, y, width, height, o) {
    const points = [
        [x, y], [x + width, y], [x + width, y + height], [x, y + height]
    ];
    return polygon(points, o);
}
export function curve(points, o) {
    const o1 = _curveWithOffset(points, 1 * (1 + o.roughness * 0.2), o);
    const o2 = _curveWithOffset(points, 1.5 * (1 + o.roughness * 0.22), o);
    return { type: 'path', ops: o1.concat(o2) };
}
export function curveAsBezierPoints(points, o) {
    const bez = [];
    if (points.length >= 3) {
        const ops = _curveWithOffset(points, 1 * (1 + o.roughness * 0.2), o);
        ops.forEach((op) => {
            switch (op.op) {
                case 'move':
                    bez.push([op.data[0], op.data[1]]);
                    break;
                case 'bcurveTo':
                    bez.push([op.data[0], op.data[1]]);
                    bez.push([op.data[2], op.data[3]]);
                    bez.push([op.data[4], op.data[5]]);
                    break;
            }
        });
    }
    return bez;
}
export function ellipse(x, y, width, height, o) {
    const params = generateEllipseParams(width, height, o);
    return ellipseWithParams(x, y, o, params).opset;
}
export function generateEllipseParams(width, height, o) {
    const psq = Math.sqrt(Math.PI * 2 * Math.sqrt((Math.pow(width / 2, 2) + Math.pow(height / 2, 2)) / 2));
    const stepCount = Math.max(o.curveStepCount, (o.curveStepCount / Math.sqrt(200)) * psq);
    const increment = (Math.PI * 2) / stepCount;
    let rx = Math.abs(width / 2);
    let ry = Math.abs(height / 2);
    const curveFitRandomness = 1 - o.curveFitting;
    rx += _offsetOpt(rx * curveFitRandomness, o);
    ry += _offsetOpt(ry * curveFitRandomness, o);
    return { increment, rx, ry };
}
export function ellipseWithParams(x, y, o, ellipseParams) {
    const [ap1, cp1] = _computeEllipsePoints(ellipseParams.increment, x, y, ellipseParams.rx, ellipseParams.ry, 1, ellipseParams.increment * _offset(0.1, _offset(0.4, 1, o), o), o);
    const [ap2] = _computeEllipsePoints(ellipseParams.increment, x, y, ellipseParams.rx, ellipseParams.ry, 1.5, 0, o);
    const o1 = _curve(ap1, null, o);
    const o2 = _curve(ap2, null, o);
    return {
        estimatedPoints: cp1,
        opset: { type: 'path', ops: o1.concat(o2) }
    };
}
export function arc(x, y, width, height, start, stop, closed, roughClosure, o) {
    const cx = x;
    const cy = y;
    let rx = Math.abs(width / 2);
    let ry = Math.abs(height / 2);
    rx += _offsetOpt(rx * 0.01, o);
    ry += _offsetOpt(ry * 0.01, o);
    let strt = start;
    let stp = stop;
    while (strt < 0) {
        strt += Math.PI * 2;
        stp += Math.PI * 2;
    }
    if ((stp - strt) > (Math.PI * 2)) {
        strt = 0;
        stp = Math.PI * 2;
    }
    const ellipseInc = (Math.PI * 2) / o.curveStepCount;
    const arcInc = Math.min(ellipseInc / 2, (stp - strt) / 2);
    const o1 = _arc(arcInc, cx, cy, rx, ry, strt, stp, 1, o);
    const o2 = _arc(arcInc, cx, cy, rx, ry, strt, stp, 1.5, o);
    let ops = o1.concat(o2);
    if (closed) {
        if (roughClosure) {
            ops = ops.concat(_doubleLine(cx, cy, cx + rx * Math.cos(strt), cy + ry * Math.sin(strt), o));
            ops = ops.concat(_doubleLine(cx, cy, cx + rx * Math.cos(stp), cy + ry * Math.sin(stp), o));
        }
        else {
            ops.push({ op: 'lineTo', data: [cx, cy] });
            ops.push({ op: 'lineTo', data: [cx + rx * Math.cos(strt), cy + ry * Math.sin(strt)] });
        }
    }
    return { type: 'path', ops };
}
export function svgPath(path, o) {
    path = (path || '').replace(/\n/g, ' ').replace(/(-\s)/g, '-').replace('/(\s\s)/g', ' ');
    let p = new RoughPath(path);
    if (o.simplification) {
        const fitter = new PathFitter(p.linearPoints, p.closed);
        const d = fitter.fit(o.simplification);
        p = new RoughPath(d);
    }
    let ops = [];
    const segments = p.segments || [];
    for (let i = 0; i < segments.length; i++) {
        const s = segments[i];
        const prev = i > 0 ? segments[i - 1] : null;
        const opList = _processSegment(p, s, prev, o);
        if (opList && opList.length) {
            ops = ops.concat(opList);
        }
    }
    return { type: 'path', ops };
}
// Fills
export function solidFillPolygon(points, o) {
    const ops = [];
    if (points.length) {
        const offset = o.maxRandomnessOffset || 0;
        const len = points.length;
        if (len > 2) {
            ops.push({ op: 'move', data: [points[0][0] + _offsetOpt(offset, o), points[0][1] + _offsetOpt(offset, o)] });
            for (let i = 1; i < len; i++) {
                ops.push({ op: 'lineTo', data: [points[i][0] + _offsetOpt(offset, o), points[i][1] + _offsetOpt(offset, o)] });
            }
        }
    }
    return { type: 'fillPath', ops };
}
export function patternFillPolygon(points, o) {
    return getFiller(o, helper).fillPolygon(points, o);
}
export function patternFillArc(x, y, width, height, start, stop, o) {
    const cx = x;
    const cy = y;
    let rx = Math.abs(width / 2);
    let ry = Math.abs(height / 2);
    rx += _offsetOpt(rx * 0.01, o);
    ry += _offsetOpt(ry * 0.01, o);
    let strt = start;
    let stp = stop;
    while (strt < 0) {
        strt += Math.PI * 2;
        stp += Math.PI * 2;
    }
    if ((stp - strt) > (Math.PI * 2)) {
        strt = 0;
        stp = Math.PI * 2;
    }
    const increment = (stp - strt) / o.curveStepCount;
    const points = [];
    for (let angle = strt; angle <= stp; angle = angle + increment) {
        points.push([cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)]);
    }
    points.push([cx + rx * Math.cos(stp), cy + ry * Math.sin(stp)]);
    points.push([cx, cy]);
    return patternFillPolygon(points, o);
}
export function randOffset(x, o) {
    return _offsetOpt(x, o);
}
export function randOffsetWithRange(min, max, o) {
    return _offset(min, max, o);
}
export function doubleLineOps(x1, y1, x2, y2, o) {
    return _doubleLine(x1, y1, x2, y2, o);
}
// Private helpers
function random(ops) {
    if (!ops.randomizer) {
        ops.randomizer = new Random(ops.seed || 0);
    }
    return ops.randomizer.next();
}
function _offset(min, max, ops) {
    return ops.roughness * ops.roughnessGain * ((random(ops) * (max - min)) + min);
}
function _offsetOpt(x, ops) {
    return _offset(-x, x, ops);
}
function _doubleLine(x1, y1, x2, y2, o) {
    const o1 = _line(x1, y1, x2, y2, o, true, false);
    const o2 = _line(x1, y1, x2, y2, o, true, true);
    return o1.concat(o2);
}
function _line(x1, y1, x2, y2, o, move, overlay) {
    const lengthSq = Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
    const length = Math.sqrt(lengthSq);
    if (length < 200) {
        o.roughnessGain = 1;
    }
    else if (length > 500) {
        o.roughnessGain = 0.4;
    }
    else {
        o.roughnessGain = (-0.0016668) * length + 1.233334;
    }
    let offset = o.maxRandomnessOffset || 0;
    if ((offset * offset * 100) > lengthSq) {
        offset = length / 10;
    }
    const halfOffset = offset / 2;
    const divergePoint = 0.2 + random(o) * 0.2;
    let midDispX = o.bowing * o.maxRandomnessOffset * (y2 - y1) / 200;
    let midDispY = o.bowing * o.maxRandomnessOffset * (x1 - x2) / 200;
    midDispX = _offsetOpt(midDispX, o);
    midDispY = _offsetOpt(midDispY, o);
    const ops = [];
    const randomHalf = () => _offsetOpt(halfOffset, o);
    const randomFull = () => _offsetOpt(offset, o);
    if (move) {
        if (overlay) {
            ops.push({
                op: 'move', data: [
                    x1 + randomHalf(),
                    y1 + randomHalf()
                ]
            });
        }
        else {
            ops.push({
                op: 'move', data: [
                    x1 + _offsetOpt(offset, o),
                    y1 + _offsetOpt(offset, o)
                ]
            });
        }
    }
    if (overlay) {
        ops.push({
            op: 'bcurveTo', data: [
                midDispX + x1 + (x2 - x1) * divergePoint + randomHalf(),
                midDispY + y1 + (y2 - y1) * divergePoint + randomHalf(),
                midDispX + x1 + 2 * (x2 - x1) * divergePoint + randomHalf(),
                midDispY + y1 + 2 * (y2 - y1) * divergePoint + randomHalf(),
                x2 + randomHalf(),
                y2 + randomHalf()
            ]
        });
    }
    else {
        ops.push({
            op: 'bcurveTo', data: [
                midDispX + x1 + (x2 - x1) * divergePoint + randomFull(),
                midDispY + y1 + (y2 - y1) * divergePoint + randomFull(),
                midDispX + x1 + 2 * (x2 - x1) * divergePoint + randomFull(),
                midDispY + y1 + 2 * (y2 - y1) * divergePoint + randomFull(),
                x2 + randomFull(),
                y2 + randomFull()
            ]
        });
    }
    return ops;
}
function _curveWithOffset(points, offset, o) {
    const ps = [];
    ps.push([
        points[0][0] + _offsetOpt(offset, o),
        points[0][1] + _offsetOpt(offset, o),
    ]);
    ps.push([
        points[0][0] + _offsetOpt(offset, o),
        points[0][1] + _offsetOpt(offset, o),
    ]);
    for (let i = 1; i < points.length; i++) {
        ps.push([
            points[i][0] + _offsetOpt(offset, o),
            points[i][1] + _offsetOpt(offset, o),
        ]);
        if (i === (points.length - 1)) {
            ps.push([
                points[i][0] + _offsetOpt(offset, o),
                points[i][1] + _offsetOpt(offset, o),
            ]);
        }
    }
    return _curve(ps, null, o);
}
function _curve(points, closePoint, o) {
    const len = points.length;
    let ops = [];
    if (len > 3) {
        const b = [];
        const s = 1 - o.curveTightness;
        ops.push({ op: 'move', data: [points[1][0], points[1][1]] });
        for (let i = 1; (i + 2) < len; i++) {
            const cachedVertArray = points[i];
            b[0] = [cachedVertArray[0], cachedVertArray[1]];
            b[1] = [cachedVertArray[0] + (s * points[i + 1][0] - s * points[i - 1][0]) / 6, cachedVertArray[1] + (s * points[i + 1][1] - s * points[i - 1][1]) / 6];
            b[2] = [points[i + 1][0] + (s * points[i][0] - s * points[i + 2][0]) / 6, points[i + 1][1] + (s * points[i][1] - s * points[i + 2][1]) / 6];
            b[3] = [points[i + 1][0], points[i + 1][1]];
            ops.push({ op: 'bcurveTo', data: [b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]] });
        }
        if (closePoint && closePoint.length === 2) {
            const ro = o.maxRandomnessOffset;
            ops.push({ op: 'lineTo', data: [closePoint[0] + _offsetOpt(ro, o), closePoint[1] + _offsetOpt(ro, o)] });
        }
    }
    else if (len === 3) {
        ops.push({ op: 'move', data: [points[1][0], points[1][1]] });
        ops.push({
            op: 'bcurveTo', data: [
                points[1][0], points[1][1],
                points[2][0], points[2][1],
                points[2][0], points[2][1]
            ]
        });
    }
    else if (len === 2) {
        ops = ops.concat(_doubleLine(points[0][0], points[0][1], points[1][0], points[1][1], o));
    }
    return ops;
}
function _computeEllipsePoints(increment, cx, cy, rx, ry, offset, overlap, o) {
    const corePoints = [];
    const allPoints = [];
    const radOffset = _offsetOpt(0.5, o) - (Math.PI / 2);
    allPoints.push([
        _offsetOpt(offset, o) + cx + 0.9 * rx * Math.cos(radOffset - increment),
        _offsetOpt(offset, o) + cy + 0.9 * ry * Math.sin(radOffset - increment)
    ]);
    for (let angle = radOffset; angle < (Math.PI * 2 + radOffset - 0.01); angle = angle + increment) {
        const p = [
            _offsetOpt(offset, o) + cx + rx * Math.cos(angle),
            _offsetOpt(offset, o) + cy + ry * Math.sin(angle)
        ];
        corePoints.push(p);
        allPoints.push(p);
    }
    allPoints.push([
        _offsetOpt(offset, o) + cx + rx * Math.cos(radOffset + Math.PI * 2 + overlap * 0.5),
        _offsetOpt(offset, o) + cy + ry * Math.sin(radOffset + Math.PI * 2 + overlap * 0.5)
    ]);
    allPoints.push([
        _offsetOpt(offset, o) + cx + 0.98 * rx * Math.cos(radOffset + overlap),
        _offsetOpt(offset, o) + cy + 0.98 * ry * Math.sin(radOffset + overlap)
    ]);
    allPoints.push([
        _offsetOpt(offset, o) + cx + 0.9 * rx * Math.cos(radOffset + overlap * 0.5),
        _offsetOpt(offset, o) + cy + 0.9 * ry * Math.sin(radOffset + overlap * 0.5)
    ]);
    return [allPoints, corePoints];
}
function _arc(increment, cx, cy, rx, ry, strt, stp, offset, o) {
    const radOffset = strt + _offsetOpt(0.1, o);
    const points = [];
    points.push([
        _offsetOpt(offset, o) + cx + 0.9 * rx * Math.cos(radOffset - increment),
        _offsetOpt(offset, o) + cy + 0.9 * ry * Math.sin(radOffset - increment)
    ]);
    for (let angle = radOffset; angle <= stp; angle = angle + increment) {
        points.push([
            _offsetOpt(offset, o) + cx + rx * Math.cos(angle),
            _offsetOpt(offset, o) + cy + ry * Math.sin(angle)
        ]);
    }
    points.push([
        cx + rx * Math.cos(stp),
        cy + ry * Math.sin(stp)
    ]);
    points.push([
        cx + rx * Math.cos(stp),
        cy + ry * Math.sin(stp)
    ]);
    return _curve(points, null, o);
}
function _bezierTo(x1, y1, x2, y2, x, y, path, o) {
    const ops = [];
    const ros = [o.maxRandomnessOffset || 1, (o.maxRandomnessOffset || 1) + 0.5];
    let f = [0, 0];
    for (let i = 0; i < 2; i++) {
        if (i === 0) {
            ops.push({ op: 'move', data: [path.x, path.y] });
        }
        else {
            ops.push({ op: 'move', data: [path.x + _offsetOpt(ros[0], o), path.y + _offsetOpt(ros[0], o)] });
        }
        f = [x + _offsetOpt(ros[i], o), y + _offsetOpt(ros[i], o)];
        ops.push({
            op: 'bcurveTo', data: [
                x1 + _offsetOpt(ros[i], o), y1 + _offsetOpt(ros[i], o),
                x2 + _offsetOpt(ros[i], o), y2 + _offsetOpt(ros[i], o),
                f[0], f[1]
            ]
        });
    }
    path.setPosition(f[0], f[1]);
    return ops;
}
function _processSegment(path, seg, prevSeg, o) {
    let ops = [];
    switch (seg.key) {
        case 'M':
        case 'm': {
            const delta = seg.key === 'm';
            if (seg.data.length >= 2) {
                let x = +seg.data[0];
                let y = +seg.data[1];
                if (delta) {
                    x += path.x;
                    y += path.y;
                }
                const ro = 1 * (o.maxRandomnessOffset || 0);
                x = x + _offsetOpt(ro, o);
                y = y + _offsetOpt(ro, o);
                path.setPosition(x, y);
                ops.push({ op: 'move', data: [x, y] });
            }
            break;
        }
        case 'L':
        case 'l': {
            const delta = seg.key === 'l';
            if (seg.data.length >= 2) {
                let x = +seg.data[0];
                let y = +seg.data[1];
                if (delta) {
                    x += path.x;
                    y += path.y;
                }
                ops = ops.concat(_doubleLine(path.x, path.y, x, y, o));
                path.setPosition(x, y);
            }
            break;
        }
        case 'H':
        case 'h': {
            const delta = seg.key === 'h';
            if (seg.data.length) {
                let x = +seg.data[0];
                if (delta) {
                    x += path.x;
                }
                ops = ops.concat(_doubleLine(path.x, path.y, x, path.y, o));
                path.setPosition(x, path.y);
            }
            break;
        }
        case 'V':
        case 'v': {
            const delta = seg.key === 'v';
            if (seg.data.length) {
                let y = +seg.data[0];
                if (delta) {
                    y += path.y;
                }
                ops = ops.concat(_doubleLine(path.x, path.y, path.x, y, o));
                path.setPosition(path.x, y);
            }
            break;
        }
        case 'Z':
        case 'z': {
            if (path.first) {
                ops = ops.concat(_doubleLine(path.x, path.y, path.first[0], path.first[1], o));
                path.setPosition(path.first[0], path.first[1]);
                path.first = null;
            }
            break;
        }
        case 'C':
        case 'c': {
            const delta = seg.key === 'c';
            if (seg.data.length >= 6) {
                let x1 = +seg.data[0];
                let y1 = +seg.data[1];
                let x2 = +seg.data[2];
                let y2 = +seg.data[3];
                let x = +seg.data[4];
                let y = +seg.data[5];
                if (delta) {
                    x1 += path.x;
                    x2 += path.x;
                    x += path.x;
                    y1 += path.y;
                    y2 += path.y;
                    y += path.y;
                }
                const ob = _bezierTo(x1, y1, x2, y2, x, y, path, o);
                ops = ops.concat(ob);
                path.bezierReflectionPoint = [x + (x - x2), y + (y - y2)];
            }
            break;
        }
        case 'S':
        case 's': {
            const delta = seg.key === 's';
            if (seg.data.length >= 4) {
                let x2 = +seg.data[0];
                let y2 = +seg.data[1];
                let x = +seg.data[2];
                let y = +seg.data[3];
                if (delta) {
                    x2 += path.x;
                    x += path.x;
                    y2 += path.y;
                    y += path.y;
                }
                let x1 = x2;
                let y1 = y2;
                const prevKey = prevSeg ? prevSeg.key : '';
                let ref = null;
                if (prevKey === 'c' || prevKey === 'C' || prevKey === 's' || prevKey === 'S') {
                    ref = path.bezierReflectionPoint;
                }
                if (ref) {
                    x1 = ref[0];
                    y1 = ref[1];
                }
                const ob = _bezierTo(x1, y1, x2, y2, x, y, path, o);
                ops = ops.concat(ob);
                path.bezierReflectionPoint = [x + (x - x2), y + (y - y2)];
            }
            break;
        }
        case 'Q':
        case 'q': {
            const delta = seg.key === 'q';
            if (seg.data.length >= 4) {
                let x1 = +seg.data[0];
                let y1 = +seg.data[1];
                let x = +seg.data[2];
                let y = +seg.data[3];
                if (delta) {
                    x1 += path.x;
                    x += path.x;
                    y1 += path.y;
                    y += path.y;
                }
                const offset1 = 1 * (1 + o.roughness * 0.2);
                const offset2 = 1.5 * (1 + o.roughness * 0.22);
                ops.push({ op: 'move', data: [path.x + _offsetOpt(offset1, o), path.y + _offsetOpt(offset1, o)] });
                let f = [x + _offsetOpt(offset1, o), y + _offsetOpt(offset1, o)];
                ops.push({
                    op: 'qcurveTo', data: [
                        x1 + _offsetOpt(offset1, o), y1 + _offsetOpt(offset1, o),
                        f[0], f[1]
                    ]
                });
                ops.push({ op: 'move', data: [path.x + _offsetOpt(offset2, o), path.y + _offsetOpt(offset2, o)] });
                f = [x + _offsetOpt(offset2, o), y + _offsetOpt(offset2, o)];
                ops.push({
                    op: 'qcurveTo', data: [
                        x1 + _offsetOpt(offset2, o), y1 + _offsetOpt(offset2, o),
                        f[0], f[1]
                    ]
                });
                path.setPosition(f[0], f[1]);
                path.quadReflectionPoint = [x + (x - x1), y + (y - y1)];
            }
            break;
        }
        case 'T':
        case 't': {
            const delta = seg.key === 't';
            if (seg.data.length >= 2) {
                let x = +seg.data[0];
                let y = +seg.data[1];
                if (delta) {
                    x += path.x;
                    y += path.y;
                }
                let x1 = x;
                let y1 = y;
                const prevKey = prevSeg ? prevSeg.key : '';
                let ref = null;
                if (prevKey === 'q' || prevKey === 'Q' || prevKey === 't' || prevKey === 'T') {
                    ref = path.quadReflectionPoint;
                }
                if (ref) {
                    x1 = ref[0];
                    y1 = ref[1];
                }
                const offset1 = 1 * (1 + o.roughness * 0.2);
                const offset2 = 1.5 * (1 + o.roughness * 0.22);
                ops.push({ op: 'move', data: [path.x + _offsetOpt(offset1, o), path.y + _offsetOpt(offset1, o)] });
                let f = [x + _offsetOpt(offset1, o), y + _offsetOpt(offset1, o)];
                ops.push({
                    op: 'qcurveTo', data: [
                        x1 + _offsetOpt(offset1, o), y1 + _offsetOpt(offset1, o),
                        f[0], f[1]
                    ]
                });
                ops.push({ op: 'move', data: [path.x + _offsetOpt(offset2, o), path.y + _offsetOpt(offset2, o)] });
                f = [x + _offsetOpt(offset2, o), y + _offsetOpt(offset2, o)];
                ops.push({
                    op: 'qcurveTo', data: [
                        x1 + _offsetOpt(offset2, o), y1 + _offsetOpt(offset2, o),
                        f[0], f[1]
                    ]
                });
                path.setPosition(f[0], f[1]);
                path.quadReflectionPoint = [x + (x - x1), y + (y - y1)];
            }
            break;
        }
        case 'A':
        case 'a': {
            const delta = seg.key === 'a';
            if (seg.data.length >= 7) {
                const rx = +seg.data[0];
                const ry = +seg.data[1];
                const angle = +seg.data[2];
                const largeArcFlag = +seg.data[3];
                const sweepFlag = +seg.data[4];
                let x = +seg.data[5];
                let y = +seg.data[6];
                if (delta) {
                    x += path.x;
                    y += path.y;
                }
                if (x === path.x && y === path.y) {
                    break;
                }
                if (rx === 0 || ry === 0) {
                    ops = ops.concat(_doubleLine(path.x, path.y, x, y, o));
                    path.setPosition(x, y);
                }
                else {
                    for (let i = 0; i < 1; i++) {
                        const arcConverter = new RoughArcConverter([path.x, path.y], [x, y], [rx, ry], angle, largeArcFlag ? true : false, sweepFlag ? true : false);
                        let segment = arcConverter.getNextSegment();
                        while (segment) {
                            const ob = _bezierTo(segment.cp1[0], segment.cp1[1], segment.cp2[0], segment.cp2[1], segment.to[0], segment.to[1], path, o);
                            ops = ops.concat(ob);
                            segment = arcConverter.getNextSegment();
                        }
                    }
                }
            }
            break;
        }
        default:
            break;
    }
    return ops;
}
