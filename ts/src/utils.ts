export const range = (start: number, end: number): Array<number> => {
  return ([...Array(end - start)].map((_, i) => (start + i)));
}