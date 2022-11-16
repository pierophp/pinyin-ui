/**
 * Remove that, changing the default Array behaviour is bad
 */
// @ts-ignore
Array.prototype.remove = function remove(from, to) {
  const rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  // eslint-disable-next-line
  return this.push.apply(this, rest);
};
