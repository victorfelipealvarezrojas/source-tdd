import { render, screen } from "@testing-library/react";
import AccountActivationPage from "./ActivationPage";
import { setupServer } from "msw/node";
import { rest } from "msw";
import "../locale/i18n";

let counter = 0;
const server = setupServer(
  rest.post(
    "http://localhost:8080/api/1.0/users/token/:token",
    (req, res, ctx) => {
      counter += 1;
      return res(ctx.status(200));
    }
  )
);

beforeEach(() => {
  server.resetHandlers();
  counter = 0;
});

beforeAll(() => server.listen());

afterAll(() => server.close());

describe("Account Activation Page", () => {
  const setup = (token) => {
    window.history.pushState({}, "", `/activate/12345`);
    render(<AccountActivationPage match={token} />);
  };

  it("displays activation success message when token is valid", async () => {
    setup("12345");
    const message = await screen.findByText("Account is activated");
    expect(message).toBeInTheDocument();
  });

  it("Send activation request to backend", async () => {
    setup("12345");
    await screen.findByText("Account is activated");
    expect(counter).toBe(1);
  });

  it("Send activation request to backend", async () => {
    server.use(
      // mockeo el server para que devuelva un error
      rest.post(
        "http://localhost:8080/api/1.0/users/token/:token",
        (req, res, ctx) => {
          return res.once(ctx.status(400));
        }
      )
    );
    setup("12345");
    const alert = await screen.findByText("Activation failure");
    expect(alert).toBeInTheDocument();
  });
});
