import React from "react";
import * as xstate from "xstate";
import { useMachine } from "@xstate/react";
import { createModel } from "@xstate/test";
import { act, render, cleanup } from "@testing-library/react";
import { stateMachine, machineDeclaration } from "./index";
import "@testing-library/jest-dom/extend-expect";

const loading = async () => {
  console.log("loading service");
  // do something dynamic based upon a config
  if (false) {
    return true;
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
    </div>
  );
};

const stateMachineModel = createModel(xstate.createMachine(machineDeclaration));

describe("StateMachine", () => {
  const testPlans = stateMachineModel.getShortestPathPlans();

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      afterEach(cleanup);
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          // services require an await act, even if a findby is used inside meta
          await act(async () => {
            await path.test(render(<TestComponent />));
          });
        });
      });
    });
  });
});
