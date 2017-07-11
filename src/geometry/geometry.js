/**
 * @author yewmint
 */

import _ from 'lodash'

/**
 * Point Object
 * @example
 * import { Point } from './geometry'
 * let p = new Point(2, 3)
 * painter.paint(p)
 */
export class Point {
  /**
   * @param {number} x x axis
   * @param {number} y y axis
   */
  constructor (x, y){
    /**
     * @type {number} x x axis
     */
    this.x = x

    /**
     * @type {number} y y axis
     */
    this.y = y
  }

  /**
   * return distance between this point and another point
   * @param {Point} point another point
   * @return {number} distance
   */
  distance (point){
    dx = point.x - this.x
    dy = point.y - this.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * return if this point is same with another point
   * @param {Point} point another point
   * @return {bool} whether they are the same
   */
  same (point){
    return point.x === this.x && point.y === this.y
  }

  /**
   * return a clone of this point
   * @return {Point} cloned point
   */
  clone (){
    return new Point(this.x, this.y)
  }

  /**
   * return a new point with offsets
   * @param {number} x x axis offset
   * @param {number} y y axis offset
   * @return {Point} point with offsets
   */
  offset (x, y){
    return new Point(this.x + x, this.y + y)
  }
}

/**
 * Vertex Object
 */
export class Vertex extends Point{
  /**
   * @param {number} x x axis
   * @param {number} y y axis
   * @param {Segment} segOut segment whose tail is this vertex
   * @param {Segment} segOut segment whose head is this vertex
   */
  constructor (x, y, segOut = null, segIn = null){
    super(x, y)

    /**
     * @type {Segment} segOut segment whose tail is this vertex
     */
    this.segOut = segOut

    /**
     * @type {Segment} segOut segment whose head is this vertex
     */
    this.segIn = segIn
  }

  /**
   * return a clone of this vertex
   * @return {Vertex} cloned vertex
   */
  clone (){
    return new Vertex(this.x, this.y, this.segOut, this.segIn)
  }

  /**
   * return a new vertex with offsets
   * @param {number} x x axis offset
   * @param {number} y y axis offset
   * @return {Vertex} vertex with offsets
   */
  offset (x, y){
    return new Vertex(this.x + x, this.y + y, this.segOut, this.segIn)
  }
}

/**
 * Intersection Point of 2 Segments
 */
export class Intersection extends Point{
  /**
   * @param {number} x x axis
   * @param {number} y y axis
   * @param {Segment} segA segment A
   * @param {Segment} segB segment B
   */
  constructor (x, y, segA = null, segB = null){
    super(x, y)

    /**
     * @type {Segment} segA segment A
     */
    this.segA = segA

    /**
     * @type {Segment} segB segment B
     */
    this.segB = segB
  }

  /**
   * return a clone of this intersection
   * @return {Intersection} cloned intersection
   */
  clone (){
    return new Intersection(this.x, this.y, this.segA, this.segB)
  }

  /**
   * return a new intersection with offsets
   * @param {number} x x axis offset
   * @param {number} y y axis offset
   * @return {Intersection} intersection with offsets
   */
  offset (x, y){
    return new Intersection(this.x + x, this.y + y, this.segA, this.segB)
  }
}

/**
 * Segment Object
 */
export class Segment{
  /**
   * @param {Vertex} vtxA tail vertex of segment
   * @param {number} vtxB head vertex of segment
   */
  constructor (vtxA, vtxB){
    /**
     * @type {Vertex} vtxA tail vertex of segment
     */
    this.vtxA = vtxA

    /**
     * @type {Vertex} vtxB head vertex of segment
     */
    this.vtxB = vtxB
  }

  /**
   * get 2d vector of this segment
   * @return {Vector2} 2d vector of this segment
   */
  vec2 (){
    return Vector2.fromPoints(this.vtxA, this.vtxB)
  }

  /**
   * get 2d vector of this segment
   * @return {Vector3} 3d vector of this segment
   */
  vec3 (){
    return Vector2.fromPoints(this.vtxA, this.vtxB).vec3()
  }

