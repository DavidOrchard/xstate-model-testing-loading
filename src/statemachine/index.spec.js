import merge from "deepmerge";
import React from "react";
import * as xstate from "xstate";
import { useMachine } from "@xstate/react";
import { createModel } from "@xstate/test";
import { act, render, cleanup } from "@testing-library/react";
import { machineDeclaration } from "./index";
import { differentNameHandler, errorHandler } from "../mocks/handlers";
import { server } from "../mocks/server";
import "@testing-library/jest-dom/extend-expect";

// hack to know which test is running for which assertion to make
let testIndex = 0;

machineDeclaration.states.idle.meta = {
  test: async ({ getByTestId }) => {
    expect(getByTestId("current_state")).toHaveTextContent("idle");
  }
};

machineDeclaration.states.loading.meta = {
  test: async ({ findByText, getByTestId }) => {
    expect(await findByText("loading")).toBeVisible();
    expect(getByTestId("current_state")).toHaveTextContent("loading");
  }
};
machineDeclaration.states.success.meta = {
  test: async ({ findByText, getByTestId }, state) => {
    expect(await findByText("success")).toBeVisible();
    expect(getByTestId("current_state")).toHaveTextContent("success");
    const name = getByTestId("name").textContent;
    expect(name).toEqual(testIndex === 3 ? "DecimusMaximus" : "DavidOrchard");
  }
};

machineDeclaration.states.failure.meta = {
    test: async ({ findByText, getByTestId }) => {
      expect(await findByText("failure")).toBeVisible();
      expect(getByTestId("current_state")).toHaveTextContent("failure");
    }
};

const stateMachine = xstate.Machine(machineDeclaration);
// for some reason when merging from a structure, the meta.test isn't properly executing
// ie 
// const combinedMachine = merge(machineDeclaration, testMachineMeta);
// console.log('combinedMachine', combinedMachine.states.success);
// export const stateMachine = xstate.Machine(combinedMachine);


export const get = async (url) => {
  const result = await fetch(url);

  if (!result.ok) {
    throw Error(`Fetching "${url}" failed.`);
  }

  return result.json();
};
const loading = async () => {
  const resp = await get("http://localhost/users/davidorchard");

  if (resp) {
    return resp;
  } else {
    throw new Error();
  }
};

const TestComponent = () => {
  const [state] = useMachine(stateMachine, {
    services: { loading }
  });

  return (
    <div>
      <p data-testid="current_state">{state.value}</p>
      <p data-testid="name">{state.context.name}</p>
    </div>
  );
};

const stateMachineModel = createModel(
  xstate.createMachine(machineDeclaration)
).withEvents({
  "done.invoke.loading": () => {
  }, // Promise.resolve(),
  "error.platform.loading": () => {
    // here or in the test based upon path.state.meta
    return server.use(errorHandler());
  } // Promise.resolve(),
});

describe("StateMachine", () => {
  const testPlans = stateMachineModel.getShortestPathPlans();
  // the success case via magic
  // Seems unlikely that copying a reference will work long term
  testPlans.push(testPlans[1]);
  testPlans.forEach((plan, index) => {
    describe(plan.description, () => {
      afterEach(cleanup);
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          testIndex = index;
          if(index === testPlans.length - 1) {
            server.use(differentNameHandler());
          }
          // below works as well as setting in events.
          // const value = Object.keys(path.state.meta)[0];
          // const handler = value === "statemachine.failure" ? errorHandler : defaultHandler;
          // server.use(handler());
          // services require an await act, even if a findby is used inside meta
          await act(async () => {
            await path.test(render(<TestComponent />));
          });
        });
      });
    });
  });
});
