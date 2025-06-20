import { forwardRef } from "react";
import Image from "next/image";

const Card = forwardRef(({ id, frontSrc, frontAlt, frontTitle, backText }, ref) => {
  return (
    <div className="cards" id={id} ref={ref}>
      <div className="card-wrapper">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <Image src={frontSrc} alt={frontAlt} width={100} height={100} />
            <h2>{frontTitle}</h2>
          </div>
          <div className="flip-card-back">
            <p>{backText}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Card;
