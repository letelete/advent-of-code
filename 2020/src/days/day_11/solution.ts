import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

type Grid<T> = T[][];

type SeatsGrid = Grid<string>;

type Distance = 1 | 0 | -1;

type Symbol = string;

interface GridCell {
  row: number;
  col: number;
}

interface CountSymbolStrategy {
  (layout: SeatsGrid, from: GridCell): number;
}

interface SymbolReplacementStrategy {
  (symbol: Symbol, occupied: number): Symbol;
}

interface LayoutStabilizationStrategy {
  (layout: SeatsGrid): {
    changesCount: number;
    newLayout: SeatsGrid;
  };
}

const day11: Day = (input: DayInput) => {
  const data: SeatsGrid = input
    .split('\n')
    .map(str => str.split('').filter(x => x));

  const SYMBOLS = {
    EMPTY: 'L',
    OCCUPIED: '#',
    FLOOR: '.',
  };

  /**
   * All possible moves on the grid
   * left, left-top, top, right-rop, right, right-bottom, bottom, left-bottom
   */
  const directions: [Distance, Distance][] = [
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
  ];

  const copyGrid = <T>(grid: Grid<T>): Grid<T> =>
    grid.map(row => row.map(cell => cell));

  const isCellOutOfBound = <T>(grid: Grid<T>, cell: GridCell) =>
    cell.row < 0 ||
    cell.row >= grid.length ||
    cell.col < 0 ||
    cell.col >= grid[0].length;

  const transformLayout = (
    countSymbolWithStrategy: CountSymbolStrategy,
    findNewSymbolWithStrategy: SymbolReplacementStrategy
  ) => (layout: SeatsGrid) => {
    let changesCount = 0;
    let newLayout = copyGrid(layout);

    for (let row = 0; row < layout.length; ++row) {
      for (let col = 0; col < layout[0].length; ++col) {
        const currentSymbol = layout[row][col];

        if (currentSymbol === SYMBOLS.FLOOR) continue;

        const symbolCount = countSymbolWithStrategy(layout, {row, col});
        const newSymbol = findNewSymbolWithStrategy(currentSymbol, symbolCount);
        changesCount += Number(newSymbol !== currentSymbol);
        newLayout[row][col] = newSymbol;
      }
    }

    return {newLayout, changesCount};
  };

  const countSymbolInLayout = (layout: SeatsGrid, symbol: Symbol): number => {
    return layout.reduce(
      (count, row) =>
        row.reduce((rowSum, cell) => rowSum + Number(cell === symbol), count),
      0
    );
  };

  const stabilizeLayout = (
    layout: SeatsGrid,
    stabilizeWithStrategy: LayoutStabilizationStrategy
  ): SeatsGrid => {
    let layoutCopy = copyGrid(layout);
    let transformDelta: number;

    do {
      const {newLayout, changesCount} = stabilizeWithStrategy(layoutCopy);
      layoutCopy = newLayout;
      transformDelta = changesCount;
    } while (transformDelta);

    return layoutCopy;
  };

  /**
   * Performs layout transformation until reach the equilibrium phase - a phase from which
   * any next transformations won't take any affect.
   *
   * @param layout - A base layout phase that has to reach equilibrium
   * @param countSymbolStrategy - How the symbol required for a replaceSymbolStrategy should be counted
   * @param replaceSymbolStrategy  - How a symbol on given cell should be replaced with given circumstances
   *
   * @returns A number of seats equals to given symbol, counted at the ending phase (equilibrium).
   */
  const getSymbolCountOfEquilibrium = (
    layout: SeatsGrid,
    countSymbolStrategy: CountSymbolStrategy,
    replaceSymbolStrategy: SymbolReplacementStrategy,
    symbolToCount: Symbol
  ) => {
    const equilibrium = stabilizeLayout(
      layout,
      transformLayout(countSymbolStrategy, replaceSymbolStrategy)
    );
    return countSymbolInLayout(equilibrium, symbolToCount);
  };

  const partOne = () => {
    const countSymbolStrategy: CountSymbolStrategy = (layout, from) => {
      let count = 0;
      for (const dir of directions) {
        const [row, col] = dir;
        const [nextRow, nextCol] = [from.row + row, from.col + col];
        if (isCellOutOfBound(layout, {row: nextRow, col: nextCol})) continue;
        if (layout[nextRow][nextCol] === SYMBOLS.OCCUPIED) count++;
      }
      return count;
    };

    const replaceSymbolStrategy: SymbolReplacementStrategy = (
      symbol,
      occupiedCount
    ) => {
      if (SYMBOLS.EMPTY && !occupiedCount) return SYMBOLS.OCCUPIED;
      if (SYMBOLS.OCCUPIED && occupiedCount >= 4) return SYMBOLS.EMPTY;
      return symbol;
    };

    return getSymbolCountOfEquilibrium(
      data,
      countSymbolStrategy,
      replaceSymbolStrategy,
      SYMBOLS.OCCUPIED
    );
  };

  const partTwo = () => {
    const countSymbolStrategy: CountSymbolStrategy = (layout, from) => {
      let count = 0;
      for (const dir of directions) {
        let [row, col] = dir;
        let [nextRow, nextCol] = [from.row, from.col];
        do {
          nextRow += row;
          nextCol += col;
          if (isCellOutOfBound(layout, {row: nextRow, col: nextCol})) break;
          if (layout[nextRow][nextCol] === SYMBOLS.OCCUPIED) count++;
        } while (layout[nextRow][nextCol] === SYMBOLS.FLOOR);
      }
      return count;
    };

    const replaceSymbolStrategy: SymbolReplacementStrategy = (
      symbol,
      occupiedCount
    ): string => {
      if (SYMBOLS.EMPTY && !occupiedCount) return SYMBOLS.OCCUPIED;
      if (SYMBOLS.OCCUPIED && occupiedCount >= 5) return SYMBOLS.EMPTY;
      return symbol;
    };

    return getSymbolCountOfEquilibrium(
      data,
      countSymbolStrategy,
      replaceSymbolStrategy,
      SYMBOLS.OCCUPIED
    );
  };

  return [partOne, partTwo];
};

export default day11;