  /**
   * determine if point lies in left side of this segment
   * @param {Point} point point
   * @return {bool} if point lies in left side
   */
  left (point){
    let va = Vector2.fromPoints(point, this.vtxA)
    let vb = Vector2.fromPoints(point, this.vtxB)
    return va.cross(vb) > 0
  }

  /**
   * determine if 2 segments are the same
   * @param {Segment} seg
   * @return {bool}
   */
  same (seg){
    return (this.vtxA.same(seg.vtxA) && this.vtxB.same(seg.vtxB)) ||
      (this.vtxA.same(seg.vtxB) && this.vtxB.same(seg.vtxA))
  }

  /**
   * get intersection of 2 segments
   * @param {Segment} seg
   * @return {Intersection}
   */
  intersect (seg){
    let segA = this
    let segB = seg

    let r_px = segA.vtxA.x
    let r_py = segA.vtxA.y
    let r_dx = segA.vtxB.x - segA.vtxA.x
    let r_dy = segA.vtxB.y - segA.vtxA.y

    let s_px = segB.vtxA.x
    let s_py = segB.vtxA.y
    let s_dx = segB.vtxB.x - segB.vtxA.x
    let s_dy = segB.vtxB.y - segB.vtxA.y

    let H = s_dx * r_dy - r_dx * s_dy

    if (H === 0) return null

    let Hrt = s_dx * (s_py - r_py) - s_dy * (s_px - r_px)
    let Hst = r_dx * (s_py - r_py) - r_dy * (s_px - r_px)

    let rt = Hrt / H
    let st = Hst / H

    if (rt < 0 || rt > 1) return null
    if (st < 0 || st > 1) return null

    let x = r_px + r_dx * rt
    let y = r_py + r_dy * rt

    return new Intersection(x, y, segA, segB)
  }
}

/**
 * Polygon Object
 */
export class Polygon{
  /**
   * @param {Point[]} points points CCW sorted
   */
  constructor (points){
    if (points.length <= 2){
      throw new Error('Polygon: needs 3 points at least.')
    }

    /**
     * vertexes of polygon
     * @type {Vertex[]} vtxs
     */
    this.vtxs = []

    for (let point of points){
      this.vtxs.push(new Vertex(point.x, point.y))
    }

    // assign segOut and segIn for each vertex
    this.vtxs.forEach((vertex, index, arr) =>{
      let nextVertex = arr[(index + 1) % arr.length]
      let prevVertex = arr[(index - 1 + arr.length) % arr.length]
      vertex.segOut = new Segment(vertex, nextVertex)
      vertex.segIn = new Segment(prevVertex, vertex)
    })
  }

  /**
   * determine if seg is one of edges of this polygon
   * @param {Segment} seg
   * @return {bool}
   */
  segOnEdge (seg){
    for (let vtx of this.vtxs){
      if (seg.same(vtx.segOut)) return true
    }
    return false
  }

  /**
   * determine if point is inside of this polygon
   * @param {Point} point
   * @return {bool}
   */
  pointInside (point){
    // if a ray from point hits an odd number of edges, the point is inside
    // this algorithm works well with concave polygon
    let ray = new Segment(point, point.offset(new Point(-10000, 0)))
    let interPoints = []
    for (let vtx of this.vtxs){
      let seg = vtx.segOut
      let inter = ray.intersect(seg)
      if (inter) interPoints.push(inter)
    }
    interPoints = _.uniq(interPoints, (point) => {
      return { x: point.x, y: point.y }
    })
    return interPoints.length % 2 === 1
  }

  /**
   * determine if seg is inside of this polygon
   * @param {Segment} seg
   * @return {bool}
   */
  segInside (seg){
    // if segment intersect with any edge, it is not inside
    // else if central point of segment is inside, either the segment
    for (let vtx of this.vtxs){
      let inter = vtx.segOut.intersect(seg)
      if (inter){
        return false
      }
    }
    let centerX = (seg.vtxA.x + seg.vtxB.x) / 2
    let centerY = (seg.vtxA.y + seg.vtxB.y) / 2
    let center = new Point(centerX, centerY)
    return this.pointInside(center)
  }

