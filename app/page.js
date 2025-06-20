"use client";

import { useEffect, useRef } from "react";
import Card from "./components/Card";
import ReactLenis from "@studio-freight/react-lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(() => {
    const cards = cardRefs.current;
    const totalScrollHeight = window.innerHeight * 3;
    const positions = [14, 38, 62, 86];
    const rotations = [-15, -7.5, 7.5, 15];

    // Pin the wrapper that contains the card stack
    ScrollTrigger.create({
      trigger: ".card-stack-wrapper",
      start: "top top",
      end: () => `+=${totalScrollHeight}`,
      pin: true,
      scrub: true,
    });

    cards.forEach((card, index) => {
      gsap.to(card, {
        left: `${positions[index]}%`,
        rotation: rotations[index],
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top center",
          end: () => `+=${window.innerHeight}`,
          scrub: 0.5,
        },
      });
    });

    cards.forEach((cards, index)=>{
      const frontEl = cards.querySelector(".flip-card-front");
      const backEl = cards.querySelector(".flip-card-back");

      const staggerOffset = index * 0.05;
      const startOffset = 1 / 3 + staggerOffset;
      const endOffset = 2 / 3 + staggerOffset;


      ScrollTrigger.create({
        trigger: container.current.querySelector(".cards"),
        start: "top top",
        end: () => `+=${totalScrollHeight}`,
        scrub: 1,
        id: `rotate-flip-${index}`,
        onUpdate: (self) => {
          const progress = self.progress;
          if(progress >= staggerOffset && progress <= endOffset) {
            const animationProgress = (progress - startOffset) / ( 1 / 3 );
            const frontRotation = -180 * animationProgress;
            const backRotation = 180 - 180 * animationProgress;
            const cardRotation = rotations[index] * ( 1 - animationProgress );


            gsap.to(frontEl, { rotateY: frontRotation, ease: "power1.out"});
            gsap.to(backEl, { rotateY: backRotation, ease: "power1.out"});
            gsap.to(cards, {
              xPercent: -50,
              yPercent: -50,
              rotate: cardRotation,
              ease: "power1.out"
            })
          }
        }
      })
    });
    

  }, { scope: container });

  return (
    <ReactLenis root>
      <div className="container" ref={container}>
        <section className="hero">
          <h1>keep scrolling to <br /> reveal the cards</h1>
        </section>

        <section className="card-stack-wrapper">
          {[...Array(4)].map((_, index) => (
            <Card
              key={index}
              id={`card-${index + 1}`}
              frontSrc="/window.svg"
              frontAlt="card image"
              backText="your card details appear here"
              ref={(el) => (cardRefs.current[index] = el)}
            />
          ))}
        </section>

        <section className="footer">
          <h1>Footer or upcoming section</h1>
        </section>
      </div>
    </ReactLenis>
  );
}
