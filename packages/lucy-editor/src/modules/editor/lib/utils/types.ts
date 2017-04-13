
// ============== Composition definition

export type PathType = string []

export interface ElementsType {
  [ key: string ]: ElementType
}

export interface PositionedElementType {
  p: number
}

export interface PositionedElementsType {
  [ key: string ]: PositionedElementType
}

export interface ElementOptionsType {
  h: number
}

export interface GroupElementType extends PositionedElementType {
  t: string 
  i: ElementsType
  o?: ElementOptionsType
}

export interface StringElementType extends PositionedElementType {
  t: string 
  i: string
  o?: ElementOptionsType
}

export type ElementType = GroupElementType | StringElementType

export function isStringElement
( elem: ElementType
): elem is StringElementType {
  return typeof elem.i === 'string'
}

export function isGroupElement
( elem: ElementType
): elem is GroupElementType {
  return typeof elem.i === 'object'
}


export interface ElementRefType {
  path: PathType
  elem: ElementType
}

export interface StringElementRefType {
  path: PathType
  elem: StringElementType
}

export interface ElementNamedType {
  ref: string
  elem: ElementType
}



export interface CompositionType {
  i: ElementsType
}

// ============== Selections

export interface SelectionPositionType {
  top: number
  left: number
}

export interface CaretSelectionType {
  type: 'Caret'
  anchorPath: PathType
  anchorOffset: number
  anchorValue?: string
  position: SelectionPositionType
}

export interface RangeSelectionType {
  type: 'Range'
  anchorPath: PathType
  anchorOffset: number
  anchorValue?: string
  focusPath: PathType
  focusOffset: number
  position: SelectionPositionType
}

export type SelectionType = CaretSelectionType | RangeSelectionType

// ============== Operations

export interface SelectOperationType {
  op: 'select' 
  value: SelectionType
}

export interface UpdateOperationType {
  op: 'update'
  path: PathType
  value: ElementType
}

export interface DeleteOperationType {
  op: 'delete'
  path: PathType
}

export interface ToolboxOpType {
  type: 'ParagraphEmpty' | 'Paragraph' | 'Select'
  position: SelectionPositionType
}

interface ToolboxNoneType {
  type: 'None'
}

export type ToolboxOperationValueType = ToolboxOpType | ToolboxNoneType

export interface ToolboxOperationType {
  op: 'toolbox'
  value: ToolboxOperationValueType
}

export type OperationType = SelectOperationType | UpdateOperationType | DeleteOperationType | ToolboxOperationType

export type OperationsType = OperationType []

export interface DoOperationType {
  // Not sure about these definitions
  ref: string
  elem: ElementType
}