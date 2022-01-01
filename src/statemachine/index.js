import { assign} from "xstate";

export const machineDeclaration = {
  id: "statemachine",
  initial: "idle",
  context: {
    name: null
  },
  states: {
    idle: {
      always: [
        {
          target: "loading"
        }
      ]
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
