function isPOJO(arg: any): boolean {
  if (arg == null || typeof arg !== 'object') return false;
  const proto = Object.getPrototypeOf(arg);
  if (proto == null) return true;
  return proto === Object.prototype;
}

export default function flattenObj(obj: Record<string, any>) {
  function objectVisitor(obj: any, parents: string[] = []) {
    let res: Record<string, any> = {};
    const entries = Object.entries(obj);
    if (entries.length > 0)
      entries.forEach(([key, value]) => {
        if (!isPOJO(value)) res[`${parents.join('.')}${parents.length > 0 ? '.' : ''}${key}`] = value;
        else res = { ...res, ...objectVisitor(value, parents.concat(key)) };
      });
    else res[parents.join('.')] = {}
    return res;
  }
  return objectVisitor(obj);
}