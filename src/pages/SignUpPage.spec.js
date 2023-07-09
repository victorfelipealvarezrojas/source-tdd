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
        expect(input.length).toBe(2);
      });
    it("has username input v2", () => {
      render(<SignUpPage />);
      const input = screen.getByPlaceholderText("username");
      expect(input).toBeInTheDocument();
    });
    it("has email input", () => {
        render(<SignUpPage />);
        const input = screen.getByPlaceholderText("email");
        expect(input).toBeInTheDocument();
      });
  });
});
