import type { LevelTip } from './tips'

export const levelTipsEn: Record<number, LevelTip> = {
  1: {
    title: 'Times Tables',
    formula: 'a × b → memorize directly',
    steps: [
      'Memorize all 81 combinations from 1×1 to 9×9',
      'Start small: ×2, ×5, ×10 first',
      'Use symmetry: 3×7 = 7×3',
    ],
    example: '7 × 8 → recall directly = 56',
  },
  2: {
    title: 'Round-up Addition',
    formula: 'a + bc → add tens first, then units',
    steps: [
      'Split the 2-digit number into tens + units',
      'Add a + tens part first',
      'Then add the units digit',
    ],
    example: '6 + 47 → 6 + 40 = 46 → 46 + 7 = 53',
  },
  3: {
    title: '×11 Basics (multiples of 10)',
    formula: 'n0 × 11 = n × 110',
    steps: [
      'Works for 2-digit numbers ending in 0 (20, 30, 40…)',
      'Think of ×11 as ×10 plus itself',
      'Or use the formula: tens × 110',
    ],
    example: '30 × 11 → 30×10 + 30 = 300 + 30 = 330',
  },
  4: {
    title: '×11 No Carry',
    formula: 'AB × 11 = A (A+B) B',
    steps: [
      'Works when the two digits sum to less than 10',
      'Hundreds = tens digit, units = units digit',
      'Middle digit = sum of both digits',
    ],
    example: '32 × 11 → 3 | (3+2) | 2 = 352',
  },
  5: {
    title: '×11 With Carry',
    formula: 'AB × 11 = (A+1) | (A+B units) | B',
    steps: [
      'When digit sum ≥ 10, take units digit in middle and carry 1 left',
      'Hundreds = tens+1, tens = units digit of (tens+units), units unchanged',
    ],
    example: '75 × 11 → (7+1) | (7+5=12→2) | 5 = 825',
  },
  6: {
    title: '×9 No Borrow',
    formula: 'n × 9 = n × 10 − n',
    steps: [
      'Works when units digit > tens digit (e.g. 59: 9 > 5)',
      'Compute n × 10 (just append a zero)',
      'Subtract n directly — no borrowing needed',
    ],
    example: '59 × 9 → 590 − 59 = 531',
  },
  7: {
    title: '×9 With Borrow',
    formula: 'n × 9 = (n×10 − 100) + (100 − n)',
    steps: [
      'Works when units digit ≤ tens digit (e.g. 52: 2 ≤ 5)',
      'Compute n×10 − 100 for the first part',
      'Add 100 − n for the second part',
    ],
    example: '52 × 9 → (520−100) + (100−52) = 420 + 48 = 468',
  },
  8: {
    title: '×25 Speed (÷4 × 100)',
    formula: 'n × 25 = n ÷ 4 × 100',
    steps: [
      'Think of 25 as 100 ÷ 4',
      'Divide n by 4',
      'Multiply by 100 (append two zeros)',
    ],
    example: '28 × 25 → 28 ÷ 4 = 7 → 700',
  },
  9: {
    title: '11–19 Squares',
    formula: '(10+a)² = 100 + 20a + a²',
    steps: [
      'Write the number as 10+a (e.g. 14 = 10+4)',
      'Compute 100 + 20a (e.g. 100 + 80 = 180)',
      'Add a² (e.g. 4² = 16)',
    ],
    example: '14² → 100 + 20×4 + 16 = 196',
  },
  10: {
    title: '×99 Speed (near-100)',
    formula: 'n × 99 = n × 100 − n',
    steps: [
      'Compute n × 100 (append two zeros)',
      'Subtract n from the result',
    ],
    example: '43 × 99 → 4300 − 43 = 4257',
  },
  11: {
    title: 'Complementary Units ×',
    formula: 'ab × ac = a(a+1)×100 + b×c  (b+c=10)',
    steps: [
      'Both numbers share the same tens digit and their units sum to 10',
      'Hundreds part: tens × (tens+1)',
      'Last two digits: units × units',
    ],
    example: '23 × 27 → 2×3×100 + 3×7 = 600 + 21 = 621',
  },
  12: {
    title: 'Full 2-Digit × (FOIL)',
    formula: 'ab × cd = (a×c)×100 + (a×d + b×c)×10 + b×d',
    steps: [
      'Split each number into tens (a,c) and units (b,d)',
      'Hundreds: a×c; units: b×d',
      'Tens: a×d + b×c (watch for carries)',
    ],
    example: '24 × 17 → 200 + 180 + 28 = 408',
  },
  13: {
    title: '2-Digit × 1-Digit (Split)',
    formula: '(a×10 + b) × c = a×c×10 + b×c',
    steps: [
      'Split 2-digit number into tens and units parts',
      'Multiply each part by the 1-digit number',
      'Add results together (handle carries)',
    ],
    example: '34 × 7 → 30×7 + 4×7 = 210 + 28 = 238',
  },
  14: {
    title: 'Ends-in-5 Squared',
    formula: 'n5² = n×(n+1)×100 + 25',
    steps: [
      'Take the tens digit n',
      'Compute n×(n+1) for the hundreds part',
      'Last two digits are always 25',
    ],
    example: '35² → 3×4=12 → 1200 + 25 = 1225',
  },
  15: {
    title: 'Even × 5 Speed',
    formula: 'n × 5 = (n ÷ 2) × 10',
    steps: [
      'Confirm n is even',
      'Divide n by 2',
      'Append a zero (multiply by 10)',
    ],
    example: '46 × 5 → 23 → append 0 = 230',
  },
  16: {
    title: '÷5 Speed',
    formula: 'n ÷ 5 = (n × 2) ÷ 10',
    steps: [
      'Multiply n by 2',
      'Divide by 10 (remove the last zero)',
    ],
    example: '85 ÷ 5 → 85×2=170 → ÷10 = 17',
  },
  17: {
    title: '2-Digit Addition (Carry)',
    formula: 'Round left number up to ten, then add remainder',
    steps: [
      'Find how much left number needs to reach next ten (e.g. 47 needs 3)',
      'Borrow that amount from right number: 47+3=50',
      'Add the remaining part: 50 + 35 = 85',
    ],
    example: '47 + 38 → 47+3=50 → 50+35 = 85',
  },
  18: {
    title: '2-Digit Subtraction (Borrow)',
    formula: 'Subtract tens first, then handle units',
    steps: [
      'Subtract the tens digit of subtrahend: 83−40=43',
      'Then subtract the units digit: 43−7=36',
      'Or use complement: what + 47 = 83?',
    ],
    example: '83 − 47 → 83−40=43 → 43−7 = 36',
  },
  19: {
    title: '×15 Speed',
    formula: 'n × 15 = n × 10 + n × 5',
    steps: [
      'Compute n × 10 (append a zero)',
      'Compute n × 5 (= n÷2 × 10)',
      'Add both results',
    ],
    example: '24 × 15 → 240 + 120 = 360',
  },
  20: {
    title: '×125 Speed (÷8 × 1000)',
    formula: 'n × 125 = (n ÷ 8) × 1000',
    steps: [
      'Confirm n is a multiple of 8',
      'Divide n by 8',
      'Append three zeros (multiply by 1000)',
    ],
    example: '24 × 125 → 24÷8=3 → 3000',
  },
  21: {
    title: 'Near-100 Multiplication',
    formula: 'a×b: first two digits = a−(100−b), last two = (100−a)×(100−b)',
    steps: [
      'Find each number\'s complement to 100 (e.g. 93→7, 96→4)',
      'First digits: one number minus other\'s complement: 93−4=89',
      'Last two digits: complements multiplied (pad with zero if needed): 7×4=28',
    ],
    example: '93 × 96 → complements 7,4 → 89|28 = 8928',
  },
  22: {
    title: 'Large 2-Digit × (FOIL)',
    formula: 'Same FOIL method, applied to 31–60 range',
    steps: [
      'Split each number into tens (a,c) and units (b,d)',
      'Hundreds: a×c; units: b×d',
      'Tens: a×d + b×c (watch for carries)',
    ],
    example: '43 × 57 → 2000 + 430 + 21 = 2451',
  },
}
