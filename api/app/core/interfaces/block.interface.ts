export interface BlockInterface {
  line?: {
    type?: string;
  };
  c: string;
  p: string;
  b?: string;
  large?: string;
  small?: string;
  trans?: string;
  footnote?: string;
  isBold?: number;
  isItalic?: number;
}
