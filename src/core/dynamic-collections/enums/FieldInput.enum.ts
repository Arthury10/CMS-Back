import { registerEnumType } from '@nestjs/graphql'

export type FieldInputType =
  | 'text'
  | 'number'
  | 'date'
  | 'tabs'
  | 'relationship'
  | 'checkbox'
  | 'textarea'
  | 'radio'
  | 'select'
  | 'email'
  | 'password'
  | 'array'
  | 'blocks'
  | 'file'
  | 'group'
  | 'richtext'
  | 'color'

export enum FieldInputEnum {
  TEXT = 'text',
  DATE = 'date',
  NUMBER = 'number',
  TABS = 'tabs',
  RELATIONSHIP = 'relationship',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  RADIO = 'radio',
  SELECT = 'select',
  EMAIL = 'email',
  PASSWORD = 'password',
  ARRAY = 'array',
  BLOCKS = 'blocks',
  FILE = 'file',
  GROUP = 'group',
  RICHTEXT = 'richtext',
  COLOR = 'color'
}

registerEnumType(FieldInputEnum, {
  name: 'FieldInputType'
})
