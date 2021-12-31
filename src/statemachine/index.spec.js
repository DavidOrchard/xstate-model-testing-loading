import React from 'react';
import * as xstate from 'xstate';
import { useMachine } from '@xstate/react';
import { createModel } from '@xstate/test';
import { act, render, fireEvent, cleanup } from '@testing-library/react';
import { stateMachine, machineDeclaration } from './index';
import '@testing-library/jest-dom/extend-expect';

const loadingEntryAction = jest.fn();
const userSubmitAction = jest.fn();

const loading = async () => {
  console.log('loading service');
  throw new Error();
  return false;
};

const TestComponent = () => {
  const [state, publish] = useMachine(stateMachine, {
    services: {loading},
    actions: {
      loadingEntryAction,
      userSubmitAction,
    },
  });

  return (
    <div>
      <p data-testid="current_state">{state.value}</p>
      <button
        onClick={() => {
          publish('SUBMIT');
        }}
      >
        SUBMIT
      </button>
      <button
        onClick={() => {
          publish('SUCCESS');
        }}
      >
        SUCCESS
      </button>
      <button
        onClick={() => {
          publish('FAILURE');
        }}
      >
        FAILURE
      </button>
    </div>
  );
};

const stateMachineModel = createModel(xstate.createMachine(machineDeclaration)).withEvents({
  SUCCESS: {
    exec: ({ getByText }) => {
      fireEvent.click(getByText('SUCCESS'));
    },
  },
});

describe('StateMachine', () => {
  const testPlans = stateMachineModel.getShortestPathPlans();

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      afterEach(cleanup);
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          await act(async () => {
            await path.test(render(<TestComponent />));
          });
        });
      });
    });
  });
});
