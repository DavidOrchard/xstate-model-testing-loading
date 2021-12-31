import { Machine } from 'xstate';

export const machineDeclaration = {
  id: 'statemachine',
  initial: 'idle',
  
  states: {
    idle: {
      always: [
        {
          target: 'loading'
        }
      ],
      meta: {
        test: async ({ getByTestId }) => {
          expect(getByTestId('current_state')).toHaveTextContent('idle');
        }
      }
    },
    loading: {
      invoke: {
        id: 'loading',
        src: 'loading',
        onDone: {
          target: 'success',
        },
        onError: {
          target: 'failure',
        },
      },
      entry: ['loadingEntryAction'],
      meta: {
        test: async ({ findByText, getByTestId }) => {
          expect( await findByText('loading')).toBeVisible();
          expect(getByTestId('current_state')).toHaveTextContent('loading');
          // expect(loadingEntryAction).toHaveBeenCalled();
        },
      }
    },
    success: {
      meta: {
        test: async ({ findByText, getByTestId }) => {
          expect( await findByText('success')).toBeVisible();
          expect(getByTestId('current_state')).toHaveTextContent('success');
        },
      }
    },
    failure: {
      meta: {
        test: async ({ findByText, getByTestId }) => {
          expect( await findByText('failure')).toBeVisible();
          expect(getByTestId('current_state')).toHaveTextContent('failure');
        },
      }
    },

  },
};

export const stateMachine = Machine(machineDeclaration);
