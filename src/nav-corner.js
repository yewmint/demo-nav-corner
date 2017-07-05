import { ViewField, Point } from './geometry'

let origin = new Point(0, 0)
let pta = new Point(1, 0)
let ptb = new Point(2, 1)
let ptc = new Point(1, 2)
let ptd = new Point(0, 1)

let vfa = new ViewField(origin, pta, ptc)
let vfb = new ViewField(origin, ptb, ptd)

console.log(vfa.overlap(vfb))
