"use client";

import React from "react";
import { Star } from "lucide-react";

export interface TestimonialItem {
  text: string;
  image: string;
  name: string;
  role: string;
  stars?: number;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
}) => {
  return (
    <div className={props.className}>
      <div className="flex flex-col gap-6 pb-6 bg-transparent">
        {props.testimonials.map(({ text, image, name, role, stars = 5 }, i) => (
          <div
            className="p-8 rounded-[2rem] border border-border/80 bg-card/60 backdrop-blur-md shadow-lg hover:border-accent/30 hover:shadow-glow-accent/5 transition-all duration-300 max-w-xs w-full text-left"
            key={`${name}-${i}`}
          >
            {/* Stars with accessible label */}
            <div
              className="flex items-center gap-1 mb-4"
              aria-label={`${stars} out of 5 stars`}
            >
              {[...Array(stars)].map((_, starIdx) => (
                <Star
                  key={starIdx}
                  className="w-3.5 h-3.5 fill-accent stroke-accent"
                  aria-hidden="true"
                />
              ))}
            </div>

            {/* Testimonial text — was broken as literal string "{text}", now correct JSX expression */}
            <div className="text-textPrimary text-sm font-semibold leading-relaxed mb-6">
              &ldquo;{text}&rdquo;
            </div>

            <div className="flex items-center gap-3">
              {/* Avatar is decorative since name is visible — alt="" */}
              <img
                width={40}
                height={40}
                src={image}
                alt=""
                className="h-10 w-10 rounded-full object-cover border border-border"
              />
              <div className="flex flex-col">
                <div className="font-heading font-bold text-white text-sm tracking-tight leading-4">
                  {name}
                </div>
                <div className="text-textMuted text-xs font-semibold leading-4">
                  {role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
