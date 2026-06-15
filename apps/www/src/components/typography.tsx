import React from "react"

type H1Props = React.ComponentProps<"h1">
type H2Props = React.ComponentProps<"h2">
type H3Props = React.ComponentProps<"h3">
type H4Props = React.ComponentProps<"h4">
type H5Props = React.ComponentProps<"h5">
type H6Props = React.ComponentProps<"h6">
type PProps = React.ComponentProps<"p">

export function H1(props: H1Props) {
  return (
    <h1
      className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance"
      {...props}
    />
  )
}

export function H2(props: H2Props) {
  return (
    <h2
      className="mt-6 scroll-m-20 py-2 text-3xl font-semibold tracking-tight"
      {...props}
    />
  )
}

export function H3(props: H3Props) {
  return (
    <h3
      className="mt-4 scroll-m-20 text-2xl font-semibold tracking-tight"
      {...props}
    />
  )
}

export function H4(props: H4Props) {
  return (
    <h4
      className="mt-2 scroll-m-20 text-xl font-semibold tracking-tight"
      {...props}
    />
  )
}

export function H5(props: H5Props) {
  return (
    <h5
      className="mt-2 scroll-m-20 text-lg font-medium tracking-tight"
      {...props}
    />
  )
}

export function H6(props: H6Props) {
  return (
    <h6
      className="mt-2 scroll-m-20 text-base font-medium tracking-tight"
      {...props}
    />
  )
}

export function P(props: PProps) {
  return <p className="mt-2 leading-7 not-first:mt-4" {...props} />
}
