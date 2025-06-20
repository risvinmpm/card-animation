"use client";

import { useRef } from "react";
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

    ScrollTrigger.create({
      trigger: ".card-stack-wrapper",
      start: "top top",
      end: () => `+=${totalScrollHeight}`,
      pin: true,
      scrub: true,
    });

    cards.forEach((card, index) => {
      const frontEl = card.querySelector(".flip-card-front");
      const backEl = card.querySelector(".flip-card-back");

      // ✅ Ensure correct initial render
      gsap.set(frontEl, { rotateY: 0 });
      gsap.set(backEl, { rotateY: 180 });

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

      const staggerOffset = index * 0.05;
      const startOffset = 1 / 3 + staggerOffset;
      const endOffset = 2 / 3 + staggerOffset;

      ScrollTrigger.create({
        trigger: container.current.querySelector(".card-stack-wrapper"),
        start: "top top",
        end: () => `+=${totalScrollHeight}`,
        scrub: 1,
        id: `rotate-flip-${index}`,
        onUpdate: (self) => {
          const progress = self.progress;

          // ✅ Apply flip only between startOffset and endOffset
          if (progress >= startOffset && progress <= endOffset) {
            const animationProgress = (progress - startOffset) / (endOffset - startOffset);
            const frontRotation = -180 * animationProgress;
            const backRotation = 180 - 180 * animationProgress;
            const cardRotation = rotations[index] * (1 - animationProgress);

            gsap.set(frontEl, { rotateY: frontRotation });
            gsap.set(backEl, { rotateY: backRotation });
            gsap.set(card, {
              xPercent: -50,
              yPercent: -50,
              rotate: cardRotation,
            });
          } else if (progress < startOffset) {
            // ✅ Ensure it stays front-facing before flip starts
            gsap.set(frontEl, { rotateY: 0 });
            gsap.set(backEl, { rotateY: 180 });
          } else if (progress > endOffset) {
            // ✅ After full flip
            gsap.set(frontEl, { rotateY: -180 });
            gsap.set(backEl, { rotateY: 0 });
          }
        },
      });
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
