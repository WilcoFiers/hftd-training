export type Template = {
  render(vars: { [propName: string]: any }): string
}

export default function t(str: string): Template {
  return {
    render(vars: { [propName: string]: string }) {
      let out = str
      for (const [key, val] of Object.entries(vars)) {
        out = out.replace(new RegExp('\\${\\s*' + key + '\\s*}', 'ig'), val)
      }
      return out
    }
  }
}
