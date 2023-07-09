import { render, screen } from "@testing-library/react";
import SignUpPage from "./SignUpPage";

it("has header", () => {
  render(<SignUpPage />);
  const header = screen.queryByRole("heading", { name: "Sign Up" })
  expect(header).toBeInTheDocument();
});
