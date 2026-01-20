"use client"
import { useScroll, useTransform } from "motion/react"
import React, { useEffect } from "react"
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect"

export default function GoogleGeminiEffectDemo() {
  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2])
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2])
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2])
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2])
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2])

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((value) => {
      if (value >= 0.95) {
        // Animation is nearly complete
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }, 500)
      }
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <div
      className="h-[400vh] bg-black w-full border border-white/[0.1] rounded-md relative pt-40 overflow-clip"
      ref={ref}
    >
      <GoogleGeminiEffect
        pathLengths={[pathLengthFirst, pathLengthSecond, pathLengthThird, pathLengthFourth, pathLengthFifth]}
      />
    </div>
  )
}
