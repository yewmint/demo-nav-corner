/**
 * @author yewmint
 */
import { Point, Segment, Polygon, Painter, Vector2 } from './geometry'

let painter = new Painter('painter', 250, 250)

// create first square
let pa = new Polygon([
  new Point(50, 50),
  new Point(100, 50),
  new Point(100, 100),
  new Point(50, 100),
])

// create other squares with offset
let pb = pa.offset(50, 0)
let pc = pb.offset(50, 0)
let pd = pc.offset(0, 50)
let pe = pd.offset(0, 50)

// paint all squares on the screen
painter.paintPolygon(pa)
painter.paintPolygon(pb)
painter.paintPolygon(pc)
painter.paintPolygon(pd)
painter.paintPolygon(pe)

// get all edges of mesh-nav
let edges = [
  pa.vtxs[1].segOut,
  pb.vtxs[1].segOut,
  pc.vtxs[2].segOut,
  pd.vtxs[2].segOut,
]

// paint all edges in cyan
painter.setColor('cyan')
for (let seg of edges){
  painter.paintSeg(seg)
}

// determine start-point and end-point of navigation
let startPoint = new Point(75, 75)
let endPoint = new Point(175, 175)

painter.setColor('aquamarine')
painter.paintPoint(startPoint)
painter.paintPoint(endPoint)

/**
 * get next corner point of mesh-nav
 * @param {Point} startpt current start-point
 * @param {Segment[]} segs edges for searching current corner point
 * @param {Point} endpt current end-point
 */
const getConer = function (startpt, segs, endpt){
  // no corner point if startpt and endpt are in convex polygon
  if (segs.length <= 0) return null

  let oapt = segs[0].vtxA
  let obpt = segs[0].vtxB
  let idx = 0

  // if there are 2 segments at least, find the overlapped field of view
  while(++idx < segs.length){
    let vecoa = Vector2.fromPoints(startpt, oapt)
    let vecob = Vector2.fromPoints(startpt, obpt)
    let vecea = Vector2.fromPoints(startpt, segs[idx].vtxA)
    let veceb = Vector2.fromPoints(startpt, segs[idx].vtxB)

    if (vecoa.acuteAngle(vecea)){
      if (vecob.acuteAngle(vecea)){
        return {
          pt: obpt,
          segs: segs.slice(idx)
        }
      }
      else if (vecob.acuteAngle(veceb)){
        oapt = segs[idx].vtxA
      }
      else {
        oapt = segs[idx].vtxA
        obpt = segs[idx].vtxB
      }
    }
    else if (vecoa.acuteAngle(veceb)){
      if (vecob.acuteAngle(veceb)){

      }
      else {
        obpt = segs[idx].vtxB
      }
    }
    else {
      return {
        pt: oapt,
        segs: seg.slice(idx)
      }
    }
  }

  // if there's only 1 segment, find the ray to the end-point
  let vece = Vector2.fromPoints(startpt, endpt)
  let vecoa = Vector2.fromPoints(startpt, oapt)
  let vecob = Vector2.fromPoints(startpt, obpt)
  if (vece.acuteAngle(vecoa)){
    return {
      pt: oapt,
      segs: []
    }
  }
  else if (vece.acuteAngle(vecob)){
    return null
  }
  else {
    return {
      pt: obpt,
      segs: []
    }
  }
}

let searched = false

// bind search-function into window
window.nav = function (){
  if (searched) return
  searched = true

  let startpt = startPoint
  let endpt = endPoint
  let segs = edges

  let corners = []

  // continuously search for corner until null is returned
  let tmpReturn = null
  while (tmpReturn = getConer(startpt, segs, endpt)){
    startpt = tmpReturn.pt
    segs = tmpReturn.segs
    corners.push(tmpReturn.pt)
  }

  // paint all paths
  painter.setColor('deeppink')
  let pspt = startPoint
  for (let corner of corners){
    let seg = new Segment(pspt, corner)
    painter.paintSeg(seg)
    pspt = corner
  }
  let seg = new Segment(pspt, endpt)
  painter.paintSeg(seg)
}
