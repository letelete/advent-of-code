import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

interface RelationNode {
  [bagId: string]: number;
}

interface BagNode {
  children: RelationNode;
  parents: RelationNode;
}

interface BagsGraph {
  [bagId: string]: BagNode;
}

interface BagInput {
  id: string;
  amount: number;
}

const day7: Day = (input: DayInput) => {
  const MY_BAG_ID = 'shiny gold';

  /**
   * Each bag has its own unique {id} (color), and points to its children and parents, which are stored in
   * separated objects as key:value pairs, where
   * for children:
   *    key - A bag that is contained within the {id} bag
   *    value - An amount of storage that certain {key} bag takes inside of the {id} bag
   * for parents:
   *    key - A bag that contains the {id} bag
   *    value - An amount of storage that {id} bag takes inside of the {key} bag
   */
  const bagsGraph: BagsGraph = input
    .split(/\n/)
    .reduce((graph: BagsGraph, relation: string): BagsGraph => {
      const [parent, ...bags] = [
        ...relation.matchAll(/(\d+)?\s?(\w+)?\s?(\w+)\sbags?/g),
      ].map(
        (groups: string[]): BagInput => ({
          id: `${groups[2]} ${groups[3]}`,
          amount: groups[1] ? parseInt(groups[1]) : 0,
        })
      );
      return bags.reduce(
        (graph: BagsGraph, bag: BagInput): BagsGraph => ({
          ...graph,
          [parent.id]: {
            ...graph[parent.id],
            children: {
              ...(graph[parent.id] && graph[parent.id].children),
              [bag.id]: bag.amount,
            },
          },
          [bag.id]: {
            ...graph[bag.id],
            parents: {
              ...(graph[bag.id] && graph[bag.id].parents),
              [parent.id]: bag.amount,
            },
          },
        }),
        graph
      );
    }, {});

  const getAllAncestors = (root: string): string[] | null => {
    const visited = new Set();
    const traverse = (id: string): string[] | null => {
      if (!id || visited.has(id)) return null;
      visited.add(id);
      if (!bagsGraph[id] || !bagsGraph[id].parents) return [];
      return Object.keys(bagsGraph[id].parents).reduce(
        (ancestors: string[], parentId: string) => {
          const parentAncestors = traverse(parentId);
          return parentAncestors
            ? [...ancestors, parentId, ...parentAncestors]
            : ancestors;
        },
        []
      );
    };
    return traverse(root);
  };

  const howManyBagsInside = (id: string): number => {
    if (!id || !bagsGraph[id] || !bagsGraph[id].children) return 0;
    return Object.keys(bagsGraph[id].children).reduce(
      (count: number, neighborId: string): number => {
        const storage = bagsGraph[id].children[neighborId];
        return count + (storage + storage * howManyBagsInside(neighborId));
      },
      0
    );
  };

  const partOne = () => getAllAncestors(MY_BAG_ID)?.length;

  const partTwo = () => howManyBagsInside(MY_BAG_ID);

  return [partOne, partTwo];
};

export default day7;
