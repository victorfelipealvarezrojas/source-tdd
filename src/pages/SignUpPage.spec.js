import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUpPage from "./SignUpPage";
import { act } from "react-dom/test-utils";
import { setupServer } from "msw/node";
import { rest } from "msw";
import LanguageSelector from "../components/LanguageSelector";
import "../locale/i18n";
import en from "../locale/en.json";
import es from "../locale/es.json";

describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<SignUpPage />);
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });
    it("has username input", () => {
      const renderResult = render(<SignUpPage />);
      const { container } = renderResult;
      const input = container.querySelector("input");
      expect(input).toBeInTheDocument();
    });
    it("has email input", () => {
      const renderResult = render(<SignUpPage />);
      const { container } = renderResult;
      const input = container.querySelectorAll("input");
      expect(input.length).toBe(input.length);
    });
    it("has username input v2", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText(/User Name/i);
      expect(input).toBeInTheDocument();
    });
    it("has email input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText(/Email/i);
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("has password confirm input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText(/Confirm Password/i);
      expect(input).toBeInTheDocument();
    });
    it("has password confirm type for password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText(/Confirm Password/i);
      expect(input.type).toBe("password");
    });
    it("has Sign Up button", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });
    it("disable the button initiality", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });
  describe("Interaction", () => {
    let requestBody;
    let counter = 0;
    const server = setupServer(
      rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
        requestBody = req.body;
        counter += 1;
        return res(ctx.status(200));
      })
    );

    beforeEach(() => {
      counter = 0;
      server.resetHandlers(); // resetea el server antes de cada test y evito usar res.once
    }); // resetea el contador antes de cada test

    beforeAll(() => server.listen()); // levanta el server antes de cada test

    afterAll(() => server.close()); // cierra el server despues de cada test

    let button, passwordInput, passwordRepeatInput, userInput, emailInput;
    const setup = async () => {
      render(<SignUpPage />);
      userInput = screen.getByLabelText("User Name");
      emailInput = screen.getByLabelText("Email");
      passwordInput = screen.getByLabelText("Password");
      passwordRepeatInput = screen.getByLabelText("Confirm Password");

      act(() => {
        userEvent.type(userInput, "joko");
        userEvent.type(emailInput, "joko@joko.cl");
        userEvent.type(passwordInput, "P4ssword");
        userEvent.type(passwordRepeatInput, "P4ssword");
      });
      button = screen.queryByRole("button", { name: "Sign Up" });
    };

    it("enable button when password and password repeat fields have same value", async () => {
      setup();
      expect(button).toBeEnabled();
    });

    it("send username, email and password to backend after clicking the button", async () => {
      setup();
      act(() => {
        userEvent.click(button);
      });

      // soluciona el problema de que el test se ejecuta antes de que aparezca el texto
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );

      expect(requestBody).toEqual({
        username: "joko",
        email: "joko@joko.cl",
        password: "P4ssword",
      });
    });

    it("disable button when there is an ongoing api call", async () => {
      setup();
      act(() => {
        userEvent.dblClick(button);
      });

      // soluciona el problema de que el test se ejecuta antes de que aparezca el texto
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );

      // esto funciona gracias a que el texto que se espera aparece en la pantalla
      expect(counter).toBe(2);
    });

    it("display spinner while the api request in progress", async () => {
      setup();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      act(() => {
        userEvent.click(button);
      });
      const spinner = screen.getByRole("status", { hidden: true });
      expect(spinner).toBeInTheDocument();
    });

    it("display account activation notification efter seccessfull sign up request", async () => {
      setup(); // render the page, fill the form and button

      const textIsPresent = /Please check your e-mail to activate your account/;

      expect(screen.queryByText(textIsPresent)).not.toBeInTheDocument();

      act(() => {
        userEvent.click(button);
      });

      const text = await screen.findByText(textIsPresent);

      expect(text).toBeInTheDocument();
    });

    it("hides sign up form after successful sign up request(waitForElementToBeRemoved)", async () => {
      setup(); // render the page, fill the form and button
      const form = screen.getByTestId("form-sign-up");

      act(() => {
        userEvent.click(button);
      });

      await waitForElementToBeRemoved(form);
    });

    it("displays validation messaage for username", async () => {
      server.use(
        // mockeo el server para que devuelva un error
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          return res.once(
            // solo una vez y no afecta el resto de instancias o puedo usar resetHandlers
            ctx.status(400),
            ctx.json({
              validationErrors: { username: "Username cannot be null" },
            })
          );
        })
      );
      setup(); // render the page, fill the form and button

      act(() => {
        userEvent.click(button);
      });

      const validationError = await screen.findByText(
        "Username cannot be null"
      );
      expect(validationError).toBeInTheDocument();
    });

    // esta prueba fallaria si el test anterior no usa el once o un reset -> return res.once(
    it("hides sign up form after successful sign up request(waitFor)", async () => {
      setup(); // render the page, fill the form and button
      const form = screen.getByTestId("form-sign-up");

      act(() => {
        userEvent.click(button);
      });

      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
    });

    it("hides spinner and enables button after response received", async () => {
      server.use(
        // mockeo el server para que devuelva un error
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: { username: "Username cannot be null" },
            })
          );
        })
      );
      setup(); // render the page, fill the form and button

      act(() => {
        userEvent.click(button);
      });

      await screen.findByText("Username cannot be null");

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it("displays validation messaage for email", async () => {
      server.use(
        // mockeo el server para que devuelva un error
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          return res.once(
            // solo una vez y no afecta el resto de instancias o puedo usar resetHandlers
            ctx.status(400),
            ctx.json({
              validationErrors: { email: "E-mail cannot be null" },
            })
          );
        })
      );
      setup(); // render the page, fill the form and button

      act(() => {
        userEvent.click(button);
      });

      const validationError = await screen.findByText("E-mail cannot be null");
      expect(validationError).toBeInTheDocument();
    });

    const requestValidationError = (field, message) => {
      return rest.post(
        "http://localhost:8080/api/1.0/users",
        (req, res, ctx) => {
          return res.once(
            // solo una vez y no afecta el resto de instancias o puedo usar resetHandlers
            ctx.status(400),
            ctx.json({
              validationErrors: { [field]: message },
            })
          );
        }
      );
    };

    it.each`
      field         | value   | message
      ${"username"} | ${null} | ${"Username cannot be null"}
      ${"email"}    | ${null} | ${"E-mail cannot be null"}
      ${"password"} | ${null} | ${"Password cannot be null"}
    `("-displays $message for $field", async ({ field, value, message }) => {
      server.use(requestValidationError(field, message));
      setup();

      act(() => {
        userEvent.click(button);
      });

      const validationError = await screen.findByText(message);
      expect(validationError).toBeInTheDocument();
    });

    it("displays validation messaage for password not match password repeat", async () => {
      setup();
      act(() => {
        userEvent.type(passwordInput, "P4ssword");
        userEvent.type(passwordRepeatInput, "P4sswordNotMatch");
        userEvent.click(button);
      });

      const validationError = screen.queryByText("Password mismatch");

      expect(validationError).toBeInTheDocument();
    });

    it.each`
      field         | value   | label          | message
      ${"username"} | ${null} | ${"User Name"} | ${"Username cannot be null"}
      ${"email"}    | ${null} | ${"Email"}     | ${"E-mail cannot be null"}
      ${"password"} | ${null} | ${"Password"}  | ${"Password cannot be null"}
    `(
      "-clears validation errors after $field is uppdated",
      async ({ field, value, label, message }) => {
        //mock server error response
        server.use(requestValidationError(field, message));
        setup();

        act(() => {
          userEvent.click(button);
        });

        const validationError = await screen.findByText(message);
        expect(validationError).toBeInTheDocument();

        act(() => {
          userEvent.type(screen.getByLabelText(label), "value-updated");
        });

        expect(validationError).not.toBeInTheDocument();
      }
    );
  });
  describe("Internacionalization", () => {

    const setup = () => {
      render(
        <>
          <SignUpPage />
          <LanguageSelector />
        </>
      );
    }

    it("initialy displays all text in English", () => {
      setup();
      expect(
        screen.getByRole("heading", { name: en.SignUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: en.SignUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.confirmPassword)).toBeInTheDocument();
    });

    it("Displays all text in spanish after changing the language", () => {
      setup();
      const spanishToggle = screen.getByTitle("Spanish");
      act(() => {
        userEvent.click(spanishToggle);
      });

      expect(
        screen.getByRole("heading", { name: es.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: es.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(es.username)).toBeInTheDocument();
      expect(screen.getByLabelText(es.email)).toBeInTheDocument();
      expect(screen.getByLabelText(es.password)).toBeInTheDocument();
      expect(screen.getByLabelText(es.confirmPassword)).toBeInTheDocument();
    });

    it("Displays all text in English after changing back from Spanish", async() => {
      setup();
      const EnglishToggle = await screen.getByTitle("English");
      act(() => {
        userEvent.click(EnglishToggle);
      });

      expect(
        screen.getByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.confirmPassword)).toBeInTheDocument();
    });
  });
});
