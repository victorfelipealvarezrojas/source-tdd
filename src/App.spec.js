import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { act } from "react-dom/test-utils";
import App from "./App";


const server = setupServer(
  rest.post("http://localhost:8080/api/1.0/users/token/:token", (req, res, ctx) => {
    return res(ctx.status(200));
  })
);

beforeEach(() => server.resetHandlers());

beforeAll(() => server.listen());

afterAll(() => server.close());

describe("Routing", () => {

    const setup = (path) =>  {
        window.history.pushState({}, "", path);
        render(<App/>)
    };

    it.each`
    path                | pageTestId
    ${"/"}              | ${"home-page"}
    ${"/signup"}        | ${"signup-page"}
    ${"/login"}         | ${"login-page"}
    ${"/user/123"}      | ${"user-page"}
    ${"/activate/123"}  | ${"activation-page"}
    ${"/activate/456"}  | ${"activation-page"}
    `("displays $pageTestId when at $path", ({ path, pageTestId }) => {
        setup(path);
        const page = screen.queryByTestId(pageTestId);
        expect(page).toBeInTheDocument();
    });

    it.each`
    path                | pageTestId
    ${"/"}              | ${"signup-page"} // <-- aqui invierto las rutas para validar que no esten en el DOM
    ${"/"}              | ${"login-page"}
    ${"/"}              | ${"user-page"}
    ${"/"}              | ${"activation-page"}
    ${"/signup"}        | ${"home-page"}
    ${"/signup"}        | ${"login-page"}
    ${"/signup"}        | ${"user-page"}
    ${"/signup"}        | ${"activation-page"}
    ${"/login"}         | ${"signup-page"}
    ${"/login"}         | ${"home-page"}
    ${"/login"}         | ${"user-page"}
    ${"/login"}         | ${"activation-page"}
    ${"/user/123"}      | ${"signup-page"}
    ${"/user/123"}      | ${"home-page"}
    ${"/user/123"}      | ${"login-page"}
    ${"/user/123"}      | ${"activation-page"}
    ${"/activate/123"}  | ${"signup-page"}
    ${"/activate/123"}  | ${"home-page"}
    ${"/activate/123"}  | ${"login-page"}
    ${"/activate/123"}  | ${"user-page"}
    `("does not displays $pageTestId when at $path", ({ path, pageTestId }) => {
        window.history.pushState({}, "", path);
        setup(path);
        const page = screen.queryByTestId(pageTestId);
        expect(page).not.toBeInTheDocument();
    });

    it.each`
    targetPage
    ${"Home"}
    ${"Sign Up"}
    ${"Login"}
    `("has link to $targetPage on NavBar", ({ targetPage }) => {
      setup();
      const link = screen.getByRole("link", { name: targetPage });
      expect(link).toBeInTheDocument();
    });

    it.each`
    targetPage   | pageTestId
    ${"Home"}    | ${"home-page"}
    ${"Sign Up"} | ${"signup-page"}
    ${"Login"}   | ${"login-page"}
    `("displays $targetPage up page after clicking $pageTestId up link", async({targetPage, pageTestId}) => {
        setup();
        const link = await screen.getByRole("link", { name: targetPage });
        act(() => {
           userEvent.click(link);
        });
        expect(screen.getByTestId(pageTestId)).toBeInTheDocument();
    });

    it.each`
    initialPath   | clickinTo     | pageTestId
    ${"/"}        | ${"Sign Up"}  | ${"signup-page"}
    ${"/signup"}  | ${"Home"}     | ${"home-page"}
    ${"/login"}   | ${"Login"}    | ${"login-page"}
    `("displays $clickinTo up page after clicking $clickinTo", async({initialPath,clickinTo, pageTestId}) => {
        setup(initialPath);
        const link = await screen.getByRole("link", { name: clickinTo });
        act(() => {
           userEvent.click(link);
        });
        expect(screen.getByTestId(pageTestId)).toBeInTheDocument();
    });

});