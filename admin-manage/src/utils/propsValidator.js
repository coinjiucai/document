/**
 * 用于props的自定义类型校验，可校验类型为null，undefined，Date和Array的特殊情况
 * @param value prop的值
 * @param types prop的类型的字符串数组（小写的），除了官方指定的类型，还支持null，undefined，Date和Array
 * @returns {boolean}
 */
export default (value, types) => {
  if (types.includes(typeof value) && typeof value !== "object") {
    return true;
  } else if (typeof value === "object") {
    // 注意：null的判断要在required为true的时候才会触发，否则null一般会被视为有效值，且在值为null的时候不会触发validator校验
    // 换句话说，只要required不为true，默认都是支持null的类型，不过建议还是在types中传入“null”，
    if (value === null && types.includes("null")) {
      return true;
    } else if (value instanceof Date && types.includes("date")) {
      return true;
    } else if (Array.isArray(value) && types.includes("array")) {
      return true;
    } else if(types.includes("object")&&value !== null&&!value instanceof Date&&!Array.isArray(value)) {
      return true;
    }
  }
  let type = (typeof value).charAt(0).toUpperCase() + (typeof value).slice(1);
  if (type === "Object") {
    if (Array.isArray(value)) {
      type = "Array";
    } else if (value === null) {
      type = "null";
    } else if (value instanceof Date) {
      type = "Date";
    }
  }
  const typesStr = types.reduce((pre, next, index) => {
    let str = next;
    if (str !== "null" && str !== "undefined") {
      str = str.charAt(0).toUpperCase() + str.slice(1);
    }
    if (index === 0) {
      return str;
    } else if (types.length > 2 && index === types.length - 1) {
      return `${pre} or ${str}`;
    } else {
      return `${pre}, ${str}`;
    }
  }, "");
  // 这边抛出的错误需要在props的validator中catch，这样方便定位到具体问题组件。
  throw new Error(`Invalid prop: type check failed for prop "value". Expected ${typesStr}, got ${type}.`);
};
