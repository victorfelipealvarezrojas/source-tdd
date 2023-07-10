import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUpPage from "./SignUpPage";
import { act } from "react-dom/test-utils";
import { setupServer } from "msw/node";
import { rest } from "msw";

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
    it("enable button when password and password repeat fields have same value", async () => {
      render(<SignUpPage />);
      const password = screen.getByLabelText("Password");
      const passwordRepeat = screen.getByLabelText("Confirm Password");

      const button = screen.queryByRole("button", { name: "Sign Up" });

      act(() => {
        userEvent.type(password, "P4ssword");
        userEvent.type(passwordRepeat, "P4ssword");
      });

      expect(button).toBeEnabled();
    });

    it("send username, email and password to backend after clicking the button", async () => {
      let requestBody;
      const server = setupServer(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res(ctx.status(200));
        })
      );
      server.listen();
      render(<SignUpPage />);
      const userInput = screen.getByLabelText("User Name");
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const passwordRepeatInput = screen.getByLabelText("Confirm Password");
      const button = screen.queryByRole("button", { name: "Sign Up" });

      act(() => {
        userEvent.type(userInput, "joko");
        userEvent.type(emailInput, "joko@joko.cl");
        userEvent.type(passwordInput, "P4ssword");
        userEvent.type(passwordRepeatInput, "P4ssword");
        userEvent.click(button);
      });

      await new Promise((resolve) => setTimeout(resolve, 500));


      expect(requestBody).toEqual({
        username: "joko",
        email: "joko@joko.cl",
        password: "P4ssword",
      });
    });
  });
});
