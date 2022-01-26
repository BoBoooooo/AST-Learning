# AST 学习记录

![img](https://p6.music.126.net/obj/wo3DlcOGw6DClTvDisK1/12850755151/8918/c2b8/98c5/a8978b5caf1170e9ac0ae67d1b0de6ab.png)

AST 操作示例代码

- 简单 babel 转换示例：[normal](./normal)
- eslint 校验规则：[eslint](./eslint)
- jsx babel plugin 示例：[jsx](./jsx)

在线调试网站

https://astexplorer.net/

## AST 基本操作

`@babel/parser`

`@babel/traverse`

`@babel/generator`

`@babel/template`

`@babel/types`

https://juejin.cn/post/6984945589859385358#heading-6
https://jishuin.proginn.com/p/763bfbd5d305

https://babel.docschina.org/docs/en/babel-types

- Specifier 关键字
- Declaration 声明
- Literal 字面量
- Expression 表达式
- Statement 语句
- jsxElement JSX 元素
- jSXExpressionContainer JSX 属性表达式 {}

参考文章: https://toutiao.io/posts/yo2lcsa/preview

### Visitor(path, state)

path 对象

- 方法
  - replaceWith 单节点替换当前节点
  - replaceWithMultiple 多节点替换当前节点
  - findParent 搜索父节点
  - getSibling 获取兄弟节点
  - insertBefore 兄弟节点之前插入节点
  - insertAfter 兄弟节点之后插入节点
  - remove 移除当前节点
- 属性
  - node 节点
  - parent 父节点
  - parentPath 父节点 path
  - scope 作用域

## 类型判断

每一种节点类型，都有对应的类型判断方法：

```typescript
if (types.isIdentifier(n1)) {
  // ...
}

if (types.isExpressionStatement(n2)) {
  // ...
}
```

## 创建节点

- 基本数据类型

  ```javascript
  const id = types.identifier("abc"); // 变量
  const str = types.stringLiteral("Hello World"); // 字符串
  const num = types.numericLiteral(10e3); // 数字
  const bool = types.booleanLiteral(true); // 布尔值
  const regExp = types.regExpLiteral("\\.jsx?$", "g"); // 正则
  ```

- 数组

  ```javascript
  types.arrayExpression([
    types.stringLiteral("string"),
    types.numericLiteral(10e4),
    types.booleanLiteral(0.5 > Math.random()),
    types.regExpLiteral("\\.jsx?$", "g"),
  ]);
  ```

- 对象

  ```javascript
  const object = types.objectExpression([
    types.objectProperty(types.identifier("a"), types.nullLiteral()),
    types.objectProperty(
      // 字符串类型 key
      types.stringLiteral("*"),
      types.arrayExpression([])
    ),
    types.objectProperty(
      types.identifier("id"),
      types.identifier("id"),
      false,
      true
    ),
    types.objectProperty(
      types.memberExpression(
        types.identifier("props"),
        types.identifier("class")
      ),
      types.booleanLiteral(true),
      // 计算值 key
      true
    ),
  ]);
  ```

- JSX

  - JSXElement

    ```javascript
    types.jsxElement(
      types.jsxOpeningElement(types.jsxIdentifier("Text"), []),
      types.jsxClosingElement(types.jsxIdentifier("Text")),
      [types.jsxExpressionContainer(types.identifier("props.name"))]
    );
    ```

  - JSXFragment
    ```javascript
    types.jsxFragment(types.jsxOpeningFragment(), types.jsxClosingFragment(), [
      types.jsxElement(
        types.jsxOpeningElement(types.jsxIdentifier("Text"), []),
        types.jsxClosingElement(types.jsxIdentifier("Text")),
        [types.jsxExpressionContainer(types.identifier("props.name"))]
      ),
      types.jsxElement(
        types.jsxOpeningElement(types.jsxIdentifier("Text"), []),
        types.jsxClosingElement(types.jsxIdentifier("Text")),
        [types.jsxExpressionContainer(types.identifier("props.age"))]
      ),
    ]);
    ```

  ```

  - JSX AST 树结构
  - JSXElement 函数组件
    - openingElement `JSXOpeningElement`
      - name `JSXIdentifier` 标签名
      - attributes `JSXAttribute[]` 标签上属性
      - selfClosing 是否闭合
    - closingElement `JSXClosingElement`
      - name `JSXIdentifier` 闭合标签名
    - children `JSXText|JSXElement`
      - 递归嵌套
  ```

## 声明

- 变量声明 variableDeclaration
  ```javascript
  types.functionDeclaration(
    types.identifier("foo"),
    [types.identifier("arg1")],
    types.blockStatement([
      types.expressionStatement(
        types.callExpression(types.identifier("console.log"), [
          types.identifier("arg1"),
        ])
      ),
    ])
  );
  ```
- 函数声明 FunctionDeclaration
  ```javascript
  types.functionDeclaration(
    types.identifier("foo"),
    [types.identifier("arg1")],
    types.blockStatement([
      types.expressionStatement(
        types.callExpression(types.identifier("console.log"), [
          types.identifier("arg1"),
        ])
      ),
    ])
  );
  ```

## 导出 React 函数式组件

```javascript
types.program([
  types.importDeclaration(
    [types.importDefaultSpecifier(types.identifier("React"))],
    types.stringLiteral("react")
  ),
  t.importDeclaration(
    [
      t.importSpecifier(t.identifier("Button"), t.identifier("Button")),
      t.importSpecifier(t.identifier("Button"), t.identifier("Button")),
    ],
    t.stringLiteral("antd")
  ),
  types.exportDefaultDeclaration(
    types.arrowFunctionExpression(
      [types.identifier("props")],
      types.jsxElement(
        types.jsxOpeningElement(types.jsxIdentifier("Component"), [
          types.jsxAttribute(
            types.jsxIdentifier("onClick"),
            types.jSXExpressionContainer(types.identifier("handleClick"))
          ),
        ]),
        types.jsxClosingElement(types.jsxIdentifier("Component")),
        [
          types.jsxElement(
            types.jsxOpeningElement(types.jsxIdentifier("Image"), [
              types.jsxAttribute(
                types.jsxIdentifier("src"),
                types.stringLiteral(
                  "https://image1.suning.cn/uimg/cms/img/159642507148437980.png"
                )
              ),
            ]),
            types.jsxClosingElement(types.jsxIdentifier("Image")),
            [],
            true
          ),
        ],
        false
      )
    )
  ),
]);
```

Output:

```javascript
import React from "react";
import Button from "antd";

export default (props) => (
  <Component onClick={handleClick}>
    <Image src="https://image1.suning.cn/uimg/cms/img/159642507148437980.png"></Image>
  </Component>
);
```

## 具体应用场景

### babel 插件

```javascript
// 定义插件
const { declare } = require("@babel/helper-plugin-utils");

module.exports = declare((api, options) => {
  return {
    name: "your-plugin", // 定义插件名
    visitor: {
      // 编写业务 visitor
      Identifier(path, state) {
        // ...
      },
    },
  };
});

// 配置 babel.config.js
module.exports = {
  presets: [
    require("@babel/preset-env"), // 可配合通用的 present
  ],
  plugins: [
    require("your-plugin"),
    // require('./your-plugin') 也可以为相对目录
  ],
};
```
### 代码降级 es6 to es5

### babel-plugin-import

按需引入

### LowCode 可视化编码

通过 AST 方式驱动,结合拖拽操作,同步更新代码

### eslint

自定义eslint rule

### Markdown2Html

unified

react-markdown