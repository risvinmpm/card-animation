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
