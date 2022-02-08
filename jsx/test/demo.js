import traverse from "@babel/traverse";
import generator from "@babel/generator";
import * as parser from "@babel/parser";
import * as t from "@babel/types";

// 源代码
const code = `
  import React from "react";

  export default () => {
    return <Container></Container>;
  };
`;

const ast = parser.parse(code, {
  sourceType: "module",
  plugins: ["jsx"],
});

traverse(ast, {
  // 1. 程序顶层 新增import语句
  Program(path) {
    path.node.body.unshift(
      t.importDeclaration(
        // importSpecifier表示具名导入，相应的匿名导入为ImportDefaultSpecifier
        // 具名导入对应代码为 import { Button as Button } from 'antd'
        // 如果相同会自动合并为 import { Button } from 'antd'
        [t.importSpecifier(t.identifier("Button"), t.identifier("Button"))],
        t.stringLiteral("antd")
      )
    );
  },
  // 访问JSX节点，插入Button
  JSXElement(path) {
    if (path.node.openingElement.name.name === "Container") {
      path.node.children.push(
        t.jsxElement(
          t.jsxOpeningElement(t.jsxIdentifier("Button"), []),
          t.jsxClosingElement(t.jsxIdentifier("Button")),
          [t.jsxText("按钮")],
          false
        )
      );
    }
  },
});

const newCode = generator(ast).code;
console.log(newCode);