const msgType = process.env.NODE_ENV === "development" ? 1 : 2; // 规则提示类型

module.exports = {
  // 指定此配置文件为根配置文件，即停止在父级目录中寻找其他配置文件。
  root: true,
  // 指定代码的环境为 Node.js 环境，在 Node.js 项目中使用 ESLint 时需要设置。
  env: {
    node: true,
  },
  // 继承的 ESLint 配置。
  extends: [
    // 继承 Vue 的插件 plugin:vue/essential。它提供了一组用于 Vue.js 项目的 ESLint 规则。
    "plugin:vue/essential",
  ],
  // 指定全局变量，以告诉 ESLint 在验证过程中这些变量已经定义，从而避免产生未定义变量的警告
  globals: {},
  // 指定 ESLint 解析代码的解析器
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  // 可以用于设置和自定义 ESLint 的规则。您可以在这里添加和修改规则以符合您的代码风格和要求
  rules: {
    "vue/multi-word-component-names": 0, // 组件件名称是否以驼峰格式命名
    strict: 2, // 使用严格模式
    "no-alert": 2, // 禁止使用alert confirm prompt
    "no-console": [
      process.env.ENV_KEY === "development" ? 0 : 1,
      { allow: ["warn", "error"] },
    ], // 禁止使用console, 只能使用console.warn console.error
    "no-debugger": process.env.NODE_ENV === "development" ? 0 : 2, // 禁止使用debugger
    "prefer-arrow-callback": msgType, // 首选箭头函数
    "prefer-const": msgType, // 首选const
    "prefer-spread": msgType, // 首选展开运算
    "prefer-template": msgType, // 首选模板字符串
    quotes: [msgType, "single"], // 引号类型 `` "" ''
    // "quote-props": [msgType, "always"], // 对象字面量中的属性名是否强制双引号
    "jsx-quotes": [msgType, "prefer-double"], // 强制在 JSX 属性中一致使用双引号或单引号
    "no-useless-concat": msgType, // 不允许两个字符串连接在一起
    "no-multi-str": msgType, // 字符串不能用\换行
    "no-new": msgType, // 禁止在使用new构造一个实例后不赋值
    "no-new-func": msgType, // 禁止使用new Function
    "no-new-object": msgType, // 禁止使用new Object()
    "no-new-require": msgType, // 禁止使用new require
    "no-new-wrappers": msgType, // 禁止使用new创建包装实例，new String new Boolean new Number
    "no-array-constructor": msgType, // 不允许使用Array构造函数
    semi: msgType, // 语句强制分号结尾
    "semi-spacing": [msgType, { before: false, after: true }], // 分号前后空格
    "no-extra-semi": msgType, // 禁止多余的分号
    "func-style": [msgType, "expression"], // 使用函数表达式
    "no-underscore-dangle": msgType, // 标识符不能以_开头或结尾
    "no-await-in-loop": msgType, // 不允许await在循环体内使用
    "no-bitwise": msgType, // 不允许按位运算符
    "no-buffer-constructor": msgType, // 不允许调用和构造Buffer()构造函数
    "no-caller": msgType, // 阻止使用已弃用和次优代码
    "no-catch-shadow": msgType, // 禁止catch子句参数与外部作用域变量同名
    "no-cond-assign": msgType, // 禁止在条件表达式中使用赋值语句
    "no-confusing-arrow": msgType, // 不在可能与比较运算符混淆的地方使用箭头函数语法
    "no-const-assign": msgType, // 禁止修改const声明的常量
    "no-constant-condition": msgType, // 禁止在条件中使用常量表达式 if(true) if(1)
    "no-continue": msgType, // 禁止使用continue
    "no-control-regex": msgType, // 禁止在正则表达式中使用控制字符
    "no-delete-var": msgType, // 不能对var声明的变量使用delete操作符
    "no-div-regex": msgType, // 不能使用看起来像除法的正则表达式/=foo/
    "no-dupe-args": msgType, // 函数参数不能重复
    "no-dupe-class-members": msgType, // 类成员中不能有相同名称的声明
    "no-dupe-keys": msgType, // 在创建对象字面量时不允许键重复 {a:1,a:1}
    "no-duplicate-case": msgType, // switch中的case标签不能重复
    "no-duplicate-imports": msgType, // 从单个模块进行的所有导入都以单一import语句存在
    "no-empty": msgType, // 块语句中的内容不能为空
    "no-empty-character-class": msgType, // 正则表达式中的[]内容不能为空
    "no-eq-null": 0, // 禁止对null使用==或!=运算符
    "no-eval": msgType, // 禁止使用eval
    "no-ex-assign": msgType, // 禁止给catch语句中的异常参数赋值
    "no-extend-native": msgType, // 禁止扩展native对象
    "no-extra-bind": msgType, // 禁止不必要的函数绑定
    "no-extra-boolean-cast": msgType, // 禁止不必要的boolean转换
    "no-extra-label": msgType, // 消除不必要的标签
    "no-extra-parens": msgType, // 禁止非必要的括号
    "no-fallthrough": msgType, // 禁止switch穿透
    "no-floating-decimal": msgType, // 禁止省略浮点数中的0 .5 3.
    "no-func-assign": msgType, // 禁止重复的函数声明
    "no-global-assign": msgType, // 不允许修改只读全局变量
    "no-implicit-coercion": msgType, // 禁止隐式转换
    "no-implied-eval": msgType, // 禁止使用隐式eval
    "no-inner-declarations": [msgType, "functions"], // 禁止在块语句中使用声明（变量或函数）
    "no-invalid-regexp": msgType, // 禁止无效的正则表达式
    "no-invalid-this": msgType, // 禁止无效的this，只能用在构造器，类，对象字面量
    "no-irregular-whitespace": msgType, // 不能有不规则的空格
    "no-iterator": msgType, // 禁止使用__iterator__ 属性
    "no-label-var": msgType, // label名不能与var声明的变量名相同
    "no-labels": msgType, // 禁止标签声明
    "no-lone-blocks": msgType, // 禁止不必要的嵌套块
    "no-lonely-if": 0, // 将if语句作为else块中的唯一语句
    "no-mixed-operators": [
      msgType,
      {
        groups: [
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          ["&&", "||"],
        ],
      },
    ], // 复杂的表达式使用括号
    "no-mixed-spaces-and-tabs": msgType, // 禁止混用tab和空格
    "no-multi-spaces": msgType, // 不能用多余的空格
    "no-multiple-empty-lines": [msgType, { max: 1 }], // 空行最多不能超过1行
    "no-negated-condition": msgType, // 禁止不必要的否定条件
    "no-negated-in-lhs": msgType, // in 操作符的左边不能有!
    "no-nested-ternary": msgType, // 禁止使用嵌套的三目运算
    "no-obj-calls": msgType, // 不能调用内置的全局对象，比如Math() JSON()
    "no-octal": msgType, // 禁止使用八进制数字
    "no-octal-escape": msgType, // 禁止使用八进制转义序列
    "no-param-reassign": msgType, // 禁止给参数重新赋值
    "no-process-exit": msgType, // 禁止使用process.exit()
    "no-proto": msgType, // 禁止使用__proto__属性
    "no-redeclare": msgType, // 禁止重复声明变量
    "no-regex-spaces": msgType, // 禁止在正则表达式字面量中使用多个空格 /foo bar/
    "no-return-assign": msgType, // return 语句中不能有赋值表达式
    "no-script-url": msgType, // 禁止使用javascript:void(0)
    "no-self-compare": msgType, // 不能比较自身
    "no-sequences": msgType, // 禁止使用逗号运算符
    "no-shadow": msgType, // 外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
    "no-shadow-restricted-names": msgType, // 严格模式中规定的限制标识符不能作为声明时的变量名使用
    "no-spaced-func": msgType, // 函数调用时 函数名与()之间不能有空格
    "no-sparse-arrays": msgType, // 禁止稀疏数组， [1,,2]
    "no-trailing-spaces": msgType, // 一行结束后面不要有空格
    "no-throw-literal": msgType, // 禁止抛出字面量错误 throw "error";
    "no-undef": msgType, // 不能有未定义的变量
    "no-undef-init": msgType, // 变量初始化时不能直接给它赋值为undefined
    "no-undefined": msgType, // 不能使用undefined
    "no-unexpected-multiline": msgType, // 避免多行表达式
    "no-unneeded-ternary": msgType, // 禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
    "no-unreachable": msgType, // 不能有无法执行的代码
    "no-unused-expressions": msgType, // 禁止无用的表达式
    "no-unused-vars": [msgType, { vars: "all", args: "none" }], // 不能有声明后未被使用的变量或参数
    "no-use-before-define": msgType, // 未定义前不能使用
    "no-useless-call": msgType, // 禁止不必要的call和apply
    "no-void": msgType, // 禁用void操作符
    "no-var": msgType, // 禁用var，用let和const代替
    "no-with": msgType, // 禁用with
    "array-bracket-spacing": [msgType, "never"], // 是否允许非空数组里面有多余的空格
    "arrow-parens": [msgType, "always"], // 箭头函数用小括号括起来
    "arrow-spacing": [msgType, { before: true, after: true }], // =>的前/后括号
    "block-scoped-var": msgType, // 块语句中使用var
    "brace-style": [msgType, "1tbs"], // 大括号风格
    camelcase: "off", // 强制驼峰法命名
    "comma-dangle": [msgType, "never"], // 对象字面量项尾不能有逗号
    "comma-spacing": [msgType, { before: false, after: true }], // 逗号前后的空格
    "comma-style": [msgType, "last"], // 逗号风格，换行时在行首还是行尾
    "consistent-this": [msgType, "self"], // this别名
    curly: [msgType, "all"], // 必须使用 if(){} 中的{}
    "default-case": msgType, // switch语句最后必须有default
    "dot-location": [msgType, "object"], // 对象访问符的位置，换行的时候在行首还是行尾
    eqeqeq: 0, // 必须使用全等
    "func-names": [msgType, "never"], // 函数表达式必须有名字
    indent: [msgType, 2], // 缩进风格
    "init-declarations": [msgType, "always"], // 声明时必须赋初值
    "key-spacing": [msgType, { beforeColon: false, afterColon: true }], // 对象字面量中冒号的前后空格
    "max-depth": [msgType, 5], // 嵌套块深度
    "max-nested-callbacks": [msgType, 3], // 回调嵌套深度
    "max-params": [msgType, 5], // 函数最多只能有几个参数
    "object-curly-spacing": [msgType, "always"], // 大括号内是否允许不必要的空格
    "object-shorthand": msgType, // 强制对象字面量缩写语法
    "one-var": [msgType, "never"], // 连续声明
    "operator-assignment": [msgType, "never"], // 赋值运算符 += -=什么的
    "operator-linebreak": [msgType, "after"], // 换行时运算符在行尾还是行首
    "padded-blocks": [msgType, "never"], // 块语句内行首行尾是否要空行
    radix: msgType, // parseInt必须指定第二个参数
    "space-before-blocks": [msgType, "always"], // 不以新行开始的块{前面要不要有空格
    "space-before-function-paren": [msgType, "never"], // 函数定义时括号前面要不要有空格
    "space-in-parens": [msgType, "never"], // 小括号里面要不要有空格
    "space-unary-ops": [msgType, { words: true, nonwords: false }], // 一元运算符的前/后要不要加空格
    "use-isnan": msgType, // 禁止比较时使用NaN，只能用isNaN()
    "spaced-comment": [msgType, "always"], // 注释一致性
    "no-path-concat": 0, // node中不能使用__dirname或__filename做路径拼接
    "no-process-env": 0, // 禁止使用process.env
    "no-restricted-modules": 0, // 禁用指定node.js模块，使用就会报错
    "no-sync": 0, // nodejs 禁止同步方法
    "newline-after-var": 0, // 变量声明后是否需要空一行
  },
};
