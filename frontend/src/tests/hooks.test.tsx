import { test } from "vitest";
import { screen, render, act, fireEvent } from "@testing-library/react";
import { useCounter } from "../utils/hooks";

test("useCounter increments and decrements count correctly", () => {
  const Component = () => {
    const [count, Counter] = useCounter();
    return (
      <div>
        <div data-testid="count">{count}</div>
        <Counter />
      </div>
    );
  };
  render(<Component />);

  expect(screen.getByTestId("count")).toHaveTextContent("1");

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "-" }));
  });

  expect(screen.getByTestId("count")).toHaveTextContent("0");

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "+" }));
  });

  expect(screen.getByTestId("count")).toHaveTextContent("1");
});