import Day from '../../interfaces/day.interface';
import DayInput from '../../interfaces/day_input.interface';

interface Range {
  from: number;
  to: number;
}

interface TicketFields {
  [name: string]: Range[];
}

type Ticket = number[];

interface Data {
  ticketFields: TicketFields;
  myTicket: Ticket;
  nearbyTickets: Ticket[];
}

type Tag = string;

type TaggedFields = [number, Tag[]][];

const day16: Day = (input: DayInput) => {
  const parseTicketFields = (fields: string): TicketFields =>
    fields
      .split(/\n/)
      .reduce((obj: TicketFields, fields: string): TicketFields => {
        const [name, rangesStr] = fields.split(':');
        const ranges = rangesStr.split('or').map(
          (range): Range => {
            const [from, to] = range.split('-').map(val => Number(val));
            return {from, to};
          }
        );
        return {...obj, [name]: ranges};
      }, {});

  const parseTicket = (values: string): Ticket =>
    values.split(',').map(e => Number(e));

  const parseMyTicket = (values: string): Ticket =>
    parseTicket(values.split(/\n/)[1]);

  const parseNearbyTickets = (fields: string): Ticket[] =>
    fields.split(/\n/).slice(1).map(parseTicket);

  const data = input.split(/\n\n/).reduce(
    (obj: Data, group: string, i: number): Data => {
      if (!i) return {...obj, ticketFields: parseTicketFields(group)};
      else if (i === 1) return {...obj, myTicket: parseMyTicket(group)};
      else return {...obj, nearbyTickets: parseNearbyTickets(group)};
    },
    {ticketFields: {}, myTicket: [], nearbyTickets: []}
  );

  const getTagsForValue = (query: number): Tag[] => {
    return Object.keys(data.ticketFields).filter((name: string): boolean => {
      for (const value of data.ticketFields[name]) {
        if (query >= value.from && query <= value.to) return true;
      }
      return false;
    });
  };

  const getTaggedTicket = (ticket: Ticket): TaggedFields => {
    return ticket.reduce((tags: TaggedFields, value: number): TaggedFields => {
      const nextTags = getTagsForValue(value);
      tags.push([value, nextTags]);
      return tags;
    }, []);
  };

  const getCommonTagsForIndex = (tickets: TaggedFields[]): Tag[][] => {
    const tagsLength = Object.keys(data.ticketFields).length;
    let occurs: Map<Tag, number>[] = Array.from(
      {length: tagsLength},
      (_, __) => new Map()
    );
    for (let i = 0; i < occurs.length; ++i) {
      for (const ticket of tickets) {
        ticket[i][1].forEach((tag: Tag) => {
          occurs[i].set(tag, (occurs[i]?.get(tag) || 0) + 1);
        });
      }
    }
    return occurs.map((tagsMap: Map<Tag, number>): Tag[] =>
      [...tagsMap]
        .filter((entry: [Tag, number]) => entry[1] === tickets.length)
        .map((entry: [Tag, number]) => entry[0])
    );
  };

  const assignTagToIndexes = (
    commonTagsForIndex: Tag[][],
    index: number = 0,
    used: Set<Tag> = new Set()
  ): Tag[] => {
    if (index >= commonTagsForIndex.length) return [...used];
    for (const tag of commonTagsForIndex[index]) {
      if (used.has(tag)) continue;
      used.add(tag);
      const result = assignTagToIndexes(commonTagsForIndex, index + 1, used);
      if (result.length) return result;
      used.delete(tag);
    }
    return [];
  };

  const partOne = () => {
    return data.nearbyTickets
      .map(getTaggedTicket)
      .reduce(
        (sum: number, ticketsTagged: TaggedFields): number =>
          sum +
          [...ticketsTagged].reduce(
            (partialSum, entry: [number, Tag[]]): number =>
              entry[1].length ? partialSum : partialSum + entry[0],
            0
          ),
        0
      );
  };

  const partTwo = () => {
    const validTagged: TaggedFields[] = data.nearbyTickets
      .map(getTaggedTicket)
      .filter(
        (ticketsTagged: TaggedFields): boolean =>
          !ticketsTagged.some(([_, tags]): boolean => tags.length === 0)
      );
    const filtered = getCommonTagsForIndex(validTagged);
    const assigned = assignTagToIndexes(filtered);
    return assigned
      .map((tag: Tag, index: number) =>
        tag.startsWith('departure') ? index : -1
      )
      .filter((index: number) => index >= 0)
      .reduce(
        (product: number, nextIndex: number): number =>
          (product || 1) * data.myTicket[nextIndex],
        0
      );
  };

  return [partOne, partTwo];
};

export default day16;
