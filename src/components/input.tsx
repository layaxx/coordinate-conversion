import { HTMLAttributes } from "preact/compat"

const Input = (inputProps: HTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="max-w-sm min-w-[50px]">
      <input
        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-1.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        {...inputProps}
      />
    </div>
  )
}

export default Input
