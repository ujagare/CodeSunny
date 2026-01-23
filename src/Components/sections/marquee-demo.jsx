import { Marquee } from "../ui/marquee"

const Logos = {
  sundown: () => (
    <img src="/src/assets/images/clint logos/64d3dd9edfb41666c35b15c2_Sundown logo.svg" alt="Sundown" className="w-auto max-w-[120px] h-auto grayscale opacity-70" />
  ),
  greenspaces: () => (
    <img src="/src/assets/images/clint logos/Greenspacess_Black BG Logo.png" alt="Greenspaces" className="w-auto max-w-[120px] h-auto grayscale opacity-70" />
  ),
  landwise: () => (
    <img src="/src/assets/images/clint logos/Landwise Logo_Website.png" alt="Landwise" className="w-auto max-w-[120px] h-auto grayscale opacity-70" />
  ),
  oasis: () => (
    <img src="/src/assets/images/clint logos/Oasis Logo.png" alt="Oasis" className="w-auto max-w-[120px] h-auto grayscale opacity-70" />
  ),
  satvik: () => (
    <img src="/src/assets/images/clint logos/Satvik logo.webp" alt="Satvik" className="w-auto max-w-[120px] h-auto grayscale opacity-70" />
  ),
  swadist: () => (
    <img src="/src/assets/images/clint logos/swadistbitelogo.png" alt="Swadist" className="w-auto max-w-[120px] h-auto grayscale opacity-70" />
  ),
  twogood: () => (
    <img src="/src/assets/images/clint logos/two good.png" alt="Two Good" className="w-auto max-w-[120px] h-auto grayscale opacity-70" />
  ),
  vibha: () => (
    <img src="/src/assets/images/clint logos/vibha.png" alt="Vibha" className="w-auto max-w-[120px] h-auto grayscale opacity-70" />
  ),
  wing: () => (
    <img src="/src/assets/images/clint logos/WING LOGO.png" alt="Wing" className="w-auto max-w-[120px] h-auto grayscale opacity-70" />
  ),
};

export function MarqueeDemo() {
  const arr = [Logos.sundown, Logos.greenspaces, Logos.landwise, Logos.oasis, Logos.satvik, Logos.swadist, Logos.twogood, Logos.vibha, Logos.wing, Logos.sundown, Logos.greenspaces, Logos.landwise, Logos.oasis, Logos.satvik, Logos.swadist, Logos.twogood, Logos.vibha, Logos.wing]

  return (
    <Marquee speed={20}>
      {arr.map((Logo, index) => (
        <div
          key={index}
          className="relative w-fit flex items-center justify-start"
        >
          <Logo />
        </div>
      ))}
    </Marquee>
  )
}
