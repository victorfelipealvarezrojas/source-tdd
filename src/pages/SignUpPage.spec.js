import { render, screen } from "@testing-library/react";
import SignUpPage from "./SignUpPage";

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
});
