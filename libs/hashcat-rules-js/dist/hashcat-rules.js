function f(e) {
  return e.toLowerCase();
}
function A(e) {
  return e.toUpperCase();
}
function l(e) {
  return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
}
function b(e) {
  return e.charAt(0).toLowerCase() + e.slice(1).toUpperCase();
}
function o(e, c) {
  if (isNaN(parseInt(c)) && (c = convertN(c)), e.charAt(c) === e.charAt(c).toUpperCase())
    return e.slice(0, c) + e.charAt(c).toLowerCase() + e.slice(c + 1);
  if (e.charAt(c) === e.charAt(c).toLowerCase())
    return e.slice(0, c) + e.charAt(c).toUpperCase() + e.slice(c + 1);
}
function k(e) {
  for (var c = 0; c < e.length; c++)
    e = o(e, c);
  return e;
}
function u(e) {
  return e.split("").reverse().join("");
}
function v(e) {
  return e + e;
}
function t(e, c) {
  var a = "";
  c = convertN(c);
  for (var r = 0; r < c; r++)
    a += e;
  return a;
}
function n(e) {
  return e + u(e);
}
function p(e) {
  return e.slice(1) + e.charAt(0);
}
function N(e) {
  return e.charAt(e.length - 1) + e.slice(0, e.length - 1);
}
function C(e, c) {
  return e + c;
}
function R(e, c) {
  return c + e;
}
function L(e) {
  return e.slice(1);
}
function w(e) {
  return e.slice(0, e.length - 1);
}
function D(e, c) {
  return c = convertN(c), e.slice(0, c) + e.slice(c + 1);
}
function T(e, c, a) {
  return c = convertN(c), a = convertN(a), e.slice(c, a);
}
function U(e, c, a) {
  return c = convertN(c), a = convertN(a), e.slice(0, c) + e.slice(c + a);
}
function m(e, c, a) {
  return c = convertN(c), e.slice(0, c) + a + e.slice(c);
}
function x(e, c, a) {
  return c = convertN(c), c >= e.length ? e : e.slice(0, c) + a + e.slice(c + 1);
}
function z(e, c) {
  return e.slice(0, c);
}
function h(e, c, a) {
  return e.replaceAll(c, a);
}
function I(e, c) {
  return h(e, c, "");
}
function O(e, c) {
  return t(e.charAt(0), c) + e;
}
function P(e, c) {
  return e.length === 0 ? e : e + t(e.charAt(e.length - 1), c);
}
function j(e) {
  for (var c = "", a = e.length, r = 0; r < a; r++)
    c += e.charAt(r) + e.charAt(r);
  return c;
}
function q(e, c) {
  if (c.trim().charAt(0) === "#" || c.trim().length === 0)
    return !1;
  for (var a = 0; a < c.length; )
    switch (c.charAt(a)) {
      case ":":
        e = e, a++;
        break;
      case "l":
        e = f(e), a++;
        break;
      case "u":
        e = A(e), a++;
        break;
      case "c":
        e = l(e), a++;
        break;
      case "C":
        e = b(e), a++;
        break;
      case "t":
        e = k(e), a++;
        break;
      case "T":
        e = o(e, c.charAt(a + 1)), a += 2;
        break;
      case "r":
        e = u(e), a++;
        break;
      case "d":
        e = v(e), a++;
        break;
      case "p":
        e = t(e, c.charAt(a + 1)), a += 2;
        break;
      case "f":
        e = n(e), a++;
        break;
      case "{":
        e = p(e), a++;
        break;
      case "}":
        e = N(e), a++;
        break;
      case "$":
        e = C(e, c.charAt(a + 1)), a += 2;
        break;
      case "^":
        e = R(e, c.charAt(a + 1)), a += 2;
        break;
      case "[":
        e = L(e), a++;
        break;
      case "]":
        e = w(e), a++;
        break;
      case "D":
        e = D(e, c.charAt(a + 1)), a += 2;
        break;
      case "x":
        e = T(e, c.charAt(a + 1), c.charAt(a + 2)), a += 3;
        break;
      case "O":
        e = U(e, c.charAt(a + 1), c.charAt(a + 2)), a += 3;
        break;
      case "i":
        e = m(e, c.charAt(a + 1), c.charAt(a + 2)), a += 3;
        break;
      case "o":
        e = x(e, c.charAt(a + 1), c.charAt(a + 2)), a += 3;
        break;
      case "'":
        e = z(e, c.charAt(a + 1)), a += 2;
        break;
      case "s":
        e = h(e, c.charAt(a + 1), c.charAt(a + 2)), a += 3;
        break;
      case "@":
        e = I(e, c.charAt(a + 1)), a += 2;
        break;
      case "z":
        e = O(e, c.charAt(a + 1)), a += 2;
        break;
      case "Z":
        e = P(e, c.charAt(a + 1)), a += 2;
        break;
      case "q":
        e = j(e), a++;
        break;
      default:
        a++;
        break;
    }
  return e;
}
export {
  q as applyRule
};
