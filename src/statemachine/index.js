import { assign} from "xstate";

// https://stately.ai/viz/72380040-fa65-440a-931b-692ea5af117f

export const machineDeclaration = {
  id: "statemachine",
  initial: "idle",
  context: {
    name: ''
  },
  states: {
    idle: {
      always: [
        {
          target: "checking"
        },
      ]
    },
    checking: {
      invoke: {
        id: "checking",
        src: "checking",
        onDone: {
          target: "loading",
        },
        onError: {
          target: "failure",
        },
      },
    },
    loading: {
      invoke: {
        id: "loading",
        src: "loading",
        onDone: {
          target: "success",
          actions: assign({
            name: (context, event) => event?.data?.name
          })
        },
        onError: {
          target: "failure"
        }
      },
    },
    success: {
    },
    failure: {
    }
  }
};
