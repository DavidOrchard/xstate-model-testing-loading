import { rest } from "msw";

export const defaultHandler = () => {
  return rest.get("/users/davidorchard", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: "DavidOrchard"
      })
    );
  });
};

export const initialHandler = () => {
  return rest.get("/init", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: "init"
      })
    );
  });
};

export const differentNameHandler = () => {
  return rest.get("/users/davidorchard", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: "DecimusMaximus"
      })
    );
  });
};

export const errorHandler = () => {
  return rest.get("/users/davidorchard", (req, res, ctx) => {
    return res(
      ctx.status(500)
    );
  });
};

export const handlers = [
  defaultHandler(),
  initialHandler()
];
