import { Vector2, Point } from './geometry'

/**
 * Filed of View object, whose angle must be in (0, 180)
 * @deprecated
 */
export class ViewField {
  /**
   * create ViewField from 2 vectors
   * @param {Vector2} vecA start vector
   * @param {Vector2} vecB end vector
   * @return {ViewField}
   */
  static fromVecs(vecA, vecB){
    let origin = new Point(0, 0)
    let pointA = new Point(vecA.x, vecA.y)
    let pointB = new Point(vecB.x, vecB.y)
    return new ViewField(origin, pointA, pointB)
  }

  /**
   * @param {Point} origin origin of view
   * @param {Point} pointA start point of view
   * @param {Point} pointB end point of view
   */
  constructor (origin, pointA, pointB){
    /**
     * start vector
     * @type {Vector2} vecA
     */
    this.vecA = Vector2.fromPoints(origin, pointA)

    /**
     * end vector
     * @type {Vector2} vecB
     */
    this.vecB = Vector2.fromPoints(origin, pointB)

    if (this.vecA.cross(this.vecB) <= 0){
      throw new Error('ViewField: angle of view must be in (0, 180)')
    }
  }

  /**
   * get bisector of this field of view
   * @return {Vector2}
   */
  bisector (){
    let nvecA = this.vecA.normalize()
    let nvecB = this.vecB.normalize()
    return nvecA.add(nvecB)
  }

  // /**
  //  * determine if this view intersect with another view
  //  * @param {ViewField} vf
  //  * @return {bool}
  //  */
  // intersect (vf){
  //   return this.vecA.acuteAngle(vf.vecB) || this.vecB.acuteAngle(vf.vecA)
  // }
  //
  // /**
  //  * get overlapped field of view of 2 ViewFields
  //  * @param {ViewField} vf
  //  * @return {ViewField|null}
  //  */
  // overlap (vf){
  //   if (this.vecA.acuteAngle(vf.vecB) && ){
  //     return ViewField.fromVecs(this.vecA, vf.vecB)
  //   }
  //   else if (this.vecB.acuteAngle(vf.vecA)){
  //     return ViewField.fromVecs(this.vecB, vf.vecA)
  //   }
  //   return null
  // }

  /**
   * determine if vf is on left of this ViewField
   * @param {ViewField} vf
   * @return {bool}
   */
  left (vf){
    let bisA = this.bisector()
    let bisB = vf.bisector()

    return bisA.acuteAngle(bisB)
  }
}
