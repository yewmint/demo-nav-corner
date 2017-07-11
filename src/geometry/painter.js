/**
 * @author yewmint
 */

import { Point } from './geometry'

/**
 * Painter Object
 */
export class Painter {
  /**
   * @param {string} parentId id of parent element
   * @param {number} width width of canvas
   * @param {number} height height of canvas
   */
  constructor (parentId, width, height){
    let parent = document.getElementById(parentId)
    let canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    parent.appendChild(canvas)

    /**
     * canvas where painter paints
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas

    /**
     * width of canvas
     * @type {number}
     */
    this.width = width

    /**
     * height of canvas
     * @type {number}
     */
    this.height = height

    /**
     * context of canvs
     * @type {CanvasRenderingContext2D}
     */
    this.context = canvas.getContext('2d')

    /**
     * color of stroke and fill
     * @type {stirng}
     */
    this.color = '#888888'

    /**
     * x axis of cursor
     * @type {number}
     */
    this.x = 0

    /**
     * y axis of cursor
     * @type {number}
     */
    this.y = 0

    this._enableCursor()
  }

  /**
   * set color of painter
   * @param {string} color
   */
  setColor (color){
    this.color = color
  }

  /**
   * paint a point
   * @param {Point} point
   */
  paintPoint (point){
    let p = this._convCoord(point)
    let context = this.context
    context.save()
    context.fillStyle = this.color
    context.beginPath()
    context.arc(p.x, p.y, 5, 0, 2 * Math.PI)
    context.fill()
    context.restore()
  }

  /**
   * paint a segment
   * @param {Segment} seg
   */
  paintSeg (seg){
    let context = this.context
    let pointA = this._convCoord(seg.vtxA)
    let pointB = this._convCoord(seg.vtxB)
    context.save()
    context.beginPath()
    context.strokeStyle = this.color
    context.moveTo(pointA.x, pointA.y)
    context.lineTo(pointB.x, pointB.y)
    context.stroke()
    context.restore()
  }

  /**
   * paint a polygon
   * @param {Polygon} poly
   */
  paintPolygon (poly){
    for (let vtx of poly.vtxs){
      this.paintSeg(vtx.segOut)
    }
  }

  /**
   * clear canvas
   */
  clear (){
    this.context.clearRect(0, 0, this.width, this.height)
  }

  /**
   * get position of cursor
   * @return {Point} cursor position
   */
  getCursor (){
    return new Point(this.x, this.y)
  }

  /**
   * convert window coordinates to Cartesian coordiantes
   * @private
   * @param {Point} point window coordinates
   * @return {Point} Cartesian coordiantes
   */
  _convCoord (point){
    return new Point(point.x, this.height - point.y)
  }

  /**
   * callback for cursor positioning
   * @private
   * @param {number} x x axis
   * @param {number} y y axis
   * @return {object} posiiton of cursor
   */
  _parseCursor (x, y){
    let bbox = this.canvas.getBoundingClientRect()
    return {
      x: x - bbox.left * (canvas.width / bbox.width) || 0,
      y: y - bbox.top  * (canvas.height / bbox.height) || 0
    }
  }

  /**
   * enable cursor positioning
   * @private
   */
  _enableCursor (){
    let canvas = this.canvas
    canvas.addEventListener("mousemove", (e)=> {
      let x = e.clientX
      let y = e.clientY
      let bbox = canvas.getBoundingClientRect()
      this.x = x - bbox.left * (canvas.width / bbox.width) || 0
      y = y - bbox.top * (canvas.height / bbox.height) || 0
      this.y = this.height - y
    }, false)
  }
}
