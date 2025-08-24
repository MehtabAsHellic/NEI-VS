/**
 * Simple byte-level tokenizer for printable ASCII
 */

export const TOKENS = {
  PAD: 0,
  BOS: 1,
  EOS: 2,
  MASK: 3,
};

export const VOCAB_SIZE = 100;

// Create vocab mapping for printable ASCII [32..126] + specials
const CHAR_TO_ID = new Map<string, number>();
const ID_TO_CHAR = new Map<number, string>();

// Special tokens
ID_TO_CHAR.set(TOKENS.PAD, '<pad>');
ID_TO_CHAR.set(TOKENS.BOS, '<bos>');
ID_TO_CHAR.set(TOKENS.EOS, '<eos>');
ID_TO_CHAR.set(TOKENS.MASK, '<mask>');

CHAR_TO_ID.set('<pad>', TOKENS.PAD);
CHAR_TO_ID.set('<bos>', TOKENS.BOS);
CHAR_TO_ID.set('<eos>', TOKENS.EOS);
CHAR_TO_ID.set('<mask>', TOKENS.MASK);

// Printable ASCII characters
let tokenId = 4;
for (let i = 32; i <= 126 && tokenId < VOCAB_SIZE; i++) {
  const char = String.fromCharCode(i);
  CHAR_TO_ID.set(char, tokenId);
  ID_TO_CHAR.set(tokenId, char);
  tokenId++;
}

export function encode(text: string, seqLen: number): number[] {
  const tokens: number[] = [TOKENS.BOS];
  
  for (const char of text) {
    const id = CHAR_TO_ID.get(char);
    if (id !== undefined) {
      tokens.push(id);
    }
  }
  
  tokens.push(TOKENS.EOS);
  
  // Truncate if too long
  if (tokens.length > seqLen) {
    return tokens.slice(0, seqLen - 1).concat([TOKENS.EOS]);
  }
  
  // Pad if too short
  while (tokens.length < seqLen) {
    tokens.unshift(TOKENS.PAD);
  }
  
  return tokens;
}

export function decode(ids: number[]): string {
  return ids
    .map(id => ID_TO_CHAR.get(id) || '?')
    .filter(char => !['<pad>', '<bos>', '<eos>'].includes(char))
    .join('');
}

export function getTokenChar(id: number): string {
  return ID_TO_CHAR.get(id) || '?';
}