/** @jsx jsx */
import { jsx, css, ThemeProvider, Global } from '@emotion/react';

import { useState } from 'react';
import { WidgetModel } from '@jupyter-widgets/base';
import { useModelState, BifrostModelContext } from '../hooks/bifrost-model';
import theme from '../theme';
import OnboardingWidget from './Onboarding/OnboardingWidget';
import VisualizationScreen from './VisualizationScreen';
import { useEffect } from 'react';

const globalStyles = (theme: any) => css`
  // Global styles for the widget
  //===========================================================
  .bifrost-widget {
    height: 100%;
    max-height: fit-content;

    * {
      box-sizing: border-box;
    }

    button {
      cursor: pointer;
      transition: transform 0.4s;
      background-color: ${theme.color.primary.dark};
      color: white;
      font-weight: 700;
      padding: 10px 15px;
      border-radius: 7px;
      font-size: 16px;
      border: none;

      &:active {
        transform: scale(0.95);
      }

      &:active:disabled {
        transform: scale(1);
      }
      &:disabled {
        opacity: 0.6;
        cursor: default;
      }

      &.wrapper {
        border: none;
        background: transparent;
        margin: 0;
        padding: 0;
        color: initial;
      }

      &.next-button {
        padding: 0;
        background-color: ${theme.color.primary.dark};
        border: none;
        border-radius: 50%;
        cursor: pointer;
        height: 28px;
        width: 28px;
        margin-left: 20px;
      }
    }

    &.block {
      display: block;
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

    .subtitle {
      font-size: 18px;
      color: gray;
      font-weight: 700;
      margin: 0;
    }
  }
`;

interface BifrostReactWidgetProps {
  model: WidgetModel;
}

export default function BifrostReactWidget(props: BifrostReactWidgetProps) {
  return (
    <ThemeProvider theme={theme}>
      <BifrostModelContext.Provider value={props.model}>
        <Global styles={globalStyles} />
        <BifrostReactWidgetDisplay />
      </BifrostModelContext.Provider>
    </ThemeProvider>
  );
}

function BifrostReactWidgetDisplay() {
  const plotArgs = useModelState('plot_function_args')[0];
  // TODO: Might need to check the mark as well
  const [onboarded, setOnboarded] = useState(
    Boolean(plotArgs['x'] && plotArgs['y'])
  );

  useEffect(() => {
    const jupyterWidgets = document.getElementsByClassName('jupyter-widgets');
    Array.from(jupyterWidgets).forEach((jupyterWidget) => {
      if (jupyterWidget.children[0].classList.contains('bifrost-widget')) {
        (jupyterWidget as HTMLElement).style.overflow = 'hidden';
      }
    });
  }, []);

  return (
    <div className="bifrost-widget-display">
      {onboarded ? (
        <VisualizationScreen onPrevious={() => setOnboarded(false)} />
      ) : (
        <OnboardingWidget
          onOnboarded={() => setOnboarded(true)}
          plotArgs={plotArgs}
        />
      )}
    </div>
  );
}
