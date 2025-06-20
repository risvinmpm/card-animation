"use client";

import { useRef } from "react";
import ReactLenis from "@studio-freight/react-lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Card from "./components/Card";

gsap.registerPlugin(ScrollTrigger);

const flipCardsData = [
  {
    frontTitle: "Regulatory Compliance",
    backText:
      "Dubai’s Virtual Asset Regulatory Authority (VARA) ensures safety and transparency. B2NES adheres to these standards, so you can trade with confidence.",
    icon: "/card1.png",
  },
  {
    frontTitle: "Tax Benefits",
    backText:
      "Operating in Dubai’s free zones means no corporate tax and easy profit transfers, helping you maximize your earnings.",
    icon: "/card2.png",
  },
  {
    frontTitle: "Enhanced Security",
    backText:
      "Unlicensed platforms carry risks. B2NES uses MFA, encryption, and constant monitoring to keep your assets secure.",
    icon: "/card3.png",
  },
  {
    frontTitle: "Market Access",
    backText:
      "Dubai is a global crypto hub. B2NES connects you to this vibrant market, opening doors to new opportunities.",
    icon: "/card4.png",
  },
];

export default function Advantage() {
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
      end: `+=${totalScrollHeight}`,
      pin: true,
      scrub: true,
    });

    cards.forEach((card, index) => {
      const frontEl = card.querySelector(".flip-card-front");
      const backEl = card.querySelector(".flip-card-back");

      gsap.set(frontEl, { rotateY: 0 });
      gsap.set(backEl, { rotateY: 180 });

      gsap.to(card, {
        left: `${positions[index]}%`,
        rotation: rotations[index],
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top center",
          end: `+=${window.innerHeight}`,
          scrub: 0.5,
        },
      });

      const staggerOffset = index * 0.05;
      const startOffset = 1 / 3 + staggerOffset;
      const endOffset = 2 / 3 + staggerOffset;

      ScrollTrigger.create({
        trigger: container.current.querySelector(".card-stack-wrapper"),
        start: "top top",
        end: `+=${totalScrollHeight}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          if (progress >= startOffset && progress <= endOffset) {
            const animationProgress =
              (progress - startOffset) / (endOffset - startOffset);
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
            gsap.set(frontEl, { rotateY: 0 });
            gsap.set(backEl, { rotateY: 180 });
          } else if (progress > endOffset) {
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
          <h1>
            Trade Smarter with a Licensed Platform <br /> – The B2NES Advantage
          </h1>
        </section>

        <section className="card-stack-wrapper">
          {flipCardsData.map((card, index) => (
            <Card
              key={index}
              id={`card-${index + 1}`}
              frontTitle={card.frontTitle}
              frontSrc={card.icon}
              frontAlt={card.frontTitle}
              backText={card.backText}
              ref={(el) => (cardRefs.current[index] = el)}
            />
          ))}
        </section>

        <section className="footer">
          <h1>
            Dubai’s crypto market offers immense potential, but choosing the
            right platform is key to success.
            <br />
            Here’s why a licensed platform like B2NES gives you the edge.
          </h1>
        </section>
      </div>
    </ReactLenis>
  );
}
