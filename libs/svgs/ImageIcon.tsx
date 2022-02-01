import * as React from "react"
import { SVGProps } from "react"

const ImgIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    style={{
      fill: "#000",
    }}
    {...props}
  >
    <circle cx={7.499} cy={9.5} r={1.5} />
    <path d="m10.499 14-1.5-2-3 4h12l-4.5-6z" />
    <path d="M19.999 4h-16c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm-16 14V6h16l.002 12H3.999z" />
  </svg>
)

export default ImgIcon
