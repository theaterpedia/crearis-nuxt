interface LooseObject {
  label?: string
  message?: string | Error
  location?: string
  path?: any
  query?: string
  variables?: string
  locations?: any
  operation?: any
}
declare const _default: ({ label, message, locations, path, operation }: LooseObject) => void
export default _default
//# sourceMappingURL=logBuilder.d.ts.map
