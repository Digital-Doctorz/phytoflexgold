import Image from "next/image"

const boswelliaImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuCKqCjO0y1v6fIQDQ2gebZSBntCrmmNY5xD8ocqwjC_gFo6N0nGsn8ZbO1anOmHesJWuj81qkraSDu9kDR_F59kpZg4eszlor4hgVwiEMUaOT5uO7hc3MFV2MlU45LcL-07BFyPU0qouFiA_Ieo4Z9SnTDmFUDufEviYauusOYJhZKWGXwWOlFhX6KQfZhdwTC_Zjg2qUdWP4u0v0dx8JoCYfeW_zOoYJetZcV_S6GeJhoRZl-t2BuWJlp5E4BiuL3XCAcXXHVsDhE"
const nirgundiImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuBO5Y4wV8QRjygkP-g05dhBOEyqi5Yws70TCrVDqSd2En706sUx2lsbLio0dlRFPj_HvfrEcx3ymtnHULM0BEkADXQU9kspi7tesZNZEFcTW9S585cc0ceLhtwHpiTjkEy4VJoLefUwZ2s7cVOnDfzveR9ee3gdCfF-GUyqOcxW3UraNcwr_F56f-Nks88NEG-wmrjo7CWtfACjwapvBmxmC8pv--Vlv44txXhj6tz_TxFbNK_zjsHhHO0IEkEOj3SupWVcDNPI3XU"
const malkangniImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuDEA0SW9g77h11IAUDFcZdkmiB4BjnEqa4TWeEqTrlB1bpgtamlRN0pRrE-xqD-KC0oU3FT5SW0yHKVEjqOhJvBvnddYmUDcRM82aVJfE_14XpnvcMWN1kEFYV6bCfQuHDT2LQcT4tEW_cW4oF3cdOgd0wBUAbRKDIz5idHfVOyVd3pa5KlshHwe7VahpazsyHMOvvNelhwz5-Rh6KDpxNoulkNHzxM-oxxpCcjBiUHd6fOy75fIm1cRvb7p5d6Z4fl-zywnUxWPTY"
const rosehipImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuAJrny6nYkQZ3GVTP2sD8R-VYV7YLuIEhstN3u6STSAxNHzMDQGXOscpwajLQOJ835FYPYPf8akzuXuINp71B7KhjOVY7aV-KkOumjGddyXDKiZsz1_6mnXlOqriFajg4cwZPiu6Gf6_11J6EJpPJF2qt9pcOCY2_UBsKuJXMAsIAl1Vh6dIuxxE6BpJ5ZLso76IqtB1R7Yj1dN4dPJSoFszToifUhEzfPnNSDQelt4UAhmspKqS-nMRB2O-SNwHVQzX6LcU8jOu9Q"
const gingerImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuBWWlBiL97whK4L7QecTELL1sshKeawFB34GLgVo1n8FdjM4ZAd-luFlamifbbJdz_8OzjsB_wkuqUtFPMVOntST72GLJrmlFpezkz0sAzOop8yULeyo68-KntZ-a8oU0jo_myHlqln4yu7qt2lH4XFxSGH4fPF0wzzacvS0VeUtU6euz9OMp0CH_ebeVs-y0FxQuehUsJtoHaeMawL2ckHO-XkjuBfDCS7SSfy0L79xvgsPhL9SIwFGzClQGqa_eV9qrUzCe8mYIA"
const hadjodImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuB_yJ1CM6FpdIVe1UPpYGrCMeSArKV43mapkmhwi2nCLZxYs7-5kGYWIaKtX5hWlp7Sp4QEjrPjlyNpoMqWxN3Z4ZlpNFp2Qk4sBy_wAsNmixMFF0_Jet6whJvOkjUiCL25EvGe9AYMbq9-Cr-lHNSjj53lgYu-J9D74ajFRXHRv6xSOpibYakK7SroH7NBEQyUlvFHa8X57wqdXItgJ-EvwUVKKXmucX-jnfvgGUa63g9kMr6euGysM7CYfiBfruiJvUVde5InLFI"
const fenugreekImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuDFs3nRQ4EGyR4gNBeKXlipvFx3FKz4rTQKyhanxms0UBTFwnUR8-NQyiAfnd-EfrCFtlKqYMDvCBeC3vQwD_LuXyLyJQmv6GhbP5ATy9zHkwV6nuWcm-N4is6774oDabZQbHTSQbY9t2QnNkXuqtiOQ8H8s1z3k76svrmPn7G-g44qk10RyqSCh4eY5RrC38-RD9Pk4bqdlJ_fIskrsUVDs6zU-6--fULttxuGT5LobDrnpxdlISCVq8ovFXYEKJ2NX8T5PZptmzg"
const ashwagandhaImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuCsrARNPYPPowsFluaKur1E40iZyPyz7M1uqOV9UbY0Ntl_0RAC6uAEBZNW1Nk-gPpsKDZLssMV55AOPUBMCOQQU1BMCyz7Vka1IiBapYj7fTn_doiKa-ESaIc7TZNvjW2n1O2-c2MZVXxGFE6lODEpYOyXCI9Yo1JkiBSHRpeUff5OnlNSIDity6LCERxtbDw6z-Nh9w8tKMDzVJZt0QVrE-xCRUpE7lMJ3VK2krBU9FjQ2f3G62wwu7NCyNxvvzKmdpu2yIQuoDc"
const bambooImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuClkvztZ8Xlvc94bFLW8Mqwr6U85Rkjf4SSwBYRazdy059xbwMz6YW4oKJm6cGkRLVRdnyCzigEP7l_I0zOTmpXb2ljh33NaGhbz3YZbu6ItxUYNtOJcIxN0S5IAUFppuybjbP-2b5k1bF5CPMYU7qOiTyeBXuCQc1AbcrWwZ7tBby9P7ZNS2uUR3ZwE5CAdbWXD4GmtssYa7eqz0lZeksujIecuyzrAxK8C8ZajQMQysO3jignmQrt8CXrfF2AS2-pdmuSI6wAiBI"
const rasnaImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuD-Y3YN6eHHa5p-BTGlBChxKzzmE98PXAJNHe4H2wYtVTsXIvmO1FjzWiJPdIooEtgHIOqW0L_aEkHwxbm2L7br8yzjIf3oMJ1aanE8PVvgw6i8n3KEpSCa_fzBNfnRer5dK7ZGrCDWHeHj8ZlB5ZgLllGQetlft0Jh97snWB3-IhVOlxjgT-w83DkX8H27cZlj8HSse8l7sZWBswtrDUp8m7alocDtanDwwO998w-yIN6vaUvX8K-97erdtJUxLEflI_tcLroxQmI"

