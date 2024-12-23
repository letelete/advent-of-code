const fs = require('fs');
const crypto = require('crypto');

const colors = {
  white: 0,
  orange: 1,
  magenta: 2,
  light_blue: 3,
  yellow: 4,
  lime: 5,
  pink: 6,
  gray: 7,
  light_gray: 8,
  cyan: 9,
  purple: 10,
  blue: 11,
  brown: 12,
  green: 13,
  red: 14,
  black: 15,
};

const config = {
  pathFileLoad: './load.mcscript',
  pathFileTick: './main.mcscript',
  pathFileSolution: '../main.js',
  pathFileData: '../in.sample.txt',

  codeIndentSpaces: 4,

  racetrackY: 55,
  racetrackGroundBlock: 'minecraft:moss_block',
  racetrackWallBlocks: ['minecraft:moss_block', 'minecraft:moss_block'],
  racetrackStartBlock: 'minecraft:glowstone',
  racetrackEndBlock: 'minecraft:glowstone',

  cheatDuration: 2,
  cheatOptimalMinSave: 0,

  actorColorMain: colors.white,
  actorColorCheater: colors.red,
};

let state = {
  actors: {
    main: null,
    cheaters: [],
  },
};

function indent(spaces = config.codeIndentSpaces) {
  return new Array(spaces).fill(' ').join('');
}

function buildFunction(signatures, body) {
  const declaration = signatures.map(([name, ...args]) =>
    args.length ? `${name}(${args.join(', ')})` : `${name}`
  );
  return [
    `${declaration.join(', ')} {`,
    `${body.map((line) => `${indent()}${line}`).join('\n')}`,
    `}`,
  ].join('\n');
}

function buildRacetrack(data, path, startPos, endPos) {
  const [x, y, z] = [0, config.racetrackY, 0];
  const sizeX = data.length;
  const sizeZ = data[0].length;

  const xyz0 = ({ _x, _y, _z } = {}) => `${_x ?? x} ${_y ?? y} ${_z ?? z}`;
  const xyz1 = ({ _x, _y, _z } = {}) =>
    `${_x ?? x + sizeX - 1} ${_y ?? y} ${_z ?? z + sizeZ - 1}`;

  const body = [
    `log("Generating race track ${sizeX} x ${sizeZ}")\n`,

    '// remove all blocks in the racetrack area',
    `/fill ${xyz0({ _x: x - 4, _z: z - 4 })} ${xyz1({
      _x: x + sizeX + 3,
      _y: y + 11,
      _z: z + sizeZ + 3,
    })} air replace`,

    '// set racetrack ground',
    `/fill ${xyz0()} ${xyz1()} ${config.racetrackGroundBlock} replace`,

    '// fill racetrack with walls everywhere',
    ...config.racetrackWallBlocks.map((blockId, dy) => {
      const _y = y + dy + 1;
      return `/fill ${xyz0({ _y })} ${xyz1({ _y })} ${blockId} replace`;
    }),

    '// clear racetrack walls on path coordinates',
    ...path.map(
      ([_x, _z]) =>
        `/fill ${xyz0({ _x, _y: y + 1, _z })} ${xyz1({
          _x,
          _y: y + 1 + config.racetrackWallBlocks.length,
          _z,
        })} air replace`
    ),

    '// set racetrack start block',
    `/setblock ${xyz0({ _x: startPos[0], _z: startPos[1] })} ${
      config.racetrackStartBlock
    }`,

    '// set racetrack end block',
    `/setblock ${xyz0({ _x: endPos[0], _z: endPos[1] })} ${
      config.racetrackEndBlock
    }`,
  ];

  return buildFunction(
    [
      ['as', '@a'],
      ['at', '@s'],
    ],
    body
  );
}

class Actor {
  constructor(x, z, path, step, cheater, incrByTick = 0.5) {
    this.entityId = 'minecraft:sheep';
    this.tag = crypto.randomUUID();
    this.x = x;
    this.y = config.racetrackY + 1;
    this.z = z;
    this.path = path;
    this.step = step;
    this.cheater = cheater;
    this.incrByTick = incrByTick;
    this.entityConfig = `{Tags:[${this.tag}],Invulnerable:1b,NoAI:1b,Color:${
      cheater ? config.actorColorCheater : config.actorColorMain
    }}`;
  }

