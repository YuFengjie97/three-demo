import classNames from "classnames"

export function createStyleWrap(styleModule: CSSModuleClasses) {
  return function(...args: string[]){
    return classNames(...args.map(item => styleModule[item]))
  }
}