const ingredients = [
  { name: "Boswellia Serrata", tag: "ACTIVE LIPOXYGENASE INHIBITOR", color: "text-primary-container", img: boswelliaImg, desc: "Derived from high-potency AKBA acids, our Boswellia extract provides superior 5-LOX inhibition. This clinical-grade resin is essential for rapid joint discomfort reduction and cellular integrity.", points: ["Superior 5-LOX Inflammation Inhibition", "Significantly Reduces Daily Discomfort", "Optimized Concentration of AKBA Acids"], side: "left" },
  { name: "Nirgundi", tag: "BIO-ACTIVE ANALGESIC", color: "text-secondary", img: nirgundiImg, desc: "A cornerstone of traditional recovery, Nirgundi offers powerful muscle relaxant and anti-histaminic support. Our extraction process preserves the delicate botanical profile for maximum biological uptake.", points: ["Powerful Bio-Active Pain Support", "Advanced Muscle Relaxant Properties", "Sustained Anti-Histaminic Support"], side: "right" },
]

const gallery = [
  { name: "Malkangni", desc: "Enhances neuro-signaling and provides critical cognitive clarity support during physical exertion.", img: malkangniImg },
  { name: "Rosehip", desc: "Rich in GOPO bio-actives, providing structural support for sensitive cartilage membranes.", img: rosehipImg },
  { name: "Ginger", desc: "Blocks PGE2 synthesis and provides a vital warming sensation to boost localized circulation.", img: gingerImg },
]

const foundations = [
  { name: "Ashwagandha", desc: "Adaptogenic cortisol management and physical stress recovery protocols.", img: ashwagandhaImg },
  { name: "Young Bamboo", desc: "High-silica organic source optimized for collagen synthesis and bone density.", img: bambooImg },
  { name: "Rasna", desc: "Traditional Ayurvedic relief for complex neuralgic and joint-related discomfort.", img: rasnaImg },
]

