export const getMethodOrder = (method: string) => {
  switch (method) {
    case "get":
      return 1
    case "post":
      return 2
    case "delete":
      return 3
    default:
      return 4
  }
}

export const compareOperations = ({
  httpMethodA,
  httpMethodB,
  summaryA,
  summaryB,
}: {
  httpMethodA: string
  httpMethodB: string
  summaryA: string
  summaryB: string
}) => {
  const aOrder = getMethodOrder(httpMethodA)
  const bOrder = getMethodOrder(httpMethodB)

  if (aOrder !== bOrder) {
    return aOrder - bOrder
  }

  return summaryA.localeCompare(summaryB)
}
