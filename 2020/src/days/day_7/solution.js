const fs = require('fs');
const path = require('path');

const day7 = (input) => {
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
  const bagsGraph = input.split(/\n/).reduce((graph, relation) => {
    const [parent, ...bags] = [
      ...relation.matchAll(/(\d+)?\s?(\w+)?\s?(\w+)\sbags?/g),
    ].map((groups) => ({
      id: `${groups[2]} ${groups[3]}`,
      amount: groups[1] ? parseInt(groups[1]) : null,
    }));
    return bags.reduce(
      (graph, bag) => ({
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

  const getAllAncestors = (root) => {
    const visited = new Set();
    const traverse = (id) => {
      if (!id || visited.has(id)) return null;
      visited.add(id);
      if (!bagsGraph[id] || !bagsGraph[id].parents) return [];
      return Object.keys(bagsGraph[id].parents).reduce(
        (ancestors, parentId) => {
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

  const howManyBagsInside = (id) => {
    if (!id || !bagsGraph[id] || !bagsGraph[id].children) return 0;
    return Object.keys(bagsGraph[id].children).reduce((count, neighborId) => {
      const storage = bagsGraph[id].children[neighborId] || 0;
      return count + (storage + storage * howManyBagsInside(neighborId));
    }, 0);
  };

  return {
    part1: () => getAllAncestors(MY_BAG_ID).length,
    part2: () => howManyBagsInside(MY_BAG_ID),
  };
};

const input = fs.readFileSync(path.resolve(__dirname, 'input'), 'utf-8');
Object.values(day7(input)).forEach((solution, index) =>
  console.log(`Part ${index + 1}`, solution())
);
