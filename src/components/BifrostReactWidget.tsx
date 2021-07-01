/** @jsx jsx */
import { jsx, css, ThemeProvider, Global } from '@emotion/react';

// import Graph from './Graph';
import Sidebar from './Sidebar/Sidebar';
import { WidgetModel } from '@jupyter-widgets/base';
import { BifrostModelContext, useModelState } from '../hooks/bifrost-model';
import { useEffect, useState, useRef } from 'react';
import ChartChooser from './Onboarding/ChartChooser';
import ColumnScreen from './Onboarding/ColumnScreen';
import { VisualizationSpec } from 'react-vega';
import Graph from './Graph';
import theme from '../theme';

const bifrostWidgetCss = css`
  // Element-based styles
  //===========================================================
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-areas: 'graph sidebar';
  max-width: calc(100% - 64px);
`;

const globalStyles = css`
  // Global styles for the widget
  //===========================================================
  * {
    box-sizing: border-box;
  }

  button {
    cursor: pointer;
    transition: transform 0.4s;

    &:active {
      transform: scale(0.95);
    }
  }

  h1 {
    font-size: 35px;
    font-weight: 800;
    margin: 10px 0;
    margin-bottom: 15px;
  }

  h2 {
    font-size: 25px;
    font-weight: 800;
  }
`;

interface BifrostReactWidgetProps {
  model: WidgetModel;
}

export default function BifrostReactWidget(props: BifrostReactWidgetProps) {
  const [screenName, setScreenName] = useState('columnChooser');
  const [selectedSpec, setSelectedSpec] = useState<VisualizationSpec>({});
  let Screen: JSX.Element;
  switch (screenName) {
    case 'columnChooser':
      Screen = <ColumnScreen onNext={() => setScreenName('chartChooser')} />;
      break;
    case 'chartChooser':
      Screen = (
        <ChartChooser
          onChartSelected={(data) => {
            setSelectedSpec(data);
            setScreenName('visualize');
          }}
          onBack={() => setScreenName('columnChooser')}
        />
      );
      break;
    case 'visualize':
      Screen = (
        <VisualizationScreen
          spec={selectedSpec}
          onPrevious={() => setScreenName('chartChooser')}
        />
      );
      break;

    default:
      Screen = (
        <VisualizationScreen
          spec={selectedSpec}
          onPrevious={() => setScreenName('chartChooser')}
        />
      );
      break;
  }
  return (
    <ThemeProvider theme={theme}>
      <BifrostModelContext.Provider value={props.model}>
        {Screen}
        <Global styles={globalStyles} />
      </BifrostModelContext.Provider>
    </ThemeProvider>
  );
}

function VisualizationScreen({
  spec,
  onPrevious,
}: {
  spec: VisualizationSpec;
  onPrevious: () => void;
}) {
  const setGraphSpec = useModelState('graph_spec')[1];
  const graphAreaRef = useRef<HTMLDivElement>();
  useResize(
    (e) => {
      graphAreaRef.current?.getBoundingClientRect;
    },
    [graphAreaRef.current]
  );

  return (
    <article className="BifrostWidget" css={bifrostWidgetCss}>
      <GridArea ref={graphAreaRef} area="graph">
        <Graph onBack={onPrevious} />
      </GridArea>
      <GridArea area="sidebar">
        <Sidebar />
      </GridArea>
    </article>
  );
}

interface GridAreaProps {
  area: string;
  children?: any;
  ref?: React.LegacyRef<HTMLDivElement>;
}

function GridArea(props: GridAreaProps) {
  return (
    <div style={{ gridArea: props.area }} ref={props.ref}>
      {props.children}
    </div>
  );
}

function useResize(callback: (e: UIEvent) => void, deps: any[]) {
  useEffect(() => {
    window.addEventListener('resize', callback);
    return () => void window.removeEventListener('resize', callback);
  }, deps);
}