  /**
   * return a clone of this polygon
   * @return {Polygon} cloned polygon
   */
  clone (){
    let points = []
    for (let vertex of this.vtxs){
      points.push(vertex.clone())
    }
    return new Polygon(points)
  }

  /**
   * return a new polygon with offsets
   * @param {number} x x axis offset
   * @param {number} y y axis offset
   * @return {Polygon} polygon with offsets
   */
  offset (x, y){
    let points = []
    for (let vertex of this.vtxs){
      points.push(vertex.offset(x, y))
    }
    return new Polygon(points)
  }
}

/**
 * 2D Vector Object
 */
export class Vector2 {
  /**
   * create vector from point to point
   * @param {Point} pointA tail point
   * @param {Point} pointB head point
   * @return {Vector2}
   */
  static fromPoints (pointA, pointB){
    let dx = pointB.x - pointA.x
    let dy = pointB.y - pointA.y
    return new Vector2(dx, dy)
  }

  /**
   * @param {number} x x component
   * @param {number} y y component
   */
  constructor (x, y){
    /**
     * @type {number} x x component
     */
    this.x = x

    /**
     * @type {number} y y component
     */
    this.y = y
  }

  /**
   * create a perpendicular vector of this vector
   * @return {Vector2}
   */
  perpendicular (){
    return new Vector2(this.y, -this.x)
  }

  /**
   * create a normalized vector of this vector
   * @return {Vector2}
   */
  normalize (){
    let length = this.length()
    return new Vector2(this.x / length, this.y / length)
  }

  /**
   * dot product with another vector
   * @param {Vector2} vec
   * @return {number}
   */
  dot (vec){
    return this.x * vec.x + this.y * vec.y
  }

  /**
   * cross product with another 2d vector, return z component
   * @param {Vector2} vec
   * @return {number}
   */
  cross (vec){
    return this.vec3().cross(vec.vec3()).z
  }

  /**
   * get radians between this vector and another vector
   * @param {Vector2} vec
   * @return {number}
   */
  radians (vec){
    let dot = this.dot(vec)
    let cosVal = dot / this.distance() / vec.distance()
    return Math.acos(cosVal)
  }

  /**
   * get length of this vector
   * @return {number}
   */
  length (){
    new Point(0, 0).distance(new Point(this.x, this.y))
  }

  /**
   * get 3D vector of this vector
   * @return {Vector3}
   */
  vec3 (){
    return new Vector3(this.x, this.y, 0)
  }

  /**
   * add 2 2d vectors
   * @param {Vector2} vec
   * @return {Vector2}
   */
  add (vec){
    return new Vector2(this.x + vec.x, this.y + vec.y)
  }

  /**
   * determine if angle between this vector and another vector is acute
   * @param {Vector2} vec
   * @return {bool}
   */
  acuteAngle (vec){
    return this.cross(vec) > 0
  }
}

/**
 * 3D Vector Object
 */
export class Vector3 {
  /**
   * @param {number} x x component
   * @param {number} y y component
   * @param {number} z z component
   */
  constructor (x, y, z){
    /**
     * x component
     * @type {number} x
     */
    this.x = x

    /**
     * y component
     * @type {number} y
     */
    this.y = y

    /**
     * z component
     * @type {number} z
     */
    this.z = z
  }

  /**
   * cross product with another ed vector, return new 3d vector
   * @param {Vector3} vec
   * @return {Vector3}
   */
  cross (vec){
    let vecA = this
    let vecB = vec
    let x = vecA.y * vecB.z - vecA.z * vecB.y
    let y = vecA.z * vecB.x - vecA.x * vecB.z
    let z = vecA.x * vecB.y - vecA.y * vecB.x
    return new Vector3(x, y, z)
  }
}
