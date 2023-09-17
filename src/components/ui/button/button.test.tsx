import renderer from "react-test-renderer";
import { render, screen, fireEvent } from "@testing-library/react";

import { Button } from "./button";

describe("Тестирование компонента Button", () => {
  it("отрисовка кнопки с текстом", () => {
    const tree = renderer.create(<Button text="текст" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("отрисовка кнопки без текста", () => {
    const tree = renderer.create(<Button />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("отрисовка заблокированной кнопки", () => {
    const tree = renderer
      .create(<Button disabled={true} text="текст" />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("отрисовка кнопки с индикацией загрузки", () => {
    const tree = renderer.create(<Button isLoader />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("корректность вызова колбека при клике на кнопку", () => {
    const random = `test-button-${Math.random()}`;
    const callback = jest.fn();

    render(<Button text={random} onClick={callback} />);

    fireEvent.click(screen.getByText(random));

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
