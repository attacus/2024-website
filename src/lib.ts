type Nested<T> = T & { children: Nested<T>[] }
export function nestHeadings<T extends { depth: number }>(
  headings: T[],
): Nested<T>[] {
  if (!headings[0]) return []
  const topDepth = headings[0].depth
  const result: Nested<T>[] = []
  for (const heading of headings) {
    let adjustedDepth = heading.depth - topDepth
    //console.log(heading, adjustedDepth)
    let childList = result
    while (adjustedDepth > 0) {
      childList = childList[childList.length - 1]!.children
      adjustedDepth--
    }
    childList.push({ ...heading, children: [] })
  }

  // if there is only one top-level heading, exclude it from the nav
  // and make all of its children top-level instead
  if (result.length === 1) {
    return result[0]!.children
  }
  return result
}

export function nestedMap<T, U, F extends (datum: T, children: U[]) => U>(
  data: Nested<T>[],
  func: F,
): U[] {
  return data.map((datum) => func(datum, nestedMap(datum.children, func)))
}