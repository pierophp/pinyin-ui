import { BlockInterface } from '../../../core/interfaces/block.interface';

export interface TextInterface {
  blocks?: BlockInterface[];
  originalText?: string;
  text?: string;
  large?: string;
  small?: string;
  type?: string;
  footnote?: string;
}
