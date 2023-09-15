import renderer from "react-test-renderer";

import { Circle } from "./circle";
import { ElementStates } from "../../../types/element-states";

describe("Тестирование компонента Circle", () => {
  it("отрисовка без буквы", () => {
    const tree = renderer.create(<Circle letter="" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("отрисовка с буквами", () => {
    const tree = renderer.create(<Circle letter="1" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("отрисовка с head", () => {
    const tree = renderer.create(<Circle letter="H" head="head" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("отрисовка с react-элементом в head", () => {
    const tree = renderer
      .create(<Circle letter="P" head={<Circle letter="C" />} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("отрисовка с tail", () => {
    const tree = renderer.create(<Circle letter="T" tail="tail" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("отрисовка с react-элементом в tail", () => {
    const tree = renderer
      .create(<Circle letter="T" tail={<Circle letter="t" />} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("отрисовка с index", () => {
    const tree = renderer.create(<Circle index={1} letter="a" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("отрисовка с пропом isSmall === true", () => {
    const tree = renderer.create(<Circle isSmall={true} letter="s" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("отрисовка в состоянии default", () => {
    const tree = renderer
      .create(<Circle letter="D" state={ElementStates.Default} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("отрисовка в состоянии changing", () => {
    const tree = renderer
      .create(<Circle letter="C" state={ElementStates.Changing} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("отрисовка в состоянии modified", () => {
    const tree = renderer
      .create(<Circle letter="M" state={ElementStates.Modified} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