  move() {
    if (this.step + 1 >= this.path.length) {
      return;
    }
    const [destX, destZ] = this.path[this.step + 1];
    const [dx, dz] = [destX - this.x, destZ - this.z].map((delta) =>
      delta >= 0
        ? Math.min(this.incrByTick, delta)
        : Math.max(-this.incrByTick, delta)
    );

    this.x += dx;
    this.z += dz;
    if (this.x === destX && this.z === destZ) {
      this.step++;
    }
  }

  getXYZ() {
    return `${this.x} ${this.y} ${this.z}`;
  }
}

const buildSummonActor = (actor) => {
  return `/summon ${actor.entityId} ${actor.getXYZ()} ${actor.entityConfig}`;
};

const buildMoveActor = (actor) => {
  return `/tp @e[type=${actor.entityId},tag=${actor.tag}] ${actor.getXYZ()}`;
};

function buildInitActor(path, startPos) {
  const actor = new Actor(startPos[0], startPos[1], path, 0, false);
  const body = [`/kill @e[type=${actor.entityId}]`, buildSummonActor(actor)];

  state = { ...state, actors: { ...state.actors, main: actor, cheaters: [] } };

  return buildFunction(
    [
      ['as', '@a'],
      ['at', '@s'],
    ],
    body
  );
}

function buildTicks(data, path, startPos, endPos, cheat) {
  const actorReachedEnd = (actor) => {
    return actor.x === endPos[0] && actor.z === endPos[1];
  };

  let tick = 0;

  while (!actorReachedEnd(state.actors.main)) {
    const fileName = `tick-${tick}`;
    const body = [];

    cheat(path, state.actors.main.step, config.cheatDuration).forEach(
      ([saved, { to }]) => {
        if (saved >= config.cheatOptimalMinSave) {
          const [x, y] = path[to];
          const actor = new Actor(x, y, path, to, true);
          state.actors.cheaters.push(actor);
          body.push(buildSummonActor(actor));
        }
      }
    );

    [
      state.actors.main,
      ...state.actors.cheaters
    ].forEach((actor) => {
      actor.move();
      body.push(buildMoveActor(actor));
    });

    if (!actorReachedEnd(state.actors.main)) {
      body.push(`/schedule function oac:tick${tick + 1} 0.05s`);
    }

    fs.appendFileSync(
      config.pathFileLoad,
      buildFunction([[`function tick${tick}`]], body) + '\n'
    );

    tick++;
  }
}

function buildSetupCamera(data) {
  const [x, y, z] = [0, config.racetrackY, 0];
  const sizeX = data.length;
  const sizeZ = data[0].length;
  const yFactor = 0.75;

  const body = [
    `/tp @s ${x + (sizeX - x) / 2} ${y + yFactor * Math.max(sizeX, sizeZ)} ${
      z + (sizeZ - z) / 2
    } 0 90`,
  ];

  return buildFunction(
    [
      ['as', '@a'],
      ['at', '@s'],
    ],
    body
  );
}

(() => {
  const {
    parse,
    symbols,
    findTilePos,
    getPath,
    cheat,
  } = require(config.pathFileSolution);
  const data = parse(fs.readFileSync(config.pathFileData, 'utf-8'));

  const startPos = findTilePos(data, symbols.start);
  const endPos = findTilePos(data, symbols.end);
  const path = getPath(data, startPos, endPos);

  fs.writeFileSync(
    config.pathFileLoad,
    [
      '#file: ./load',
      `log('AoC: Day 20 Initialized!')`,
      '/gamerule doEntityDrops false',
      '/gamerule doTileDrops false',
      '/gamerule doTileDrops false',
      '/time set night',
      '// build racetrack',
      buildRacetrack(data, path, startPos, endPos),
      '// setup camera actor',
      buildInitActor(path, startPos),
      buildSetupCamera(data),
    ].join('\n\n') + '\n'
  );

  buildTicks(data, path, startPos, endPos, cheat);
})();
