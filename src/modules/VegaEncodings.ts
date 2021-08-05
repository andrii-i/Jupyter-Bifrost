import { GraphSpec } from '../hooks/bifrost-model';

// preprocess graph encoding to x y encoding
export function preprocessEncoding(spec: GraphSpec) {
  if ('theta' in spec['encoding'] && 'color' in spec['encoding']) {
    const theta = (spec as any)['encoding']['theta'];
    const color = (spec as any)['encoding']['color'];

    if (theta['type'] === 'quantitative') {
      spec['encoding']['x'] = theta;
      spec['encoding']['y'] = color;
    } else {
      spec['encoding']['x'] = color;
      spec['encoding']['y'] = theta;
    }
    delete (spec as any)['encoding']['theta'];
    delete (spec as any)['encoding']['color'];
  }
}

export function convertToCategoricalChartsEncoding(
  spec: GraphSpec,
  kind: string
) {
  const x = spec.encoding['x'];
  const y = spec.encoding['y'];
  if (kind === 'errorband') {
    spec.mark = { type: kind, extent: 'ci', borders: true };
  } else if (kind === 'errorbar') {
    spec.mark = { type: kind, extent: 'ci', ticks: true };
  } else if (kind === 'arc') {
    delete (spec as any)['params'];
    delete (spec as any)['encoding']['x'];
    delete (spec as any)['encoding']['y'];
    if (x['type'] === 'quantitative') {
      spec['encoding']['theta'] = x;
      spec['encoding']['color'] = y;
    } else {
      spec['encoding']['theta'] = y;
      spec['encoding']['color'] = x;
    }
  } else if (kind === 'boxplot') {
    delete (spec as any)['params'];
    spec.mark = { type: kind, extent: 'min-max' };
  }
}

export const vegaEncodingList = [
  'x',
  'y',
  'x2',
  'y2',
  'xError',
  'yError',
  'xError2',
  'yError2',

  // Polar Position Channels
  'theta',
  'radius',
  'theta2',
  'radius2',

  // Geographic Position Channels
  'longitude',
  'latitude',
  'longitude2',
  'latitude2',

  // Mark Properties Channels
  'color',
  'opacity',
  'fillOpacity',
  'strokeOpacity',
  'strokeWidth',
  'strokeDash',
  'size',
  'angle',
  'shape',

  // Text and Tooltip Channels
  'text',
  'tooltip',

  // Hyperlink Channel
  'href',

  // Description Channel
  'description',

  // Level of Detail Channel
  'detail',

  // Key Channel
  'key',

  // Order Channel
  'order',

  // Facet Channels
  'facet',
  'row',
  'column',
] as const;

const vegaColTypesList = [
  'quantitative',
  'temporal',
  'ordinal',
  'nominal',
  'geojson',
] as const;

//
export const vegaAggregationList = [
  // "argmax",
  // "argmin",
  // "ci0",
  // "ci1",
  'count',
  'distinct',
  'max',
  'mean',
  'median',
  'min',
  'missing',
  'product',
  //  "q1",
  //  "q3",
  'stderr',
  'stdev',
  'stdevp',
  'sum',
  'valid',
  'values',
  'variance',
  'variancep',
] as const;

export const vegaParamPredicatesList = [
  'equal',
  'lt',
  'lte',
  'gt',
  'gte',
  'range',
  'oneOf',
  'valid',
] as const;

export const vegaChartList = [
  'arc',
  'area',
  'bar',
  'boxplot',
  'circle',
  'errorband',
  'errorbar',
  // 'geoshape',
  // 'image',
  'line',
  'point',
  'rect',
  // 'rule',
  'square',
  // 'text',
  'tick',
  'trail',
];

export const vegaCategoricalChartList = [
  'arc',
  'bar',
  'boxplot',
  'errorband',
  'errorbar',
];

export const vegaScaleList = [
  'linear',
  'log',
  'pow',
  'sqrt',
  'quantile',
  'quantize',
  'threshold',
];

const bifrostVegaMark = [
  'point',
  'circle',
  'sqaure',
  'tick',
  'line',
  'bar',
  'trail',
];

const minimalEncoding = ['x', 'y', 'color', 'opacity', 'size', 'facet'];
minimalEncoding.sort();

export const vegaMarkEncodingMap: Record<string, string[]> = {
  point: minimalEncoding,
  circle: minimalEncoding,
  square: minimalEncoding,
  tick: minimalEncoding,
  line: minimalEncoding,
  bar: minimalEncoding,
  trail: minimalEncoding,
};

export const vegaTemporalChartList = ['area'];

export type VegaColumnType = typeof vegaColTypesList[number];

export type VegaEncoding = typeof vegaEncodingList[number];

export type VegaAggregation = typeof vegaAggregationList[number];

export type VegaParamPredicate = typeof vegaParamPredicatesList[number];

export type VegaMark = typeof vegaChartList[number];

export type BifrostVegaMark = typeof bifrostVegaMark[number];