export function IngredientsSection() {
  return (
    <section className="py-32 bg-surface-container-low" id="ingredients" aria-labelledby="ingredients-heading">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter-md">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <p className="text-label-md font-semibold text-primary-container uppercase tracking-widest mb-4">
            CURATED FORMULATION
          </p>
          <h2
            id="ingredients-heading"
            className="text-display-sm md:text-display-lg font-extrabold leading-tight mb-6"
          >
            The Alchemy of Pure <span className="text-secondary italic">Botanical</span> Precision
          </h2>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            PhytoFlex Gold is a masterwork of molecular engineering. By targeting
            10 critical joint health biomarkers, we&apos;ve created an ecosystem of
            recovery powered by clinical-grade extractions.
          </p>
        </div>

        {/* Ingredient Cards */}
        <div className="space-y-40">
          {ingredients.map((ing, i) => (
            <article
              key={ing.name}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}
            >
              <div className={`overflow-hidden rounded-2xl shadow-2xl ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <Image
                  alt={`${ing.name} - key botanical ingredient in PhytoFlex Gold clinical joint supplement`}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 hover:scale-105"
                  src={ing.img}
                  loading="lazy"
                  width={800}
                  height={600}
                  unoptimized
                />
              </div>
              <div className={i % 2 === 1 ? "lg:order-1 lg:text-right" : ""}>
                <p className={`text-label-md font-semibold ${ing.color} uppercase tracking-widest mb-3`}>{ing.tag}</p>
                <h3 className="text-headline-lg font-bold mb-4">{ing.name}</h3>
                <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">{ing.desc}</p>
                <div className={`space-y-4 ${i % 2 === 1 ? "flex flex-col items-end" : ""}`}>
                  {ing.points.map((point, pi) => (
                    <div
                      key={pi}
                      className={`flex items-center gap-4 border-b border-white/5 pb-4 last:border-0 w-full ${i % 2 === 1 ? "justify-end" : ""}`}
                    >
                      <span className={`${ing.color} font-bold text-lg shrink-0`}>{String(pi + 1).padStart(2, "0")}</span>
                      <span className="text-body-md">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40">
          {gallery.map((item) => (
            <article key={item.name}>
              <div className="aspect-square overflow-hidden rounded-2xl mb-6">
                <Image
                  alt={`${item.name} - botanical ingredient in PhytoFlex Gold supplement`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  src={item.img}
                  loading="lazy"
                  width={400}
                  height={400}
                  unoptimized
                />
              </div>
              <h3 className="text-headline-md font-bold mb-2">{item.name}</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>

        {/* Bone & Resilience Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-40">
          <article className="flex gap-6 items-start bg-surface-container-lowest p-8 rounded-2xl border border-white/5">
            <div className="w-28 h-28 rounded-full shrink-0 overflow-hidden border-2 border-primary-container shadow-lg">
              <Image
                alt="Hadjod - bone-setting herb for connective tissue healing"
                className="w-full h-full object-cover"
                src={hadjodImg}
                loading="lazy"
                width={112}
                height={112}
                unoptimized
              />
            </div>
            <div>
              <h3 className="text-headline-md font-bold text-primary-container mb-3">Hadjod</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                The legendary &apos;Bone-Setter&apos; herb. Accelerates the healing of connective tissues and optimizes calcium absorption within the skeletal matrix for long-term density.
              </p>
            </div>
          </article>
          <article className="flex gap-6 items-start bg-surface-container-lowest p-8 rounded-2xl border border-white/5">
            <div className="w-28 h-28 rounded-full shrink-0 overflow-hidden border-2 border-secondary shadow-lg">
              <Image
                alt="Fenugreek - metabolic catalyst for enhanced bioavailability"
                className="w-full h-full object-cover"
                src={fenugreekImg}
                loading="lazy"
                width={112}
                height={112}
                unoptimized
              />
            </div>
            <div>
              <h3 className="text-headline-md font-bold text-secondary mb-3">Fenugreek</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                A metabolic catalyst providing anti-inflammatory support while significantly enhancing the bioavailability of other bio-active compounds in the formula.
              </p>
            </div>
          </article>
        </div>

        {/* Foundations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-surface-container-lowest/60 p-10 rounded-3xl border border-white/5 mt-40">
          {foundations.map((item) => (
            <article key={item.name} className="text-center">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl overflow-hidden shadow-lg grayscale hover:grayscale-0 transition-all duration-500">
                <Image
                  className="w-full h-full object-cover"
                  src={item.img}
                  alt={`${item.name} - foundational botanical in PhytoFlex Gold`}
                  loading="lazy"
                  width={80}
                  height={80}
                  unoptimized
                />
              </div>
              <h4 className="text-headline-md font-bold mb-2">{item.name}</h4>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
